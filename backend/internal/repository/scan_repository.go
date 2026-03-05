package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

type postgresScanRepo struct {
	pool   *pgxpool.Pool
	logger zerolog.Logger
}

// NewScanRepository creates a PostgreSQL-backed ScanRepository.
func NewScanRepository(pool *pgxpool.Pool, logger zerolog.Logger) ScanRepository {
	return &postgresScanRepo{pool: pool, logger: logger}
}

func (r *postgresScanRepo) Create(ctx context.Context, scan *domain.Scan) error {
	scan.ID = uuid.New()
	scan.CreatedAt = time.Now().UTC()
	scan.Status = domain.ScanStatusQueued

	_, err := r.pool.Exec(ctx,
		`INSERT INTO scans (id, release_id, type, status, critical, high, medium, low, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		scan.ID, scan.ReleaseID, scan.Type, scan.Status,
		scan.Summary.Critical, scan.Summary.High, scan.Summary.Medium, scan.Summary.Low,
		scan.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert scan: %w", err)
	}

	r.logger.Debug().
		Str("scan_id", scan.ID.String()).
		Str("type", string(scan.Type)).
		Msg("scan created")
	return nil
}

func (r *postgresScanRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Scan, error) {
	scan := &domain.Scan{}
	err := r.pool.QueryRow(ctx,
		`SELECT id, release_id, type, status, critical, high, medium, low,
		        started_at, ended_at, created_at
		 FROM scans WHERE id = $1`, id,
	).Scan(
		&scan.ID, &scan.ReleaseID, &scan.Type, &scan.Status,
		&scan.Summary.Critical, &scan.Summary.High, &scan.Summary.Medium, &scan.Summary.Low,
		&scan.StartedAt, &scan.EndedAt, &scan.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("get scan by id: %w", err)
	}
	return scan, nil
}

func (r *postgresScanRepo) ListByReleaseID(ctx context.Context, releaseID uuid.UUID) ([]domain.Scan, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, release_id, type, status, critical, high, medium, low,
		        started_at, ended_at, created_at
		 FROM scans WHERE release_id = $1 ORDER BY created_at`, releaseID,
	)
	if err != nil {
		return nil, fmt.Errorf("list scans by release: %w", err)
	}
	defer rows.Close()

	var scans []domain.Scan
	for rows.Next() {
		var s domain.Scan
		if err := rows.Scan(
			&s.ID, &s.ReleaseID, &s.Type, &s.Status,
			&s.Summary.Critical, &s.Summary.High, &s.Summary.Medium, &s.Summary.Low,
			&s.StartedAt, &s.EndedAt, &s.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan row: %w", err)
		}
		scans = append(scans, s)
	}

	return scans, nil
}

func (r *postgresScanRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.ScanStatus) error {
	query := "UPDATE scans SET status = $1"
	args := []interface{}{status, id}

	switch status {
	case domain.ScanStatusRunning:
		query += ", started_at = NOW()"
	case domain.ScanStatusPass, domain.ScanStatusFail:
		query += ", ended_at = NOW()"
	}

	query += " WHERE id = $2"

	_, err := r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("update scan status: %w", err)
	}
	return nil
}

func (r *postgresScanRepo) UpdateResults(ctx context.Context, scan *domain.Scan) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE scans SET status = $1, critical = $2, high = $3, medium = $4, low = $5, ended_at = NOW()
		 WHERE id = $6`,
		scan.Status, scan.Summary.Critical, scan.Summary.High, scan.Summary.Medium, scan.Summary.Low,
		scan.ID,
	)
	if err != nil {
		return fmt.Errorf("update scan results: %w", err)
	}
	return nil
}
