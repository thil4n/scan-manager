package integration

import (
	"context"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

// ──────────────────────────────────────────────────────────────────────────────
// Mock Veracode Scanner
// ──────────────────────────────────────────────────────────────────────────────

type mockVeracodeScanner struct {
	logger zerolog.Logger
}

func NewMockVeracodeScanner(logger zerolog.Logger) Scanner {
	return &mockVeracodeScanner{logger: logger}
}

func (s *mockVeracodeScanner) Type() domain.ScanType {
	return domain.ScanTypeVeracode
}

func (s *mockVeracodeScanner) Execute(ctx context.Context, release *domain.Release) (*ScannerResult, error) {
	s.logger.Info().
		Str("release_id", release.ID.String()).
		Str("scanner", "veracode").
		Msg("executing mock SAST scan")

	// Simulate scan duration
	select {
	case <-time.After(2 * time.Second):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	critical := rand.Intn(3)
	high := rand.Intn(4)
	medium := rand.Intn(6)
	low := rand.Intn(8)

	status := domain.ScanStatusPass
	if critical > 0 || high > 1 {
		status = domain.ScanStatusFail
	}

	var findings []domain.Finding
	if critical > 0 {
		findings = append(findings, domain.Finding{
			ID:          uuid.New(),
			Title:       "SQL Injection in UserController",
			Severity:    domain.SeverityCritical,
			Description: "Unsanitized input passed directly to SQL query in login handler.",
			File:        strPtr("src/controllers/UserController.java"),
		})
	}
	if high > 0 {
		findings = append(findings, domain.Finding{
			ID:          uuid.New(),
			Title:       "Hardcoded Secret in Config",
			Severity:    domain.SeverityHigh,
			Description: "AWS secret key found hardcoded in application.yml.",
			File:        strPtr("src/main/resources/application.yml"),
		})
	}

	return &ScannerResult{
		Status: status,
		Summary: domain.ScanSummary{
			Critical: critical,
			High:     high,
			Medium:   medium,
			Low:      low,
		},
		Findings: findings,
	}, nil
}

// ──────────────────────────────────────────────────────────────────────────────
// Mock FOSSA Scanner
// ──────────────────────────────────────────────────────────────────────────────

type mockFossaScanner struct {
	logger zerolog.Logger
}

func NewMockFossaScanner(logger zerolog.Logger) Scanner {
	return &mockFossaScanner{logger: logger}
}

func (s *mockFossaScanner) Type() domain.ScanType {
	return domain.ScanTypeFossa
}

func (s *mockFossaScanner) Execute(ctx context.Context, release *domain.Release) (*ScannerResult, error) {
	s.logger.Info().
		Str("release_id", release.ID.String()).
		Str("scanner", "fossa").
		Msg("executing mock SCA scan")

	select {
	case <-time.After(1500 * time.Millisecond):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	high := rand.Intn(2)
	medium := rand.Intn(3)

	status := domain.ScanStatusPass
	if high > 0 {
		status = domain.ScanStatusFail
	}

	var findings []domain.Finding
	if high > 0 {
		findings = append(findings, domain.Finding{
			ID:          uuid.New(),
			Title:       "GPL-3.0 License Violation",
			Severity:    domain.SeverityHigh,
			Description: "Dependency log4j-extra uses GPL-3.0 which is not permitted.",
		})
	}
	if medium > 0 {
		findings = append(findings, domain.Finding{
			ID:          uuid.New(),
			Title:       "Outdated Dependency",
			Severity:    domain.SeverityMedium,
			Description: "commons-io 2.6 has known CVE-2021-29425.",
		})
	}

	return &ScannerResult{
		Status: status,
		Summary: domain.ScanSummary{
			Critical: 0,
			High:     high,
			Medium:   medium,
			Low:      rand.Intn(3),
		},
		Findings: findings,
	}, nil
}

// ──────────────────────────────────────────────────────────────────────────────
// Mock JFrog Scanner
// ──────────────────────────────────────────────────────────────────────────────

type mockJFrogScanner struct {
	logger zerolog.Logger
}

func NewMockJFrogScanner(logger zerolog.Logger) Scanner {
	return &mockJFrogScanner{logger: logger}
}

func (s *mockJFrogScanner) Type() domain.ScanType {
	return domain.ScanTypeJFrog
}

func (s *mockJFrogScanner) Execute(ctx context.Context, release *domain.Release) (*ScannerResult, error) {
	s.logger.Info().
		Str("release_id", release.ID.String()).
		Str("scanner", "jfrog").
		Msg("executing mock container scan")

	select {
	case <-time.After(1 * time.Second):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	medium := rand.Intn(3)
	low := rand.Intn(5)

	var findings []domain.Finding
	if medium > 0 {
		findings = append(findings, domain.Finding{
			ID:          uuid.New(),
			Title:       "Medium Severity CVE in base image",
			Severity:    domain.SeverityMedium,
			Description: "CVE-2024-1234 found in base image layer.",
		})
	}

	return &ScannerResult{
		Status: domain.ScanStatusPass,
		Summary: domain.ScanSummary{
			Critical: 0,
			High:     0,
			Medium:   medium,
			Low:      low,
		},
		Findings: findings,
	}, nil
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────────────────────────────────────

func strPtr(s string) *string {
	return &s
}
