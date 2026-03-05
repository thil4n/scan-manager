package middleware

import (
	"net/http"

	"github.com/scan-manager/backend/internal/domain"
)

// RoleGuard returns middleware that restricts access to specific roles.
func RoleGuard(allowedRoles ...domain.Role) func(http.Handler) http.Handler {
	roleSet := make(map[domain.Role]struct{}, len(allowedRoles))
	for _, r := range allowedRoles {
		roleSet[r] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims := GetClaims(r.Context())
			if claims == nil {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "authentication required"})
				return
			}

			if _, ok := roleSet[claims.Role]; !ok {
				writeJSON(w, http.StatusForbidden, map[string]string{"error": "insufficient permissions"})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
