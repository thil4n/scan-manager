package service

import (
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

// PolicyThresholds defines the maximum allowed counts per severity.
type PolicyThresholds struct {
	MaxCritical int
	MaxHigh     int
}

// PolicyService evaluates whether a release passes the security gate.
type PolicyService struct {
	thresholds PolicyThresholds
	logger     zerolog.Logger
}

// NewPolicyService creates a PolicyService with default thresholds.
func NewPolicyService(logger zerolog.Logger) *PolicyService {
	return &PolicyService{
		thresholds: PolicyThresholds{
			MaxCritical: 0, // Zero tolerance for critical findings
			MaxHigh:     2, // Allow up to 2 high severity findings
		},
		logger: logger,
	}
}

// PolicyResult captures the outcome of a policy evaluation.
type PolicyResult struct {
	Status  domain.ScanStatus
	Reasons []string
}

// Evaluate checks all completed scans against security policy thresholds.
// Returns PASS only when ALL scans pass and thresholds are met.
// Returns RUNNING if any scan is still queued or running.
// Returns FAIL if any scan failed or threshold exceeded.
func (p *PolicyService) Evaluate(scans []domain.Scan) PolicyResult {
	result := PolicyResult{Status: domain.ScanStatusPass}

	totalCritical := 0
	totalHigh := 0
	allComplete := true

	for _, scan := range scans {
		switch scan.Status {
		case domain.ScanStatusQueued, domain.ScanStatusRunning:
			allComplete = false
		case domain.ScanStatusFail:
			result.Status = domain.ScanStatusFail
			result.Reasons = append(result.Reasons,
				string(scan.Type)+" scan failed",
			)
		}

		totalCritical += scan.Summary.Critical
		totalHigh += scan.Summary.High
	}

	if !allComplete {
		return PolicyResult{Status: domain.ScanStatusRunning}
	}

	if totalCritical > p.thresholds.MaxCritical {
		result.Status = domain.ScanStatusFail
		result.Reasons = append(result.Reasons,
			"critical findings exceed threshold",
		)
	}

	if totalHigh > p.thresholds.MaxHigh {
		result.Status = domain.ScanStatusFail
		result.Reasons = append(result.Reasons,
			"high severity findings exceed threshold",
		)
	}

	p.logger.Info().
		Str("status", string(result.Status)).
		Int("total_critical", totalCritical).
		Int("total_high", totalHigh).
		Int("reason_count", len(result.Reasons)).
		Msg("policy evaluation complete")

	return result
}
