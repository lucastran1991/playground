package main

import (
	"log"

	"myapp/internal/config"
	"myapp/internal/database"
	"myapp/internal/handler"
	"myapp/internal/repository"
	"myapp/internal/router"
	"myapp/internal/service"
	_ "myapp/docs"
)

// @title       MyApp API
// @version     1.0
// @description Starter template API with JWT authentication
// @host        localhost:8080
// @BasePath    /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config: ", err)
	}

	db, err := database.Connect(cfg.DBPath)
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	if err := database.RunMigrations(db); err != nil {
		log.Fatal("Failed to run migrations: ", err)
	}
	log.Println("Database connected and migrated")

	// Wire dependencies
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(authService)

	r := router.Setup(authHandler, cfg.JWTSecret, cfg.CORSOrigin)

	log.Printf("Server starting on :%s", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
