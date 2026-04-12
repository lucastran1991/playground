.PHONY: dev dev-backend dev-frontend build test swagger clean migrate-up migrate-down seed create-admin generate-api

# Start both servers in parallel
dev:
	@echo "Starting backend and frontend..."
	@make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && go run ./cmd/server

dev-frontend:
	cd frontend && pnpm dev

build:
	cd backend && go build -o server ./cmd/server
	cd frontend && pnpm build

test:
	cd backend && go test ./...
	cd frontend && pnpm test
	cd frontend && pnpm lint

swagger:
	cd backend && swag init -g cmd/server/main.go -o docs/

migrate-up:
	cd backend && go run ./cmd/migrate up

migrate-down:
	cd backend && go run ./cmd/migrate down

seed:
	cd backend && go run ./cmd/seed

create-admin:
	cd backend && go run ./cmd/create-admin

generate-api:
	cd backend && swag init -g cmd/server/main.go -o docs/
	cd frontend && pnpm generate-api

clean:
	rm -f backend/server
	rm -rf frontend/.next
	rm -f backend/*.db

# Docker
.PHONY: docker-build docker-up docker-down docker-logs

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f
