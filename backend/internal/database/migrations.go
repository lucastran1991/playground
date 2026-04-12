// Package database migration runner.
//
// SAFETY CONSTRAINTS (read before scaling the backend):
//  1. Single-writer assumption. Run migrations from ONE process at a time.
//     Before scaling to N replicas, run `go run ./cmd/migrate up` once,
//     then start replicas with RunMigrations still called (idempotent no-op).
//  2. Migration files are immutable once applied. Never rename/edit an
//     applied migration — version tracking uses filename.
//  3. Keep migration SQL to ONE logical statement per file when targeting
//     Postgres/MySQL. SQLite tolerates multi-statement exec but other
//     drivers reject it by default.
package database

import (
	"embed"
	"fmt"
	"sort"
	"strings"

	"gorm.io/gorm"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

// RunMigrations applies any pending up-migrations in order.
// Tracks applied versions in schema_migrations table.
// Each migration + version insert runs in a single transaction so
// a partial failure leaves the DB in a consistent state.
// Safe to call on every boot — no-op if already up to date.
func RunMigrations(db *gorm.DB) error {
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
		version TEXT PRIMARY KEY,
		applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`).Error; err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	entries, err := migrationsFS.ReadDir("migrations")
	if err != nil {
		return fmt.Errorf("read migrations dir: %w", err)
	}

	var upFiles []string
	for _, e := range entries {
		name := e.Name()
		if strings.HasSuffix(name, ".up.sql") {
			upFiles = append(upFiles, name)
		}
	}
	sort.Strings(upFiles)

	for _, name := range upFiles {
		version := strings.TrimSuffix(name, ".up.sql")

		var count int64
		if err := db.Raw("SELECT COUNT(*) FROM schema_migrations WHERE version = ?", version).Scan(&count).Error; err != nil {
			return fmt.Errorf("check version %s: %w", version, err)
		}
		if count > 0 {
			continue
		}

		sql, err := migrationsFS.ReadFile("migrations/" + name)
		if err != nil {
			return fmt.Errorf("read %s: %w", name, err)
		}

		err = db.Transaction(func(tx *gorm.DB) error {
			if err := tx.Exec(string(sql)).Error; err != nil {
				return fmt.Errorf("apply %s: %w", name, err)
			}
			if err := tx.Exec("INSERT INTO schema_migrations (version) VALUES (?)", version).Error; err != nil {
				return fmt.Errorf("record %s: %w", name, err)
			}
			return nil
		})
		if err != nil {
			return err
		}
		fmt.Printf("migration applied: %s\n", version)
	}
	return nil
}

// RollbackLast reverses the most recently applied migration.
// Runs SQL + version delete in a single transaction.
// Used by `make migrate-down` and cmd/migrate CLI.
func RollbackLast(db *gorm.DB) error {
	var version string
	if err := db.Raw("SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1").Scan(&version).Error; err != nil {
		return fmt.Errorf("find last version: %w", err)
	}
	if version == "" {
		return nil
	}

	sql, err := migrationsFS.ReadFile("migrations/" + version + ".down.sql")
	if err != nil {
		return fmt.Errorf("read down migration %s: %w", version, err)
	}

	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Exec(string(sql)).Error; err != nil {
			return fmt.Errorf("apply down %s: %w", version, err)
		}
		if err := tx.Exec("DELETE FROM schema_migrations WHERE version = ?", version).Error; err != nil {
			return fmt.Errorf("unrecord %s: %w", version, err)
		}
		return nil
	})
}
