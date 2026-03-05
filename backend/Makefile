.PHONY: run run-api run-worker migrate build test lint clean

# Run the API server
run-api:
	go run ./cmd/api

# Run the worker
run-worker:
	go run ./cmd/worker

# Run both (requires goreman or similar; for dev use two terminals)
run: run-api

# Build binaries
build:
	go build -o bin/api ./cmd/api
	go build -o bin/worker ./cmd/worker

# Run tests
test:
	go test ./... -v -race -count=1

# Lint
lint:
	golangci-lint run ./...

# Clean build artifacts
clean:
	rm -rf bin/
