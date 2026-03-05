package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/config"
	"github.com/scan-manager/backend/internal/domain"
	"github.com/scan-manager/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
)

// JWTClaims are the custom claims embedded in each token.
type JWTClaims struct {
	UserID   uuid.UUID   `json:"userId"`
	Email    string      `json:"email"`
	FullName string      `json:"fullName"`
	Role     domain.Role `json:"role"`
	jwt.RegisteredClaims
}

// AuthService handles authentication and JWT token management.
type AuthService struct {
	userRepo  repository.UserRepository
	jwtCfg    config.JWTConfig
	logger    zerolog.Logger
}

// NewAuthService creates a new AuthService.
func NewAuthService(
	userRepo repository.UserRepository,
	jwtCfg config.JWTConfig,
	logger zerolog.Logger,
) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		jwtCfg:   jwtCfg,
		logger:   logger,
	}
}

// Login authenticates a user and returns a JWT token.
func (s *AuthService) Login(ctx context.Context, req domain.LoginRequest) (*domain.LoginResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("lookup user: %w", err)
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, fmt.Errorf("generate token: %w", err)
	}

	s.logger.Info().Str("email", user.Email).Msg("user logged in")

	return &domain.LoginResponse{
		Token: token,
		User:  *user,
	}, nil
}

// ValidateToken parses and validates a JWT token, returning the claims.
func (s *AuthService) ValidateToken(tokenStr string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.jwtCfg.Secret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("parse token: %w", err)
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

func (s *AuthService) generateToken(user *domain.User) (string, error) {
	now := time.Now()
	claims := JWTClaims{
		UserID:   user.ID,
		Email:    user.Email,
		FullName: user.FullName,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(s.jwtCfg.ExpiryTime)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "scan-manager",
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtCfg.Secret))
}
