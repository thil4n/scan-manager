package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"golang.org/x/crypto/bcrypt"
)

// SeedAdminUser creates a default admin user if no users exist.
func SeedAdminUser(ctx context.Context, pool *pgxpool.Pool, logger zerolog.Logger) error {
	var count int
	err := pool.QueryRow(ctx, "SELECT COUNT(*) FROM users").Scan(&count)
	if err != nil {
		return fmt.Errorf("count users: %w", err)
	}

	if count > 0 {
		logger.Debug().Msg("users already exist, skipping seed")
		return nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}

	_, err = pool.Exec(ctx,
		`INSERT INTO users (email, password_hash, full_name, role)
		 VALUES ($1, $2, $3, $4)`,
		"admin@acme.io", string(hash), "Admin User", "admin",
	)
	if err != nil {
		return fmt.Errorf("insert admin user: %w", err)
	}

	logger.Info().Str("email", "admin@acme.io").Msg("seeded default admin user")
	return nil
}
