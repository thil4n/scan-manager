package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
)

// migrations are ordered DDL statements run on startup.
var migrations = []string{
	`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

	// Users
	`CREATE TABLE IF NOT EXISTS users (
		id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		email       VARCHAR(255) NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		full_name   VARCHAR(255) NOT NULL,
		role        VARCHAR(50)  NOT NULL DEFAULT 'user',
		created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
	)`,

	// Releases
	`CREATE TABLE IF NOT EXISTS releases (
		id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		product_name    VARCHAR(255) NOT NULL,
		version         VARCHAR(100) NOT NULL,
		submitted_by    VARCHAR(255) NOT NULL,
		created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
		overall_status  VARCHAR(50)  NOT NULL DEFAULT 'QUEUED',
		branch          VARCHAR(255),
		jira_ticket     VARCHAR(100),
		artifact_type   VARCHAR(50)  NOT NULL DEFAULT 'file',
		artifact_name   VARCHAR(500),
		docker_image    VARCHAR(500),
		docker_tag      VARCHAR(255)
	)`,

	`CREATE INDEX IF NOT EXISTS idx_releases_overall_status ON releases(overall_status)`,
	`CREATE INDEX IF NOT EXISTS idx_releases_product_name ON releases(product_name)`,
	`CREATE INDEX IF NOT EXISTS idx_releases_created_at ON releases(created_at DESC)`,

	// Scans
	`CREATE TABLE IF NOT EXISTS scans (
		id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		release_id  UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
		type        VARCHAR(50) NOT NULL,
		status      VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
		critical    INT NOT NULL DEFAULT 0,
		high        INT NOT NULL DEFAULT 0,
		medium      INT NOT NULL DEFAULT 0,
		low         INT NOT NULL DEFAULT 0,
		started_at  TIMESTAMPTZ,
		ended_at    TIMESTAMPTZ,
		created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,

	`CREATE INDEX IF NOT EXISTS idx_scans_release_id ON scans(release_id)`,
	`CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status)`,

	// Findings
	`CREATE TABLE IF NOT EXISTS findings (
		id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		scan_id     UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
		title       VARCHAR(500) NOT NULL,
		severity    VARCHAR(50)  NOT NULL,
		description TEXT NOT NULL,
		file        VARCHAR(500)
	)`,

	`CREATE INDEX IF NOT EXISTS idx_findings_scan_id ON findings(scan_id)`,
	`CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity)`,
}

// RunMigrations executes all migrations sequentially.
func RunMigrations(ctx context.Context, pool *pgxpool.Pool, logger zerolog.Logger) error {
	for i, m := range migrations {
		if _, err := pool.Exec(ctx, m); err != nil {
			return fmt.Errorf("migration %d failed: %w", i, err)
		}
	}
	logger.Info().Int("count", len(migrations)).Msg("database migrations applied")
	return nil
}
