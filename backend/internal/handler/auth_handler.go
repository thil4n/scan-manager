package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
	"github.com/scan-manager/backend/internal/service"
)

// AuthHandler handles authentication endpoints.
type AuthHandler struct {
	authService *service.AuthService
	validate    *validator.Validate
	logger      zerolog.Logger
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(authService *service.AuthService, validate *validator.Validate, logger zerolog.Logger) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validate:    validate,
		logger:      logger,
	}
}

// Login handles POST /api/auth/login.
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req domain.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.validate.StructCtx(r.Context(), req); err != nil {
		writeValidationError(w, err)
		return
	}

	resp, err := h.authService.Login(r.Context(), req)
	if err != nil {
		if err == service.ErrInvalidCredentials {
			writeError(w, http.StatusUnauthorized, "invalid email or password")
			return
		}
		h.logger.Error().Err(err).Msg("login failed")
		writeError(w, http.StatusInternalServerError, "authentication failed")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}
