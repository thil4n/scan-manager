package integration

import (
	"fmt"

	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

// Registry holds all registered scanner implementations keyed by type.
type Registry struct {
	scanners map[domain.ScanType]Scanner
}

// NewRegistry creates a registry and registers all scanner implementations.
func NewRegistry(logger zerolog.Logger) *Registry {
	r := &Registry{
		scanners: make(map[domain.ScanType]Scanner),
	}

	// Register mock implementations. In production, swap these for real ones.
	r.Register(NewMockVeracodeScanner(logger))
	r.Register(NewMockFossaScanner(logger))
	r.Register(NewMockJFrogScanner(logger))

	return r
}

// Register adds a scanner to the registry.
func (r *Registry) Register(s Scanner) {
	r.scanners[s.Type()] = s
}

// Get retrieves a scanner by type.
func (r *Registry) Get(scanType domain.ScanType) (Scanner, error) {
	s, ok := r.scanners[scanType]
	if !ok {
		return nil, fmt.Errorf("no scanner registered for type: %s", scanType)
	}
	return s, nil
}
