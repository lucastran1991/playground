// create-admin — bootstrap first admin user (or reset password for existing)
// Usage:
//   go run ./cmd/create-admin -email=admin@example.com -password=secret
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... go run ./cmd/create-admin
package main

import (
	"errors"
	"flag"
	"log"
	"os"

	"myapp/internal/config"
	"myapp/internal/database"
	"myapp/internal/model"
	"myapp/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	emailFlag := flag.String("email", os.Getenv("ADMIN_EMAIL"), "admin email")
	passwordFlag := flag.String("password", os.Getenv("ADMIN_PASSWORD"), "admin password")
	nameFlag := flag.String("name", "Admin", "admin display name")
	flag.Parse()

	if *emailFlag == "" || *passwordFlag == "" {
		log.Fatal("missing -email or -password (or ADMIN_EMAIL / ADMIN_PASSWORD env vars)")
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

	hash, err := bcrypt.GenerateFromPassword([]byte(*passwordFlag), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("hash: ", err)
	}

	existing, err := repo.FindByEmail(*emailFlag)
	if err == nil {
		existing.Password = string(hash)
		if err := db.Save(existing).Error; err != nil {
			log.Fatal("update: ", err)
		}
		log.Printf("password updated for existing user %s", *emailFlag)
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Fatal("lookup: ", err)
	}

	user := &model.User{Name: *nameFlag, Email: *emailFlag, Password: string(hash)}
	if err := repo.Create(user); err != nil {
		log.Fatal("create: ", err)
	}
	log.Printf("admin user created: %s", *emailFlag)
}
