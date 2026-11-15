# OpenClinic — code structure map

A guided tour of the repository so any file can be found in seconds. The layout itself is
mandated by the binding spec (`§8.3 file tree`) — this document explains *what lives where
and why*. Nothing here moves code around; it documents the structure as built.

---

## Repository root

```
clinic manager/
├── backend/                  FastAPI service (read-only for frontend work, §17.4)
│   └── app/                  routes, repositories, auth, models
├── database/                 MySQL schema, seed, stored procedures, backups (read-only)
├── docs/                     project documentation and screenshots
│   ├── frontend-vite-legacy-guide.md   archived guide for the retired Vite app
│   ├── CODE_STRUCTURE.md     ← this file
│   ├── PERMISSIONS_LOG.md    log of every owner permission taken
│   └── screens/              parity-gate and dashboard screenshots
├── frontend/                 ← the OpenClinic app (Next.js 16 + React 19)
├── frondend plan/            reference materials (spec zip, images) — untouched
├── scripts/                  dev orchestration (starts Next 3000 + FastAPI 8000)
├── PROGRESS.md               overall project log incl. the rebuild section
└── AGENTS.md, plan/…         agent + planning notes
```

## `frontend/` — the application

```
frontend/
├── app/                      ROUTES (Next.js App Router) — "apps" layer
│   ├── layout.tsx            root layout: fonts, metadata, providers
│   ├── globals.css           the ONLY source of colour/motion tokens (§5.1, §9)
│   ├── not-found.tsx         404 page
│   ├── (marketing)/          public landing at "/"
│   ├── (auth)/login|register sign-in / sign-up (real FastAPI auth)
│   ├── (portal)/             authenticated shell: sidebar + topbar
│   │   ├── dashboard/        "Clinic overview" / "Welcome back"
│   │   ├── doctors/          directory + doctors/[doctorId]/book (booking flow)
│   │   ├── appointments/     table with search/filter/sort/cancel
│   │   ├── prescriptions/    read-only list + detail sheet
│   │   ├── invoices/         billing summary cards + table
│   │   ├── profile/          account form (address uses Textarea)
│   │   └── staff/            staff panel (DOCTOR/ADMIN/RECEPTIONIST via RoleGate)
│   └── health/               live API + database status page
├── components/               UI building blocks, grouped by surface
│   ├── brand/                logo
│   ├── marketing/            landing sections (hero, bento, marquee, charts, footer…)
│   ├── auth/                 login/register forms, RequireAuth, RoleGate
│   ├── portal/               dashboard/appointments/doctors/booking/prescriptions/
│   │                         invoices/profile/staff views, table, sheets, charts
│   ├── motion/               Reveal, Stagger, CountUp, PageTransition (§9 tokens)
│   └── ui/                   shadcn primitives (button, input, dialog, sheet, select,
│                             avatar, dropdown-menu, textarea, sonner, tooltip…)
├── features/api/             DATA layer
│   ├── client.ts             fetch client: bearer token, 401 event, error extraction
│   └── mock.ts               typed mock adapter (TODO(api) marks future endpoints)
├── lib/                      resources: format helpers, demo clock, cn(), motion tokens
├── providers/                React context: AuthProvider, LenisProvider, AppProviders
├── shared/                   apiTypes.ts — single source of API/mock types
├── next.config.ts            strict mode + /api rewrite to FastAPI
├── DEVIATIONS.md             append-only log of every divergence from the spec
└── README.md                 how to run, ports, credentials, mock boundary
```

## How data flows

1. **Auth is real.** `app/(auth)` → `components/auth/*` → `providers/auth-provider`
   → `features/api/client.ts` → Next rewrite `/api/*` → FastAPI `127.0.0.1:8000`.
   A 401 anywhere emits `openclinic:unauthorized`, which clears the session.
2. **Clinical data is mock.** Every portal view imports from `features/api/mock.ts`
   (frozen demo clock `DEMO_NOW = 2026-11-12T09:05:52`) — swap to the client per the
   `TODO(api)` markers when the backend endpoints land.
3. **Role decides the chrome.** `shared/apiTypes.Role` drives the sidebar items (§12.4),
   RequireAuth guards pages, RoleGate guards `/staff`.

## Where to change things

| Task | File |
| --- | --- |
| Colours, shadows, animations | `frontend/app/globals.css` only (never inline hex) |
| Copy/text | `components/**` — must match spec §7 verbatim |
| A new mock field/endpoints | `features/api/mock.ts` + `shared/apiTypes.ts` |
| Navigation per role | `components/portal/sidebar.tsx` |
| Toasts | mount once in `providers/app-providers.tsx`; fire via `sonner` |
| Charts (SVG, no library) | `portal/pill-bar-chart.tsx`, `gauge.tsx`, `countdown-card.tsx`, `marketing/schema-bars.tsx` |
