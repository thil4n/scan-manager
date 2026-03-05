package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
	"github.com/scan-manager/backend/internal/middleware"
	"github.com/scan-manager/backend/internal/service"
)

// ReleaseHandler handles release endpoints.
type ReleaseHandler struct {
	releaseService *service.ReleaseService
	validate       *validator.Validate
	logger         zerolog.Logger
}

// NewReleaseHandler creates a new ReleaseHandler.
func NewReleaseHandler(releaseService *service.ReleaseService, validate *validator.Validate, logger zerolog.Logger) *ReleaseHandler {
	return &ReleaseHandler{
		releaseService: releaseService,
		validate:       validate,
		logger:         logger,
	}
}

// Create handles POST /api/releases.
func (h *ReleaseHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateReleaseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.validate.StructCtx(r.Context(), req); err != nil {
		writeValidationError(w, err)
		return
	}

	// Extract submitter from JWT claims
	claims := middleware.GetClaims(r.Context())
	submittedBy := "unknown"
	if claims != nil {
		submittedBy = claims.Email
	}

	release, err := h.releaseService.CreateRelease(r.Context(), req, submittedBy)
	if err != nil {
		h.logger.Error().Err(err).Msg("failed to create release")
		writeError(w, http.StatusInternalServerError, "failed to create release")
		return
	}

	writeJSON(w, http.StatusCreated, release)
}

// List handles GET /api/releases.
func (h *ReleaseHandler) List(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}

	releases, total, err := h.releaseService.ListReleases(r.Context(), page, pageSize)
	if err != nil {
		h.logger.Error().Err(err).Msg("failed to list releases")
		writeError(w, http.StatusInternalServerError, "failed to list releases")
		return
	}

	if releases == nil {
		releases = []domain.Release{}
	}

	writeJSON(w, http.StatusOK, domain.PaginatedResponse{
		Data:       releases,
		TotalCount: total,
		Page:       page,
		PageSize:   pageSize,
	})
}

// GetByID handles GET /api/releases/{id}.
func (h *ReleaseHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid release ID")
		return
	}

	release, err := h.releaseService.GetRelease(r.Context(), id)
	if err != nil {
		h.logger.Error().Err(err).Str("id", idStr).Msg("failed to get release")
		writeError(w, http.StatusInternalServerError, "failed to get release")
		return
	}

	if release == nil {
		writeError(w, http.StatusNotFound, "release not found")
		return
	}

	writeJSON(w, http.StatusOK, release)
}

// RetriggerScan handles POST /api/scans/{id}/retrigger.
func (h *ReleaseHandler) RetriggerScan(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid scan ID")
		return
	}

	scan, err := h.releaseService.RetriggerScan(r.Context(), id)
	if err != nil {
		h.logger.Error().Err(err).Str("id", idStr).Msg("failed to retrigger scan")
		writeError(w, http.StatusInternalServerError, "failed to retrigger scan")
		return
	}

	if scan == nil {
		writeError(w, http.StatusNotFound, "scan not found")
		return
	}

	writeJSON(w, http.StatusOK, scan)
}
