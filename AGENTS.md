# AGENTS.md

## Project Overview
**thegamerlink** is a Vite + React 19 frontend (no backend, no database, no external services).

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Web entry point: http://localhost:3000 (maps to Vite dev server on 5173)
- Healthcheck: `wget --spider http://localhost:5173/`
- Live reload is active via Vite HMR; edits to source appear in the preview automatically.

## Tech Stack
- Vite 8 + React 19 + React Router 7
- Package manager: npm (lockfile: package-lock.json)
- Linter: Oxlint

## No Secrets Required
This project has no external service dependencies. No credentials are needed to run it.
