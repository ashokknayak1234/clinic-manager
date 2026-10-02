# OpenClinic backend

This is the initial FastAPI foundation and MySQL database contract for the locally hosted educational OpenClinic project. The database scripts are in `../database/`; workflow repositories and API endpoints are still pending.

## Setup

Use Python 3.11 or newer. From this directory, create a virtual environment, install `requirements.txt`, copy `.env.example` to `.env`, and replace the placeholders. Never commit `.env`.

Start the development server from this directory with `uvicorn app.main:app --reload`. Swagger UI is at `/docs`; the API prefix is `/api/v1`. `GET /api/v1/health` checks the API process. `GET /api/v1/health/database` performs a real MySQL `SELECT VERSION(), DATABASE()` and returns 503 with a safe message if connection fails.

## Configuration and database

Configuration is read from environment variables or `.env`. Copy `.env.example` to `.env` and set local credentials; never share or commit the password. The connection helper in `app/core/database.py` uses PyMySQL, `utf8mb4`, short-lived connections, and an explicit transaction context. To initialize a new local database, follow `../database/README.md` and install `schema.sql`, `seed.sql`, `views.sql`, `procedures.sql`, and `triggers.sql` in order. Review the target first; no reset script is provided.

## Current API and security

Active endpoints are the API process health and MySQL connectivity checks. Password hashing, JWT creation/validation, and role dependency primitives are implemented, but registration, login, and protected resources remain pending implementation. Public registration must create patient accounts only. Never treat these primitives as a complete authentication workflow.

When added, endpoints must return safe errors, use pagination on list routes, enforce ownership and roles in the backend, and use parameterized SQL. Booking and billing must follow the database's agreed transaction and constraint design. DBMS Explorer must remain read-only and limited to approved metadata and predefined examples.

## Tests

Run `pytest` from this directory after installing `requirements.txt`. The live connection endpoint returned HTTP 200 with MySQL 8.0.46. A controlled `departments` insert was rolled back and verified absent. The FastAPI health and database-health endpoints returned HTTP 200 through `TestClient`; the client emitted a deprecation warning from the installed Starlette/httpx combination. A full pytest suite and workflow API integration tests have not been run or implemented. Any destructive integration tests must use a dedicated test database.

## Remaining work

Implement authentication and workflow repositories/routes against the verified schema, add dedicated MySQL integration tests, and export `docs/openapi.json` when the supported API contract is agreed. Review the runtime account's unneeded `CREATE VIEW` and `TRIGGER` grants before tightening privileges; this check made no grant changes.
