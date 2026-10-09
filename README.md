# OpenClinic

OpenClinic is an educational local-clinic management project with a MySQL database, FastAPI backend, and React/Vite frontend.

## Run locally

1. Start MySQL 8 and configure `backend/.env` from `backend/.env.example`.
2. Install backend dependencies from `backend/requirements.txt` and frontend dependencies from `frontend/` with `npm install`.
3. From the project root, run `python scripts/dev.py` to start the API on port 8000 and Vite on port 5173.

Install `backend/requirements-dev.txt` for backend tests and linting. For direct server commands and database setup, see the READMEs in `backend/` and `database/`.

## Repository layout

```text
database/       MySQL scripts
docs/           Project and database design documentation
backend/        FastAPI application and Python requirements
  app/api/      Versioned HTTP routes and router composition
  app/core/     Settings and security primitives
  app/db/       MySQL connection and transaction handling
  app/dependencies/ Authentication and authorization dependencies
  app/repositories/ SQL access
  app/services/ Application workflows
frontend/       React/Vite application
  src/api/      Shared HTTP client
  src/components/ Shared UI components
  src/features/ User-facing feature areas
  src/shared/   Shared frontend types
scripts/        Local development utilities
```

This is an educational prototype and is not intended for real clinical use.
