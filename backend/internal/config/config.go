package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration.
type Config struct {
	App      AppConfig
	DB       DBConfig
	Redis    RedisConfig
	JWT      JWTConfig
	Upload   UploadConfig
}

type AppConfig struct {
	Env  string
	Port string
}

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

func (c DBConfig) DSN() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		c.User, c.Password, c.Host, c.Port, c.Name, c.SSLMode,
	)
}

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
}

type JWTConfig struct {
	Secret     string
	ExpiryTime time.Duration
}

type UploadConfig struct {
	MaxSizeMB int64
}

// Load reads configuration from environment variables.
func Load() (*Config, error) {
	// Best effort load of .env file
	_ = godotenv.Load()

	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0"))
	jwtExpiry, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	maxUpload, _ := strconv.ParseInt(getEnv("MAX_UPLOAD_SIZE_MB", "100"), 10, 64)

	cfg := &Config{
		App: AppConfig{
			Env:  getEnv("APP_ENV", "development"),
			Port: getEnv("APP_PORT", "8080"),
		},
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "scanmanager"),
			Password: getEnv("DB_PASSWORD", "scanmanager"),
			Name:     getEnv("DB_NAME", "scanmanager"),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		Redis: RedisConfig{
			Addr:     getEnv("REDIS_ADDR", "localhost:6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       redisDB,
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "change-me-in-production"),
			ExpiryTime: time.Duration(jwtExpiry) * time.Hour,
		},
		Upload: UploadConfig{
			MaxSizeMB: maxUpload,
		},
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
