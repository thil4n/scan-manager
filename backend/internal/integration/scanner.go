package integration

import (
	"context"

	"github.com/scan-manager/backend/internal/domain"
)

// ScannerResult is the outcome of running a security scan.
type ScannerResult struct {
	Status   domain.ScanStatus
	Summary  domain.ScanSummary
	Findings []domain.Finding
}

// Scanner is the interface all scan integrations must implement.
// Implementations wrap external tools (Veracode, FOSSA, JFrog Xray).
type Scanner interface {
	// Type returns the scan type this scanner handles.
	Type() domain.ScanType

	// Execute runs the scan against the given release artifact and returns the result.
	// Implementations should be idempotent and context-aware.
	Execute(ctx context.Context, release *domain.Release) (*ScannerResult, error)
}
