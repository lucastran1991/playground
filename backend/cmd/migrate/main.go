// migrate CLI — manual migration control for prod / CI
// Usage:
//   go run ./cmd/migrate up      # apply pending migrations
//   go run ./cmd/migrate down    # rollback last applied migration
package main

import (
	"log"
	"os"

	"myapp/internal/config"
	"myapp/internal/database"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("config: ", err)
	}

	db, err := database.Connect(cfg.DBPath)
	if err != nil {
		log.Fatal("connect: ", err)
	}

	cmd := "up"
	if len(os.Args) > 1 {
		cmd = os.Args[1]
	}

	switch cmd {
	case "up":
		if err := database.RunMigrations(db); err != nil {
			log.Fatal("migrate up: ", err)
		}
		log.Println("migrations applied")
	case "down":
		if err := database.RollbackLast(db); err != nil {
			log.Fatal("migrate down: ", err)
		}
		log.Println("last migration rolled back")
	default:
		log.Fatalf("unknown command %q (use: up, down)", cmd)
	}
}
