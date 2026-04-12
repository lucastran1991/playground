package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"myapp/internal/database"
	"myapp/internal/handler"
	"myapp/internal/repository"
	"myapp/internal/router"
	"myapp/internal/service"
)

const testJWTSecret = "test-secret-key-32chars-minimum1"

// newTestRouter sets up a test Gin engine with an in-memory SQLite DB.
func newTestRouter(t *testing.T) *gin.Engine {
	t.Helper()
	gin.SetMode(gin.TestMode)

	db, err := database.Connect("file::memory:?cache=shared")
	if err != nil {
		t.Fatalf("failed to open in-memory db: %v", err)
	}

	if err := database.RunMigrations(db); err != nil {
		t.Fatalf("failed to migrate: %v", err)
	}

	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, testJWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	return router.Setup(authHandler, testJWTSecret, "http://localhost:3000")
}

func TestHealthEndpoint(t *testing.T) {
	r := newTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var body map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("failed to parse response body: %v", err)
	}

	if body["status"] != "ok" {
		t.Errorf("expected status=ok, got %q", body["status"])
	}
}

func TestRegisterEndpoint(t *testing.T) {
	r := newTestRouter(t)

	payload := map[string]string{
		"name":     "Test User",
		"email":    "test@example.com",
		"password": "securepassword123",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected status 201, got %d — body: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if resp["access_token"] == nil {
		t.Error("expected access_token in response")
	}
	if resp["user"] == nil {
		t.Error("expected user in response")
	}
}
