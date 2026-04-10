.PHONY: dev dev-backend dev-frontend build test swagger clean

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
