package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/scan-manager/backend/internal/domain"
)

// ReleaseRepository defines persistence operations for releases.
type ReleaseRepository interface {
	Create(ctx context.Context, release *domain.Release) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Release, error)
	List(ctx context.Context, page, pageSize int) ([]domain.Release, int64, error)
	UpdateOverallStatus(ctx context.Context, id uuid.UUID, status domain.ScanStatus) error
}

// ScanRepository defines persistence operations for scans.
type ScanRepository interface {
	Create(ctx context.Context, scan *domain.Scan) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Scan, error)
	ListByReleaseID(ctx context.Context, releaseID uuid.UUID) ([]domain.Scan, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.ScanStatus) error
	UpdateResults(ctx context.Context, scan *domain.Scan) error
}

// FindingRepository defines persistence operations for findings.
type FindingRepository interface {
	CreateBatch(ctx context.Context, findings []domain.Finding) error
	ListByScanID(ctx context.Context, scanID uuid.UUID) ([]domain.Finding, error)
}

// UserRepository defines persistence operations for users.
type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	Create(ctx context.Context, user *domain.User) error
}
