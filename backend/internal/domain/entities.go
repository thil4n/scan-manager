package domain

import (
	"time"

	"github.com/google/uuid"
)

// ──────────────────────────────────────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────────────────────────────────────

type ScanType string

const (
	ScanTypeVeracode ScanType = "VERACODE"
	ScanTypeFossa    ScanType = "FOSSA"
	ScanTypeJFrog    ScanType = "JFROG"
)

type ScanStatus string

const (
	ScanStatusQueued  ScanStatus = "QUEUED"
	ScanStatusRunning ScanStatus = "RUNNING"
	ScanStatusPass    ScanStatus = "PASS"
	ScanStatusFail    ScanStatus = "FAIL"
)

type Severity string

const (
	SeverityCritical Severity = "CRITICAL"
	SeverityHigh     Severity = "HIGH"
	SeverityMedium   Severity = "MEDIUM"
	SeverityLow      Severity = "LOW"
)

type ArtifactType string

const (
	ArtifactTypeFile   ArtifactType = "file"
	ArtifactTypeDocker ArtifactType = "docker"
)

type Role string

const (
	RoleAdmin   Role = "admin"
	RoleUser    Role = "user"
	RoleViewer  Role = "viewer"
)

// ──────────────────────────────────────────────────────────────────────────────
// Entities
// ──────────────────────────────────────────────────────────────────────────────

// Release represents a product release submitted for security scanning.
type Release struct {
	ID            uuid.UUID  `json:"id"`
	ProductName   string     `json:"productName"`
	Version       string     `json:"version"`
	SubmittedBy   string     `json:"submittedBy"`
	CreatedAt     time.Time  `json:"createdAt"`
	OverallStatus ScanStatus `json:"overallStatus"`
	Branch        *string    `json:"branch,omitempty"`
	JiraTicket    *string    `json:"jiraTicket,omitempty"`
	ArtifactType  ArtifactType `json:"artifactType"`
	ArtifactName  *string    `json:"artifactName,omitempty"`
	DockerImage   *string    `json:"dockerImage,omitempty"`
	DockerTag     *string    `json:"dockerTag,omitempty"`
	Scans         []Scan     `json:"scans"`
}

// ScanSummary holds finding counts by severity.
type ScanSummary struct {
	Critical int `json:"critical"`
	High     int `json:"high"`
	Medium   int `json:"medium"`
	Low      int `json:"low"`
}

// Scan represents a single security scan job.
type Scan struct {
	ID        uuid.UUID  `json:"id"`
	ReleaseID uuid.UUID  `json:"releaseId"`
	Type      ScanType   `json:"type"`
	Status    ScanStatus `json:"status"`
	Summary   ScanSummary `json:"summary"`
	Findings  []Finding  `json:"findings"`
	StartedAt *time.Time `json:"startedAt,omitempty"`
	EndedAt   *time.Time `json:"endedAt,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
}

// Finding represents a single vulnerability or issue found by a scan.
type Finding struct {
	ID          uuid.UUID `json:"id"`
	ScanID      uuid.UUID `json:"scanId"`
	Title       string    `json:"title"`
	Severity    Severity  `json:"severity"`
	Description string    `json:"description"`
	File        *string   `json:"file,omitempty"`
}

// User represents an authenticated user.
type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	FullName     string    `json:"fullName"`
	Role         Role      `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}
