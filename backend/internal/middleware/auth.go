package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/scan-manager/backend/internal/service"
)

type contextKey string

const (
	// ClaimsContextKey is the key for JWT claims in request context.
	ClaimsContextKey contextKey = "claims"
)

// JWTAuth returns middleware that validates JWT tokens from the Authorization header.
func JWTAuth(authService *service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if header == "" {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "missing authorization header"})
				return
			}

			parts := strings.SplitN(header, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid authorization format"})
				return
			}

			claims, err := authService.ValidateToken(parts[1])
			if err != nil {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid or expired token"})
				return
			}

			ctx := context.WithValue(r.Context(), ClaimsContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetClaims extracts JWT claims from the request context.
func GetClaims(ctx context.Context) *service.JWTClaims {
	claims, ok := ctx.Value(ClaimsContextKey).(*service.JWTClaims)
	if !ok {
		return nil
	}
	return claims
}
