package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"

	"github.com/scan-manager/backend/internal/config"
	"github.com/scan-manager/backend/internal/database"
	"github.com/scan-manager/backend/internal/domain"
	"github.com/scan-manager/backend/internal/handler"
	"github.com/scan-manager/backend/internal/middleware"
	"github.com/scan-manager/backend/internal/queue"
	"github.com/scan-manager/backend/internal/repository"
	"github.com/scan-manager/backend/internal/service"
)

func main() {
	// ── Logger ────────────────────────────────────────────────────────────
	logger := zerolog.New(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339}).
		With().
		Timestamp().
		Caller().
		Logger()

	// ── Config ────────────────────────────────────────────────────────────
	cfg, err := config.Load()
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to load config")
	}

	// ── Database ──────────────────────────────────────────────────────────
	ctx := context.Background()

	pool, err := database.NewPostgresPool(ctx, cfg.DB, logger)
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer pool.Close()

	if err := database.RunMigrations(ctx, pool, logger); err != nil {
		logger.Fatal().Err(err).Msg("failed to run migrations")
	}

	if err := database.SeedAdminUser(ctx, pool, logger); err != nil {
		logger.Warn().Err(err).Msg("failed to seed admin user")
	}

	// ── Repositories ──────────────────────────────────────────────────────
	releaseRepo := repository.NewReleaseRepository(pool, logger)
	scanRepo := repository.NewScanRepository(pool, logger)
	findingRepo := repository.NewFindingRepository(pool, logger)
	userRepo := repository.NewUserRepository(pool, logger)

	// ── Queue Client ──────────────────────────────────────────────────────
	queueClient := queue.NewClient(cfg.Redis.Addr, cfg.Redis.Password, cfg.Redis.DB, logger)
	defer queueClient.Close()

	// ── Services ──────────────────────────────────────────────────────────
	authService := service.NewAuthService(userRepo, cfg.JWT, logger)
	releaseService := service.NewReleaseService(releaseRepo, scanRepo, findingRepo, queueClient, logger)

	// ── Validator ─────────────────────────────────────────────────────────
	validate := validator.New(validator.WithRequiredStructEnabled())

	// ── Handlers ──────────────────────────────────────────────────────────
	healthHandler := handler.NewHealthHandler()
	authHandler := handler.NewAuthHandler(authService, validate, logger)
	releaseHandler := handler.NewReleaseHandler(releaseService, validate, logger)

	// ── Router ────────────────────────────────────────────────────────────
	r := chi.NewRouter()

	// Global middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(middleware.RequestLogger(logger))
	r.Use(middleware.Recoverer(logger))
	r.Use(middleware.MaxBodySize(cfg.Upload.MaxSizeMB * 1024 * 1024))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Public routes
	r.Route("/api", func(r chi.Router) {
		r.Get("/health", healthHandler.Health)
		r.Post("/auth/login", authHandler.Login)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(middleware.JWTAuth(authService))

			// Releases — accessible to all authenticated users
			r.Get("/releases", releaseHandler.List)
			r.Get("/releases/{id}", releaseHandler.GetByID)

			// Release creation — admin and user roles only
			r.With(middleware.RoleGuard(domain.RoleAdmin, domain.RoleUser)).
				Post("/releases", releaseHandler.Create)

			// Scan retrigger — admin and user roles only
			r.With(middleware.RoleGuard(domain.RoleAdmin, domain.RoleUser)).
				Post("/scans/{id}/retrigger", releaseHandler.RetriggerScan)
		})
	})

	// ── Server ────────────────────────────────────────────────────────────
	addr := fmt.Sprintf(":%s", cfg.App.Port)
	srv := &http.Server{
		Addr:         addr,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGTERM)

	go func() {
		logger.Info().Str("addr", addr).Str("env", cfg.App.Env).Msg("API server starting")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal().Err(err).Msg("server failed")
		}
	}()

	<-done
	logger.Info().Msg("shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error().Err(err).Msg("server forced shutdown")
	}

	logger.Info().Msg("server stopped")
}
