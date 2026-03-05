package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
	"github.com/scan-manager/backend/internal/repository"
)

// ReleaseService encapsulates release business logic.
type ReleaseService struct {
	releaseRepo repository.ReleaseRepository
	scanRepo    repository.ScanRepository
	findingRepo repository.FindingRepository
	queueClient QueueClient
	logger      zerolog.Logger
}

// QueueClient is a minimal interface for enqueueing scan jobs.
type QueueClient interface {
	EnqueueScanJob(ctx context.Context, scanID uuid.UUID, releaseID uuid.UUID, scanType domain.ScanType) error
}

// NewReleaseService creates a new ReleaseService.
func NewReleaseService(
	releaseRepo repository.ReleaseRepository,
	scanRepo repository.ScanRepository,
	findingRepo repository.FindingRepository,
	queueClient QueueClient,
	logger zerolog.Logger,
) *ReleaseService {
	return &ReleaseService{
		releaseRepo: releaseRepo,
		scanRepo:    scanRepo,
		findingRepo: findingRepo,
		queueClient: queueClient,
		logger:      logger,
	}
}

// CreateRelease validates, persists, creates scans, and enqueues jobs.
func (s *ReleaseService) CreateRelease(ctx context.Context, req domain.CreateReleaseRequest, submittedBy string) (*domain.Release, error) {
	release := &domain.Release{
		ProductName:  req.ProductName,
		Version:      req.Version,
		SubmittedBy:  submittedBy,
		Branch:       req.Branch,
		JiraTicket:   req.JiraTicket,
		ArtifactType: domain.ArtifactType(req.ArtifactType),
		ArtifactName: req.ArtifactName,
		DockerImage:  req.DockerImage,
		DockerTag:    req.DockerTag,
	}

	if err := s.releaseRepo.Create(ctx, release); err != nil {
		return nil, fmt.Errorf("create release: %w", err)
	}

	s.logger.Info().
		Str("release_id", release.ID.String()).
		Str("product", release.ProductName).
		Str("version", release.Version).
		Msg("release created")

	// Create scan jobs for each requested scan type
	var scans []domain.Scan
	for _, scanTypeStr := range req.ScanTypes {
		scanType := domain.ScanType(scanTypeStr)
		scan := &domain.Scan{
			ReleaseID: release.ID,
			Type:      scanType,
		}

		if err := s.scanRepo.Create(ctx, scan); err != nil {
			return nil, fmt.Errorf("create scan job (%s): %w", scanType, err)
		}

		// Enqueue the scan job for async processing
		if err := s.queueClient.EnqueueScanJob(ctx, scan.ID, release.ID, scanType); err != nil {
			s.logger.Error().Err(err).
				Str("scan_id", scan.ID.String()).
				Str("type", string(scanType)).
				Msg("failed to enqueue scan job")
			// Continue — the job can be retried manually
		}

		scans = append(scans, *scan)
	}

	release.Scans = scans
	return release, nil
}

// GetRelease retrieves a release with all scans and findings.
func (s *ReleaseService) GetRelease(ctx context.Context, id uuid.UUID) (*domain.Release, error) {
	release, err := s.releaseRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get release: %w", err)
	}
	if release == nil {
		return nil, nil
	}

	scans, err := s.scanRepo.ListByReleaseID(ctx, release.ID)
	if err != nil {
		return nil, fmt.Errorf("list scans: %w", err)
	}

	// Load findings for each scan
	for i := range scans {
		findings, err := s.findingRepo.ListByScanID(ctx, scans[i].ID)
		if err != nil {
			return nil, fmt.Errorf("list findings for scan %s: %w", scans[i].ID, err)
		}
		if findings == nil {
			findings = []domain.Finding{}
		}
		scans[i].Findings = findings
	}

	release.Scans = scans
	return release, nil
}

// ListReleases returns paginated releases with their scans.
func (s *ReleaseService) ListReleases(ctx context.Context, page, pageSize int) ([]domain.Release, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	releases, total, err := s.releaseRepo.List(ctx, page, pageSize)
	if err != nil {
		return nil, 0, fmt.Errorf("list releases: %w", err)
	}

	// Load scans for each release
	for i := range releases {
		scans, err := s.scanRepo.ListByReleaseID(ctx, releases[i].ID)
		if err != nil {
			return nil, 0, fmt.Errorf("list scans for release %s: %w", releases[i].ID, err)
		}
		if scans == nil {
			scans = []domain.Scan{}
		}
		// For list view, include empty findings array for each scan
		for j := range scans {
			if scans[j].Findings == nil {
				scans[j].Findings = []domain.Finding{}
			}
		}
		releases[i].Scans = scans
	}

	return releases, total, nil
}

// RetriggerScan resets a scan to QUEUED and re-enqueues it.
func (s *ReleaseService) RetriggerScan(ctx context.Context, scanID uuid.UUID) (*domain.Scan, error) {
	scan, err := s.scanRepo.GetByID(ctx, scanID)
	if err != nil {
		return nil, fmt.Errorf("get scan: %w", err)
	}
	if scan == nil {
		return nil, nil
	}

	if err := s.scanRepo.UpdateStatus(ctx, scanID, domain.ScanStatusQueued); err != nil {
		return nil, fmt.Errorf("reset scan status: %w", err)
	}

	if err := s.queueClient.EnqueueScanJob(ctx, scan.ID, scan.ReleaseID, scan.Type); err != nil {
		return nil, fmt.Errorf("enqueue scan job: %w", err)
	}

	// Also reset release to RUNNING if it was PASS or FAIL
	if err := s.releaseRepo.UpdateOverallStatus(ctx, scan.ReleaseID, domain.ScanStatusRunning); err != nil {
		s.logger.Error().Err(err).Msg("failed to update release status on retrigger")
	}

	scan.Status = domain.ScanStatusQueued
	scan.Summary = domain.ScanSummary{}
	scan.Findings = []domain.Finding{}
	return scan, nil
}
