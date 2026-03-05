package middleware

import (
	"net/http"
	"runtime/debug"

	"github.com/rs/zerolog"
)

// Recoverer is middleware that recovers from panics, logs the stack trace,
// and returns a 500 error.
func Recoverer(logger zerolog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rec := recover(); rec != nil {
					logger.Error().
						Interface("panic", rec).
						Str("stack", string(debug.Stack())).
						Str("method", r.Method).
						Str("path", r.URL.Path).
						Msg("panic recovered")

					writeJSON(w, http.StatusInternalServerError, map[string]string{
						"error": "internal server error",
					})
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}
