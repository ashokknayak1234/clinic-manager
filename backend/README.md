# OpenClinic backend

FastAPI backend for the locally hosted educational OpenClinic project. The database scripts are in `../database/`.

## Setup

Use Python 3.11 or newer. From this directory, create a virtual environment, install `requirements.txt`, copy `.env.example` to `.env`, and set local credentials. Never commit `.env`. Install `requirements-dev.txt` for tests and linting.

Start the development server from this directory with `uvicorn app.main:app --reload`. Swagger UI is at `/docs`; the API prefix is `/api/v1`. `GET /api/v1/health` checks the API process. `GET /api/v1/health/database` performs a real MySQL `SELECT VERSION(), DATABASE()` and returns 503 with a safe message if connection fails.

## Configuration and database

Configuration is read from environment variables or `.env`. Copy `.env.example` to `.env` and set local credentials; never share or commit the password. The connection helper in `app/db/connection.py` uses PyMySQL, `utf8mb4`, short-lived connections, and an explicit transaction context. To initialize a new local database, follow `../database/README.md` and install `schema.sql`, `seed.sql`, `views.sql`, `procedures.sql`, and `triggers.sql` in order. Review the target first; no reset script is provided.

## Current API and security

Active endpoints include API and database health checks, patient registration, login, and the current-user endpoint. Registration is patient-only. SQL access is kept in repositories, with authentication workflow coordination in services and HTTP handling in versioned routes.

When added, endpoints must return safe errors, use pagination on list routes, enforce ownership and roles in the backend, and use parameterized SQL. Booking and billing must follow the database's agreed transaction and constraint design. DBMS Explorer must remain read-only and limited to approved metadata and predefined examples.

## Tests

Run `pytest` from this directory after installing `requirements-dev.txt`. Any destructive integration tests must use a dedicated test database.

## Remaining work

Implement the remaining clinic workflow endpoints against the verified schema, add dedicated MySQL integration tests, and export `docs/openapi.json` when the supported API contract is agreed. Review the runtime account's grants before tightening privileges.
