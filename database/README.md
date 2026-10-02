# OpenClinic database

MySQL 8.x, InnoDB, and `utf8mb4` database scripts for the local educational project. All included sample catalog content is fictional. The scripts do not drop or truncate tables.

## MySQL access status

Verified locally on 2026-10-02: Windows service `MySQL80` is running, localhost port 3306 accepts connections, and MySQL 8.0.46 is installed. The client is at `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe` (it is not on PATH). The configured `openclinic_app` account successfully connected to `openclinic_db` using the backend connection module. The database contains 15 InnoDB tables, 2 views, the `book_appointment` procedure, and 2 appointment audit triggers.

The app account does not have `CREATE TEMPORARY TABLES`; a temporary-table diagnostic therefore failed with a privilege error. It can perform normal configured database reads and writes. Its current grants also include `CREATE VIEW` and `TRIGGER`, which are not needed for ordinary API runtime and should be reviewed before calling the grants least-privilege. No MySQL permissions were changed during this check. Keep credentials in the ignored local `backend/.env`; do not share or commit them.

## Configure and initialize

Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in `backend/.env`. The sample config defaults to `openclinic_db`; `schema.sql` currently creates that named database. Review the target database first. For a new disposable local database, from this directory run the scripts in order with a MySQL client:

From PowerShell in the `database/` directory, set `$mysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'`, then run each script with the local administrator account (enter its password at the prompt):

1. `Get-Content -Raw .\schema.sql | & $mysql -u <local-admin-user> -p`
2. `Get-Content -Raw .\seed.sql | & $mysql -u <local-admin-user> -p openclinic_db`
3. `Get-Content -Raw .\views.sql | & $mysql -u <local-admin-user> -p openclinic_db`
4. `Get-Content -Raw .\procedures.sql | & $mysql -u <local-admin-user> -p openclinic_db`
5. `Get-Content -Raw .\triggers.sql | & $mysql -u <local-admin-user> -p openclinic_db`

Run schema/object installation as a local database administrator. The application account is for runtime only and should be limited to required DML, routine execution, and metadata reads. No user or permission changes were made during this check.

`seed.sql` is rerunnable and inserts only roles, fictional departments, and fictional medicine catalog entries. It does not seed login users; create demo accounts only after installing the backend dependencies and using its bcrypt implementation to hash credentials.

## Verify connection

From `backend/`, activate the environment and run `python -c "from app.core.database import connect; c=connect(); cur=c.cursor(); cur.execute('SELECT VERSION() AS version, DATABASE() AS db'); print(cur.fetchone()); c.close()"`. This performs a real connection and read. The configured connection returned MySQL 8.0.46 and `openclinic_db` during verification. The API endpoint `GET /api/v1/health/database` also returned HTTP 200. A controlled insert into `departments` was rolled back and verified absent.

## Design and reset

See [../docs/database-design.md](../docs/database-design.md) for the ER overview, constraints, and decisions. Never reset a database that may contain user data. For a disposable demonstration database only, back up or confirm its contents before an administrator drops/recreates it manually; this repository intentionally provides no destructive reset script.
