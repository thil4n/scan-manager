package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/scan-manager/backend/internal/domain"
)

// writeJSON writes a JSON response.
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// writeError writes a standard error response.
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, domain.ErrorResponse{Error: message})
}

// writeValidationError formats validator errors into a response.
func writeValidationError(w http.ResponseWriter, err error) {
	details := make(map[string]string)
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			field := e.Field()
			switch e.Tag() {
			case "required":
				details[field] = field + " is required"
			case "email":
				details[field] = "invalid email format"
			case "min":
				details[field] = field + " must be at least " + e.Param()
			case "max":
				details[field] = field + " must be at most " + e.Param()
			case "oneof":
				details[field] = field + " must be one of: " + e.Param()
			default:
				details[field] = field + " is invalid"
			}
		}
	}

	writeJSON(w, http.StatusBadRequest, domain.ErrorResponse{
		Error:   "validation failed",
		Details: details,
	})
}
