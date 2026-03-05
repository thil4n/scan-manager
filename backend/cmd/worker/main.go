package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog"

	"github.com/scan-manager/backend/internal/config"
	"github.com/scan-manager/backend/internal/database"
	"github.com/scan-manager/backend/internal/integration"
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

	// ── Repositories ──────────────────────────────────────────────────────
	releaseRepo := repository.NewReleaseRepository(pool, logger)
	scanRepo := repository.NewScanRepository(pool, logger)
	findingRepo := repository.NewFindingRepository(pool, logger)

	// ── Integration Registry ──────────────────────────────────────────────
	registry := integration.NewRegistry(logger)

	// ── Policy Service ────────────────────────────────────────────────────
	policyService := service.NewPolicyService(logger)

	// ── Scan Worker ───────────────────────────────────────────────────────
	scanWorker := queue.NewScanWorker(
		scanRepo,
		releaseRepo,
		findingRepo,
		registry,
		policyService,
		logger,
	)

	// ── Asynq Server ─────────────────────────────────────────────────────
	srv := queue.NewServer(cfg.Redis.Addr, cfg.Redis.Password, cfg.Redis.DB, 10)

	mux := asynq.NewServeMux()
	mux.HandleFunc(queue.TypeScanJob, scanWorker.HandleScanJob)

	// Graceful shutdown
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGTERM)

	go func() {
		logger.Info().Msg("scan worker starting...")
		if err := srv.Run(mux); err != nil {
			logger.Fatal().Err(err).Msg("worker server failed")
		}
	}()

	<-done
	logger.Info().Msg("shutting down worker...")
	srv.Shutdown()
	logger.Info().Msg("worker stopped")
}
