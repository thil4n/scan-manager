package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

type postgresFindingRepo struct {
	pool   *pgxpool.Pool
	logger zerolog.Logger
}

// NewFindingRepository creates a PostgreSQL-backed FindingRepository.
func NewFindingRepository(pool *pgxpool.Pool, logger zerolog.Logger) FindingRepository {
	return &postgresFindingRepo{pool: pool, logger: logger}
}

func (r *postgresFindingRepo) CreateBatch(ctx context.Context, findings []domain.Finding) error {
	if len(findings) == 0 {
		return nil
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	for i := range findings {
		findings[i].ID = uuid.New()
		_, err := tx.Exec(ctx,
			`INSERT INTO findings (id, scan_id, title, severity, description, file)
			 VALUES ($1,$2,$3,$4,$5,$6)`,
			findings[i].ID, findings[i].ScanID, findings[i].Title,
			findings[i].Severity, findings[i].Description, findings[i].File,
		)
		if err != nil {
			return fmt.Errorf("insert finding %d: %w", i, err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit findings: %w", err)
	}

	r.logger.Debug().Int("count", len(findings)).Msg("findings batch inserted")
	return nil
}

func (r *postgresFindingRepo) ListByScanID(ctx context.Context, scanID uuid.UUID) ([]domain.Finding, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, scan_id, title, severity, description, file
		 FROM findings WHERE scan_id = $1 ORDER BY
		 CASE severity
			WHEN 'CRITICAL' THEN 1
			WHEN 'HIGH' THEN 2
			WHEN 'MEDIUM' THEN 3
			WHEN 'LOW' THEN 4
		 END`, scanID,
	)
	if err != nil {
		return nil, fmt.Errorf("list findings: %w", err)
	}
	defer rows.Close()

	var findings []domain.Finding
	for rows.Next() {
		var f domain.Finding
		if err := rows.Scan(&f.ID, &f.ScanID, &f.Title, &f.Severity, &f.Description, &f.File); err != nil {
			return nil, fmt.Errorf("scan finding row: %w", err)
		}
		findings = append(findings, f)
	}

	return findings, nil
}
