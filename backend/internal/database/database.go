package database

import (
	"fmt"

	"github.com/glebarez/sqlite"
	"myapp/internal/model"
	"gorm.io/gorm"
)

// Connect opens a SQLite database at the given file path.
func Connect(dbPath string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	return db, nil
}

// Migrate runs AutoMigrate for all models.
func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(&model.User{})
}
