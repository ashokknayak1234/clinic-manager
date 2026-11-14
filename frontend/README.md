# OpenClinic Frontend

The OpenClinic web app, rebuilt as a React 19 + Next.js 16 App Router application. It is an
educational clinic-management prototype: all clinical data on screen is fictional sample
data, and the UI says so on every portal screen.

- **Framework:** Next.js 16.4.6 (App Router, Turbopack)
- **UI:** React 19.3.1, Tailwind CSS 4, shadcn/ui (radix-nova style), lucide-react
- **Motion:** `motion` 14, Lenis 1.3 (marketing page only)
- **Language:** TypeScript 5, strict
- **API:** FastAPI on `http://127.0.0.1:8000`, proxied through Next

## Ports

| Service | URL |
| --- | --- |
| Frontend (Next) | `http://localhost:3000` |
| Backend (FastAPI) | `http://127.0.0.1:8000` |
| API docs | `http://127.0.0.1:8000/docs` |

Use `http://localhost:3000`, not `127.0.0.1:3000`, during development. Next 16 treats a
different host as a cross-origin request and blocks dev resources, which breaks hydration.

## Quick start

```powershell
# 1. Backend (from the repository root)
python -m uvicorn app.main:app --port 8000 --host 127.0.0.1 --app-dir backend

# 2. Frontend
cd frontend
npm install
npm run dev
```

`scripts/dev.py` starts both servers and waits for the API health check before launching
Next.

## Environment variables

Copy `frontend/.env.example` to `frontend/.env.local` if you need to move the backend:

```dotenv
API_ORIGIN=http://127.0.0.1:8000
```

`API_ORIGIN` is read by `next.config.ts` and used by the `/api/:path*` rewrite. The default is
`http://127.0.0.1:8000`.

The browser always calls relative URLs (`/api/v1/...`). The Next server proxies them to
`API_ORIGIN`, so the FastAPI CORS list does not need a `localhost:3000` entry for the app to
work.

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Marketing | Every landing section, motion, no auth |
| `/login` | Auth | Real `POST /api/v1/auth/login` |
| `/register` | Auth | Real `POST /api/v1/auth/register` |
| `/dashboard` | Portal | Patient/staff overview, mock data |
| `/doctors` | Portal | Doctor directory, mock data |
| `/doctors/[doctorId]/book` | Portal | Slot picker + demo booking dialog |
| `/appointments` | Portal | Mock table, search, filter, cancel dialog |
| `/prescriptions` | Portal | Mock list + detail sheet |
| `/invoices` | Portal | Mock billing table and totals |
| `/profile` | Portal | `/auth/me` identity + local-only edits |
| `/staff` | Portal | Staff workspace, mock queues |
| `/health` | Public | Live `/api/v1/health` and `/api/v1/health/database` |

All portal routes are wrapped by `RequireAuth`; the sidebar and topbar live in
`app/(portal)/layout.tsx`.

## Authentication

`providers/auth-provider.tsx` and `features/api/client.ts` handle the real FastAPI auth API:

- `POST /auth/login` and `POST /auth/register` store the bearer token. "Remember me" selects
  `localStorage` vs `sessionStorage`.
- `GET /auth/me` restores the session on load.
- A `401` clears the token and dispatches `openclinic:unauthorized`; `RequireAuth` owns the
  redirect, so the API layer never calls `window.location`.
- Registering lands on `/dashboard` per the rebuild spec.

Only auth and health call the backend. There are no invented endpoints.

## Mock-adapter boundary

`features/api/mock.ts` is the typed mock store for every clinical screen. It exports the
canonical demo dataset (doctors, appointments, prescriptions, invoices, slots, queues) and
each export carries a `// TODO(api): replace with GET /...` comment. Types live in
`shared/apiTypes.ts`.

`lib/demo-clock.ts` freezes the demo clock (`DEMO_NOW`, `DEMO_TODAY`) so server and client
render identically and screenshots stay reproducible. Do not call `Date.now()` or `new Date()`
during render; the only live clock is the `/health` refresh.

When the backend gains a workflow route, replace the matching mock export and keep the
component contract unchanged.

## Demo accounts

The rebuild spec expects `patient@demo.com`, `doctor@demo.com`, and `admin@demo.com`. They exist
in `database/backups/openclinic_db_before_seed_2026-11-01.sql`, but **they are not present in
the current local database** (verified 2026-11-14: the `users` table contains only inactive
`*.seed@example.invalid` rows and one QA account). Nothing in `database/seed.sql` creates login
accounts.

Until those rows are restored, sign in with an account that already exists in your local
database or create one at `/register`. Note the current backend role bug: registration always
assigns `RECEPTIONIST` (`role_id = 4`), so a newly registered account sees the staff workspace
rather than the patient navigation. See `DEVIATIONS.md` for the full record.

## Scripts

```powershell
npm run dev        # Next dev server on :3000
npm run build      # Production build, type-checks included
npm start          # Serve the production build on :3000
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
frontend/
├── app/
│   ├── (marketing)/          # landing page
│   ├── (auth)/               # login, register
│   ├── (portal)/             # dashboard, doctors, appointments, prescriptions,
│   │                         # invoices, profile, staff
│   ├── health/               # live API/database status
│   ├── globals.css           # design tokens + Tailwind 4 theme
│   └── layout.tsx            # fonts, metadata, providers
├── components/
│   ├── auth/ brand/ marketing/ motion/ portal/
│   └── ui/                   # shadcn primitives
├── features/api/
│   ├── client.ts             # fetch client, token handling, 401 event
│   └── mock.ts               # typed mock adapter
├── lib/                      # motion tokens, formatters, demo clock, utils
├── providers/                # app, auth, Lenis
├── shared/apiTypes.ts        # API/mock types
├── legacy-vite/              # previous Vite app, retained until cleanup
├── next.config.ts
├── DEVIATIONS.md
└── README.md
```

## Legacy Vite app

The previous Vite implementation is preserved in `frontend/legacy-vite/` and its guide in
`frontend/FRONTEND_DEVELOPMENT_GUIDE.md`. It is excluded from the Next build. It will be
removed (with the guide moved to `docs/frontend-vite-legacy-guide.md`) only after the full
parity gate passes; some gates are still unverified, as recorded in `DEVIATIONS.md`.

## Educational disclaimer

This is a college DBMS project prototype. All people, appointments, prescriptions, and
invoices shown in the interface are fictional. It is not suitable for real clinical use.
