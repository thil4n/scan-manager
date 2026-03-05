# Pre-Release Security Scan Manager — Backend

Production-ready Go backend for managing pre-release security scans (Veracode, FOSSA, JFrog Xray).

## Architecture

```
cmd/
  api/         → HTTP server entry point
  worker/      → Async job worker entry point
internal/
  config/      → Environment-based configuration
  database/    → PostgreSQL pool, migrations, seed
  domain/      → Entities and DTOs (zero dependencies)
  repository/  → Data access layer (interfaces + pgx implementations)
  service/     → Business logic (release, auth, policy)
  handler/     → HTTP handlers (thin — delegates to services)
  middleware/  → JWT auth, role guard, logging, recovery
  queue/       → asynq client + worker (Redis-backed job queue)
  integration/ → Scanner interface + mock implementations
```

## Quick Start

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Copy environment file

```bash
cp .env.example .env
```

### 3. Run the API server

```bash
make run-api
# or: go run ./cmd/api
```

### 4. Run the worker (separate terminal)

```bash
make run-worker
# or: go run ./cmd/worker
```

### 5. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@acme.io","password":"admin123"}'
```

### 6. Create a release

```bash
curl -X POST http://localhost:8080/api/releases \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
    "productName": "Identity Server",
    "version": "7.1.0",
    "branch": "release/7.1.0",
    "jiraTicket": "IS-4521",
    "artifactType": "file",
    "artifactName": "identity-server-7.1.0.zip",
    "scanTypes": ["VERACODE", "FOSSA", "JFROG"]
  }'
```

## API Endpoints

| Method | Path                       | Auth     | Description              |
|--------|----------------------------|----------|--------------------------|
| GET    | /api/health                | No       | Health check             |
| POST   | /api/auth/login            | No       | Authenticate             |
| GET    | /api/releases              | Bearer   | List releases (paginated)|
| GET    | /api/releases/{id}         | Bearer   | Get release + scans      |
| POST   | /api/releases              | Bearer   | Create release + scans   |
| POST   | /api/scans/{id}/retrigger  | Bearer   | Re-queue a scan          |

## Security

- JWT authentication with configurable expiry
- Role-based access control (admin, user, viewer)
- Request body size limits
- Input validation via validator/v10
- Central panic recovery
- Structured logging (zerolog)

## Policy Engine

The policy engine evaluates all scans for a release:

- **PASS**: All scans complete, 0 critical findings, ≤2 high findings
- **FAIL**: Any scan fails, or threshold exceeded
- **RUNNING**: Any scan still queued/running

## Tech Stack

| Component       | Library              |
|-----------------|----------------------|
| Router          | go-chi/chi v5        |
| Database        | jackc/pgx v5         |
| Job Queue       | hibiken/asynq        |
| Auth            | golang-jwt/jwt v5    |
| Validation      | go-playground/v10    |
| Logging         | rs/zerolog           |
| Config          | joho/godotenv        |
| Password Hash   | golang.org/x/crypto  |
