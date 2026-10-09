# OpenClinic backend progress

## Database integration update

- The workspace initially contained no project files, backend, database scripts, Git repository, or existing progress document. The first task added only a FastAPI foundation.
- The PRD at `C:\Users\ASHOK\Downloads\OpenClinic_PRD.md` defines MySQL 8.x and the expected clinic workflows.
- The new database prompt authorizes designing database scripts against the PRD and existing backend. The backend still has no repositories or workflow routes, so the schema is documented as an initial contract and needs confirmation against future API work.
- At the initial inspection there was no `.env` or database schema. The user later configured `backend/.env` and initialized the database; the status below reflects the current verified state.

## Implementation plan

1. Establish the FastAPI application, environment configuration, MySQL connection/transaction helper, safe error handling, and security primitives. (Done.)
2. Draft database schema, seed, views, booking procedure, audit triggers, and design documentation based on the PRD. (Done; installed locally.)
3. Configure local MySQL application credentials and verify connection and rollback behavior without changing persistent data. (Done.)
4. Build React + Vite + TypeScript + Tailwind frontend with patient portal and staff panel pages. (Done; running at http://localhost:5173)
5. Implement backend authentication endpoints and create demo accounts. (Done.)
6. Address schema gaps identified in review, then confirm schema/API decisions and implement workflow modules with integration coverage.

## Completed

- Added initial backend package and requirements.
- Added environment example and ignore rules.
- Added FastAPI app, CORS configuration, health endpoint, safe generic exception response, PyMySQL connection and transaction helpers, bcrypt password helpers, JWT helpers, and role dependency primitives.
- Added backend setup and current limitations documentation.
- Added `database/schema.sql`, `seed.sql`, `views.sql`, `procedures.sql`, `triggers.sql`, database setup notes, and `docs/database-design.md`.
- Added `GET /api/v1/health/database`, which checks actual MySQL connectivity and does not expose the password or raw database exception.
- Installed backend dependencies (fastapi, uvicorn, pymysql, PyJWT, bcrypt, python-dotenv, pydantic-settings, pytest, httpx, ruff).
- **MySQL database `openclinic_db` and app user `openclinic_app` are present.** Grant review found `CREATE VIEW` and `TRIGGER` privileges that are not needed by the current runtime API; treat grants as pending least-privilege review.
- **Installed all SQL scripts in order (schema → seed → views → procedures → triggers) against live MySQL 8.0.46.**
- **Verified: foreign key constraints, CHECK constraints, unique constraint on `active_slot_id` (double-booking prevention), `book_appointment` procedure, audit triggers (INSERT/UPDATE), views (`v_daily_appointment_schedule`, `v_invoice_balances`).**
- Fixed `active_slot_id` generated column: changed `STORED` → `VIRTUAL` due to MySQL 8.0 limitation with FK-referencing columns in STORED generated columns.
- **Created frontend scaffold (`frontend/`) with React 18, Vite 5, TypeScript, Tailwind CSS 3, React Router 6.**
- **Implemented patient portal pages:** Landing, Login, Register, Dashboard, Doctors list with filtering, Book Appointment with date/time slots, My Appointments with cancel, Prescriptions, Invoices, Profile.
- **Implemented staff panel placeholder** with feature overview (Appointment Management, Patient Search, Prescriptions, Billing, Reports, Audit Log, DBMS Explorer, Doctor/Department Management).
- **Implemented `/health` page** for live API + database health monitoring.
- **Centralized API client** with JWT token management, auto-auth headers, 401 redirect, typed endpoints.
- **AuthContext** for login/register/logout/me state management with role-based route guards.
- **Vite proxy** `/api/*` → `http://localhost:8000` verified working; frontend health page shows live DB connection.
- Installed frontend dependencies (react, react-dom, react-router-dom, tailwindcss, postcss, autoprefixer, vite, typescript).
- **Implemented backend auth endpoints:** `POST /auth/register` (patient only), `POST /auth/login`, `GET /auth/me` with JWT tokens and bcrypt password hashing.
- **Created three demo accounts in MySQL** with bcrypt-hashed passwords:
  - `admin@demo.com` / `admin123` (ADMIN role)
  - `doctor@demo.com` / `doctor123` (DOCTOR role, linked to Dr. Demo Doctor with availability & 160 time slots)
  - `patient@demo.com` / `patient123` (PATIENT role, linked to Demo Patient profile)
- All three accounts verified working via `POST /api/v1/auth/login` and `GET /api/v1/auth/me` through both direct backend (port 8000) and frontend proxy (port 5173).

## Verification and limitations

- `MySQL80` service is running; localhost port 3306 is reachable. MySQL CLI exists at `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`, but is not on PATH.
- The configured app account connected using `app/db/connection.py`; `GET /api/v1/health/database` returned HTTP 200 and MySQL 8.0.46 for `openclinic_db`.
- A parameterized insert into `departments` was rolled back and verified absent. No persistent data was added by the check.
- Read-only metadata showed 15 InnoDB tables, two views, two appointment audit triggers, the `book_appointment` procedure, 18 foreign keys, and 10 check constraints.
- Python 3.14.7 is in use (the project requires Python 3.11+). Backend dependencies are installed.
- FastAPI `TestClient` returned HTTP 200 for `/api/v1/health` and `/api/v1/health/database`; it emitted a Starlette/httpx deprecation warning.
- **Three demo accounts created with bcrypt hashes:** admin@demo.com/admin123 (ADMIN), doctor@demo.com/doctor123 (DOCTOR), patient@demo.com/patient123 (PATIENT). All login and return valid JWT tokens with correct roles.
- **Backend auth endpoints implemented:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me` with Pydantic validation, bcrypt, JWT (HS256, 60-min expiry).
- **Frontend auth integration verified:** Login page successfully authenticates all three demo roles via Vite proxy `/api/*` → `http://localhost:8000`.
- A temporary-table probe failed because the runtime account lacks `CREATE TEMPORARY TABLES`. This permission is not needed for normal API operation; the transactional rollback check used a real table instead.
- Runtime account currently has schema-scoped `CREATE VIEW` and `TRIGGER` grants; reduce installer-only privileges after confirming no runtime feature needs them. No permissions were changed during this review.
- Database-backed workflow routes (doctors, appointments, prescriptions, billing, reports) are not implemented; only health and auth endpoints currently use MySQL.
- The database already contains records. This review did not read patient/user details or rerun schema/seed scripts.

## Schema review findings (2025-10-02)

See `docs/database-design.md` for full details. Key gaps vs PRD:
- Audit triggers only cover `appointments`; need `invoices`, `payments` (FR-39)
- No trigger to auto-update `invoices.status` from payments (FR-34)
- Missing procedures: slot generation (FR-18), appointment cancel/reschedule (FR-22/23), invoice creation (FR-30/35), payment recording (FR-31/35)
- `book_appointment` doesn't capture actor for audit trail
- Missing `users_grants.sql` for MySQL app user creation/grants
- Report views incomplete (FR-36, FR-37)
- DBMS Explorer metadata queries missing (FR-43–47)

## Next task

1. **Address schema gaps** (priority order):
   - Add audit triggers for `invoices` and `payments`
   - Add trigger to auto-update `invoices.status` (UNPAID/PARTIAL/PAID/VOID) from payments
   - Implement missing stored procedures (slot generation, cancel/reschedule, invoice creation, payment recording)
   - Update `book_appointment` to capture `@openclinic_actor_user_id`
   - Create `database/users_grants.sql` for app user setup
   - Add report views for appointment counts by date/doctor/department and revenue summaries
   - Add DBMS Explorer metadata queries (tables, columns, keys, views, triggers, procedures)

2. **Review and tighten app-user grants** using the MySQL administrator; no grants were changed during the connection review.

3. **Implement backend workflow modules** against the verified schema:
   - Departments/Doctors CRUD + availability/slots endpoints
   - Appointments booking/cancel/reschedule (using `book_appointment` procedure)
   - Prescriptions CRUD
   - Invoices/Payments with transaction support
   - Reports (appointment counts, revenue)
   - Audit log queries
   - DBMS Explorer metadata endpoints

4. **Wire frontend pages to real backend endpoints:**
   - Doctors page → `GET /doctors`, `GET /doctors/{id}/slots`
   - Book Appointment → `POST /appointments` (uses stored procedure)
   - My Appointments → `GET /appointments`, `PATCH /appointments/{id}/cancel`
   - Profile → `GET/PATCH /patients/me`
   - Prescriptions/Invoices pages with real data
   - Staff Panel with role-based access control
