package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	DBPath     string
	JWTSecret  string
	ServerPort string
	CORSOrigin string
}

// Load reads .env file and returns a validated Config.
// Priority: env vars > .env file > hardcoded defaults.
func Load() (*Config, error) {
	godotenv.Load()

	cfg := &Config{
		DBPath:     getEnv("DB_PATH", "myapp.db"),
		JWTSecret:  getEnv("JWT_SECRET", ""),
		ServerPort: getEnv("SERVER_PORT", "8080"),
		CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:3000"),
	}

	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
