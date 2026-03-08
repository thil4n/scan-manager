# Scanner Service

A Spring Boot microservice for running security scans asynchronously and sending results to the Vulnerability Management System (VMS) API.

## Features
- REST API for scan job creation and status
- In-memory job queue with worker pool
- Modular scanner runners (Semgrep, etc.)
- Result normalization and VMS API integration
- Temporary workspace management
- Logging and error handling

## Project Structure
- `api/` : REST controllers
- `service/` : scan job service
- `queue/` : job queue implementation
- `worker/` : worker threads or thread pool
- `scanner/` : tool runners
- `parser/` : result parsers
- `client/` : VMS API client
- `config/` : application properties, scanner configs

## Usage
- Build: `./gradlew build`
- Run: `./gradlew bootRun`

## Extending
Add new tool runners and parsers in `scanner/` and `parser/` packages.
