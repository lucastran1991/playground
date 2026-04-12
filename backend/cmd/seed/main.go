// seed — populates dev DB with sample users
// Usage: make seed
// Refuses to run if APP_ENV=production to prevent prod data pollution.
package main

import (
	"errors"
	"log"
	"os"

	"myapp/internal/config"
	"myapp/internal/database"
	"myapp/internal/model"
	"myapp/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type seedUser struct {
	Name     string
	Email    string
	Password string
}

var sampleUsers = []seedUser{
	{Name: "Alice", Email: "alice@example.com", Password: "password123"},
	{Name: "Bob", Email: "bob@example.com", Password: "password123"},
	{Name: "Charlie", Email: "charlie@example.com", Password: "password123"},
}

func main() {
	if os.Getenv("APP_ENV") == "production" {
		log.Fatal("refusing to seed production database")
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatal("config: ", err)
	}

	db, err := database.Connect(cfg.DBPath)
	if err != nil {
		log.Fatal("connect: ", err)
	}

	if err := database.RunMigrations(db); err != nil {
		log.Fatal("migrations: ", err)
	}

	repo := repository.NewUserRepository(db)

	created, skipped := 0, 0
	for _, s := range sampleUsers {
		if _, err := repo.FindByEmail(s.Email); err == nil {
			skipped++
			continue
		} else if !errors.Is(err, gorm.ErrRecordNotFound) {
			log.Fatalf("lookup %s: %v", s.Email, err)
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(s.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("hash %s: %v", s.Email, err)
		}

		user := &model.User{Name: s.Name, Email: s.Email, Password: string(hash)}
		if err := repo.Create(user); err != nil {
			log.Fatalf("create %s: %v", s.Email, err)
		}
		created++
	}

	log.Printf("seed complete: %d created, %d skipped", created, skipped)
}
