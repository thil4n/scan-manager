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

type postgresReleaseRepo struct {
	pool   *pgxpool.Pool
	logger zerolog.Logger
}

// NewReleaseRepository creates a PostgreSQL-backed ReleaseRepository.
func NewReleaseRepository(pool *pgxpool.Pool, logger zerolog.Logger) ReleaseRepository {
	return &postgresReleaseRepo{pool: pool, logger: logger}
}

func (r *postgresReleaseRepo) Create(ctx context.Context, release *domain.Release) error {
	release.ID = uuid.New()
	release.CreatedAt = time.Now().UTC()
	release.OverallStatus = domain.ScanStatusQueued

	_, err := r.pool.Exec(ctx,
		`INSERT INTO releases
			(id, product_name, version, submitted_by, created_at, overall_status,
			 branch, jira_ticket, artifact_type, artifact_name, docker_image, docker_tag)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
		release.ID, release.ProductName, release.Version, release.SubmittedBy,
		release.CreatedAt, release.OverallStatus,
		release.Branch, release.JiraTicket, release.ArtifactType,
		release.ArtifactName, release.DockerImage, release.DockerTag,
	)
	if err != nil {
		return fmt.Errorf("insert release: %w", err)
	}

	r.logger.Debug().Str("release_id", release.ID.String()).Msg("release created")
	return nil
}

func (r *postgresReleaseRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Release, error) {
	rel := &domain.Release{}
	err := r.pool.QueryRow(ctx,
		`SELECT id, product_name, version, submitted_by, created_at, overall_status,
		        branch, jira_ticket, artifact_type, artifact_name, docker_image, docker_tag
		 FROM releases WHERE id = $1`, id,
	).Scan(
		&rel.ID, &rel.ProductName, &rel.Version, &rel.SubmittedBy,
		&rel.CreatedAt, &rel.OverallStatus,
		&rel.Branch, &rel.JiraTicket, &rel.ArtifactType,
		&rel.ArtifactName, &rel.DockerImage, &rel.DockerTag,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("get release by id: %w", err)
	}
	return rel, nil
}

func (r *postgresReleaseRepo) List(ctx context.Context, page, pageSize int) ([]domain.Release, int64, error) {
	var totalCount int64
	err := r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM releases").Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("count releases: %w", err)
	}

	offset := (page - 1) * pageSize

	rows, err := r.pool.Query(ctx,
		`SELECT id, product_name, version, submitted_by, created_at, overall_status,
		        branch, jira_ticket, artifact_type, artifact_name, docker_image, docker_tag
		 FROM releases ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		pageSize, offset,
	)
	if err != nil {
		return nil, 0, fmt.Errorf("list releases: %w", err)
	}
	defer rows.Close()

	var releases []domain.Release
	for rows.Next() {
		var rel domain.Release
		if err := rows.Scan(
			&rel.ID, &rel.ProductName, &rel.Version, &rel.SubmittedBy,
			&rel.CreatedAt, &rel.OverallStatus,
			&rel.Branch, &rel.JiraTicket, &rel.ArtifactType,
			&rel.ArtifactName, &rel.DockerImage, &rel.DockerTag,
		); err != nil {
			return nil, 0, fmt.Errorf("scan release row: %w", err)
		}
		releases = append(releases, rel)
	}

	return releases, totalCount, nil
}

func (r *postgresReleaseRepo) UpdateOverallStatus(ctx context.Context, id uuid.UUID, status domain.ScanStatus) error {
	_, err := r.pool.Exec(ctx,
		"UPDATE releases SET overall_status = $1 WHERE id = $2",
		status, id,
	)
	if err != nil {
		return fmt.Errorf("update release status: %w", err)
	}
	return nil
}
