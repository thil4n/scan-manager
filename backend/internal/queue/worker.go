package queue

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
	"github.com/scan-manager/backend/internal/integration"
	"github.com/scan-manager/backend/internal/repository"
	"github.com/scan-manager/backend/internal/service"
)

// ScanWorker processes scan jobs from the queue.
type ScanWorker struct {
	scanRepo    repository.ScanRepository
	releaseRepo repository.ReleaseRepository
	findingRepo repository.FindingRepository
	registry    *integration.Registry
	policy      *service.PolicyService
	logger      zerolog.Logger
}

// NewScanWorker creates a new ScanWorker.
func NewScanWorker(
	scanRepo repository.ScanRepository,
	releaseRepo repository.ReleaseRepository,
	findingRepo repository.FindingRepository,
	registry *integration.Registry,
	policy *service.PolicyService,
	logger zerolog.Logger,
) *ScanWorker {
	return &ScanWorker{
		scanRepo:    scanRepo,
		releaseRepo: releaseRepo,
		findingRepo: findingRepo,
		registry:    registry,
		policy:      policy,
		logger:      logger,
	}
}

// HandleScanJob processes a single scan job.
func (w *ScanWorker) HandleScanJob(ctx context.Context, t *asynq.Task) error {
	var payload ScanJobPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return fmt.Errorf("unmarshal payload: %w", err)
	}

	logger := w.logger.With().
		Str("scan_id", payload.ScanID.String()).
		Str("release_id", payload.ReleaseID.String()).
		Str("scan_type", string(payload.ScanType)).
		Logger()

	logger.Info().Msg("processing scan job")

	// 1. Mark scan as RUNNING
	if err := w.scanRepo.UpdateStatus(ctx, payload.ScanID, domain.ScanStatusRunning); err != nil {
		return fmt.Errorf("update scan to running: %w", err)
	}

	// 2. Get the release for the scanner
	release, err := w.releaseRepo.GetByID(ctx, payload.ReleaseID)
	if err != nil {
		return fmt.Errorf("get release: %w", err)
	}
	if release == nil {
		return fmt.Errorf("release %s not found", payload.ReleaseID)
	}

	// 3. Get the appropriate scanner
	scanner, err := w.registry.Get(payload.ScanType)
	if err != nil {
		return fmt.Errorf("get scanner: %w", err)
	}

	// 4. Execute the scan
	result, err := scanner.Execute(ctx, release)
	if err != nil {
		// Mark as FAIL on error
		logger.Error().Err(err).Msg("scan execution failed")
		_ = w.scanRepo.UpdateStatus(ctx, payload.ScanID, domain.ScanStatusFail)
		// Still evaluate policy and continue
		return w.evaluateAndUpdateRelease(ctx, payload, logger)
	}

	// 5. Update scan with results
	scan, err := w.scanRepo.GetByID(ctx, payload.ScanID)
	if err != nil {
		return fmt.Errorf("get scan for update: %w", err)
	}
	scan.Status = result.Status
	scan.Summary = result.Summary

	if err := w.scanRepo.UpdateResults(ctx, scan); err != nil {
		return fmt.Errorf("update scan results: %w", err)
	}

	// 6. Persist findings
	if len(result.Findings) > 0 {
		for i := range result.Findings {
			result.Findings[i].ScanID = payload.ScanID
		}
		if err := w.findingRepo.CreateBatch(ctx, result.Findings); err != nil {
			return fmt.Errorf("create findings: %w", err)
		}
	}

	logger.Info().
		Str("status", string(result.Status)).
		Int("findings", len(result.Findings)).
		Msg("scan completed")

	// 7. Evaluate policy and update release overall status
	return w.evaluateAndUpdateRelease(ctx, payload, logger)
}

func (w *ScanWorker) evaluateAndUpdateRelease(ctx context.Context, payload ScanJobPayload, logger zerolog.Logger) error {
	// Get all scans for this release
	scans, err := w.scanRepo.ListByReleaseID(ctx, payload.ReleaseID)
	if err != nil {
		return fmt.Errorf("list scans for policy: %w", err)
	}

	// Run policy evaluation
	policyResult := w.policy.Evaluate(scans)

	// Update release overall status
	if err := w.releaseRepo.UpdateOverallStatus(ctx, payload.ReleaseID, policyResult.Status); err != nil {
		return fmt.Errorf("update release status: %w", err)
	}

	logger.Info().
		Str("overall_status", string(policyResult.Status)).
		Int("policy_reasons", len(policyResult.Reasons)).
		Msg("release status updated after policy evaluation")

	return nil
}

// NewServer creates the asynq worker server.
func NewServer(redisAddr, redisPassword string, redisDB int, concurrency int) *asynq.Server {
	return asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     redisAddr,
			Password: redisPassword,
			DB:       redisDB,
		},
		asynq.Config{
			Concurrency: concurrency,
			Queues: map[string]int{
				QueueCritical: 6,
				QueueDefault:  3,
			},
		},
	)
}
