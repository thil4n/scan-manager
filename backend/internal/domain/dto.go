package domain

// ──────────────────────────────────────────────────────────────────────────────
// Request DTOs (validated via validator/v10 tags)
// ──────────────────────────────────────────────────────────────────────────────

// CreateReleaseRequest is the payload for POST /api/releases.
type CreateReleaseRequest struct {
	ProductName  string   `json:"productName"  validate:"required,min=1,max=255"`
	Version      string   `json:"version"      validate:"required,min=1,max=100"`
	Branch       *string  `json:"branch"       validate:"omitempty,max=255"`
	JiraTicket   *string  `json:"jiraTicket"   validate:"omitempty,max=100"`
	ArtifactType string   `json:"artifactType" validate:"required,oneof=file docker"`
	ArtifactName *string  `json:"artifactName" validate:"omitempty,max=500"`
	DockerImage  *string  `json:"dockerImage"  validate:"omitempty,max=500"`
	DockerTag    *string  `json:"dockerTag"    validate:"omitempty,max=255"`
	ScanTypes    []string `json:"scanTypes"    validate:"required,min=1,dive,oneof=VERACODE FOSSA JFROG"`
}

// LoginRequest is the payload for POST /api/auth/login.
type LoginRequest struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

// ──────────────────────────────────────────────────────────────────────────────
// Response DTOs
// ──────────────────────────────────────────────────────────────────────────────

// LoginResponse is returned on successful authentication.
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// ErrorResponse is the standard error envelope.
type ErrorResponse struct {
	Error   string            `json:"error"`
	Details map[string]string `json:"details,omitempty"`
}

// PaginatedResponse wraps a list result with pagination metadata.
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	TotalCount int64       `json:"totalCount"`
	Page       int         `json:"page"`
	PageSize   int         `json:"pageSize"`
}
