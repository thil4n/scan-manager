package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

type postgresUserRepo struct {
	pool   *pgxpool.Pool
	logger zerolog.Logger
}

// NewUserRepository creates a PostgreSQL-backed UserRepository.
func NewUserRepository(pool *pgxpool.Pool, logger zerolog.Logger) UserRepository {
	return &postgresUserRepo{pool: pool, logger: logger}
}

func (r *postgresUserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	u := &domain.User{}
	err := r.pool.QueryRow(ctx,
		`SELECT id, email, password_hash, full_name, role, created_at
		 FROM users WHERE email = $1`, email,
	).Scan(&u.ID, &u.Email, &u.PasswordHash, &u.FullName, &u.Role, &u.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("get user by email: %w", err)
	}
	return u, nil
}

func (r *postgresUserRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	u := &domain.User{}
	err := r.pool.QueryRow(ctx,
		`SELECT id, email, password_hash, full_name, role, created_at
		 FROM users WHERE id = $1`, id,
	).Scan(&u.ID, &u.Email, &u.PasswordHash, &u.FullName, &u.Role, &u.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("get user by id: %w", err)
	}
	return u, nil
}

func (r *postgresUserRepo) Create(ctx context.Context, user *domain.User) error {
	user.ID = uuid.New()
	_, err := r.pool.Exec(ctx,
		`INSERT INTO users (id, email, password_hash, full_name, role)
		 VALUES ($1,$2,$3,$4,$5)`,
		user.ID, user.Email, user.PasswordHash, user.FullName, user.Role,
	)
	if err != nil {
		return fmt.Errorf("insert user: %w", err)
	}
	return nil
}
