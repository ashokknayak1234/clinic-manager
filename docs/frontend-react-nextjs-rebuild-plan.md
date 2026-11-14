# Frontend rebuild plan: React 19 + Next.js 16

Status: planning. No code changes until design references are reviewed.

## Decisions

| Topic | Decision |
| --- | --- |
| Framework | Next.js 16.4 (App Router) + React 19.3, TypeScript |
| Location | Replace `frontend/` in place (old Vite app recoverable from git history) |
| Styling | Tailwind CSS 4 + shadcn/ui, custom theme from design references |
| Motion | `motion` (Framer Motion) for UI/route animation + `lenis` for smooth scroll |
| Motion feel | Subtle & premium: soft entrances, gentle springs, scroll reveals |
| Backend | FastAPI unchanged; Next.js proxies `/api/*` to `http://localhost:8000` |
| Data | Real auth API; other screens use a typed mock layer until backend modules land |

## Why this stack

Next.js is React, so the app stays React 19 component code. The App Router adds
server components, streaming, image/font optimisation, prefetching, and per-route
bundles. Interactive and animated UI stays in `"use client"` components; static
sections render on the server for fast LCP.

## Target structure

```text
frontend/
  app/
    (marketing)/            # public, mostly server components
      page.tsx              # landing / hero from references
      layout.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
      layout.tsx
    (portal)/               # authenticated patient area
      layout.tsx            # client shell: nav, auth guard, page transitions
      dashboard/page.tsx
      doctors/page.tsx
      doctors/[doctorId]/book/page.tsx
      appointments/page.tsx
      prescriptions/page.tsx
      invoices/page.tsx
      profile/page.tsx
    (staff)/
      staff/page.tsx        # role-guarded (ADMIN/DOCTOR/RECEPTIONIST)
    health/page.tsx
    layout.tsx              # fonts, providers, skip link
    globals.css             # Tailwind 4 @theme tokens
  components/
    ui/                     # shadcn/ui primitives
    motion/                 # Reveal, Stagger, PageTransition, Magnetic
    layout/                 # Navbar, Footer, Shell
  features/                 # existing feature logic, ported
    api/httpClient.ts
    auth/AuthProvider.tsx
    ...
  lib/
    motion.ts               # durations, easings, variants
    utils.ts                # cn()
  next.config.ts            # rewrites for /api/*
```

## Route mapping

| Today (Vite) | Next.js route | Rendering |
| --- | --- | --- |
| `/` | `app/(marketing)/page.tsx` | Server + client motion islands |
| `/login`, `/register` | `app/(auth)/*/page.tsx` | Client (form state) |
| `/dashboard` | `app/(portal)/dashboard` | Client, auth-guarded |
| `/doctors` | `app/(portal)/doctors` | Client fetch |
| `/doctors/:doctorId/book` | `app/(portal)/doctors/[doctorId]/book` | Client, dynamic params |
| `/appointments`, `/prescriptions`, `/invoices`, `/profile` | same names under `(portal)` | Client |
| `/staff` | `app/(staff)/staff` | Client, role-guarded |
| `/health` | `app/health` | Client poll |

## Design system

1. Extract from references: palette, type scale, radii, shadows, spacing rhythm.
2. Encode as Tailwind 4 theme tokens in `globals.css` (`@theme`), no hard-coded hex in components.
3. shadcn/ui components added via the shadcn MCP, then themed (not restyled ad hoc).
4. Fonts via `next/font` (local or Google), no layout shift.

## Motion rules

- Tokens: fast 180ms, base 320ms, slow 600ms; entrance easing
  `cubic-bezier(0.22, 1, 0.36, 1)`; hover spring stiffness 220 / damping 26.
- Entrances: opacity + 12–16px y-offset, children staggered 40–70ms.
- Scroll reveals: `whileInView`, once, 20% threshold, no re-trigger.
- Page transitions: 8px slide + cross-fade, scroll restored after.
- Hovers: soft lift (scale 1.01–1.02), no bounce, icon nudge.
- Animate only `transform` and `opacity`; never animate layout properties.
- Honour `prefers-reduced-motion`: motion collapses to opacity-only or none.
- Smooth scroll via Lenis, disabled when reduced motion is on.

## Performance budget

- Marketing route JS: <= 150 KB gzip first load.
- LCP <= 2.0s local, CLS <= 0.05, INP <= 200ms.
- `next/image` for all raster assets, `next/font` for type.
- Heavy sections below the fold loaded with `dynamic()`.
- Motion components are client-only and tree-shaken; no animation library on server.
- Keep the FastAPI proxy server-side; no CORS changes needed for dev.

## Migration sequence

1. **Foundation** — scaffold Next 16 in `frontend/`, Tailwind 4, shadcn init,
   `next/font`, proxy rewrites, base layout. Keep the app booting at `:3000`.
2. **Design tokens** — palette/type/radii from references; motion tokens.
3. **Marketing pages** — build to reference; verify responsive + motion budget.
4. **Auth** — port `AuthProvider` (JWT, role guards) and login/register forms.
5. **Portal shell + pages** — port each feature page, keep API client contract.
6. **Staff panel** — role-guarded surface.
7. **Polish** — motion QA, keyboard/aria pass, Lighthouse, retire Vite scripts
   and update root README / `scripts/dev.py`.

Each phase ends with a checkpoint: `npm run build` clean, route renders, no
console errors, and a short note added to `PROGRESS.md`.

## Verification per phase

- `next build` succeeds with no type errors.
- Routes render at `:3000`; `/api/*` proxy reaches FastAPI at `:8000`.
- Login with the three demo accounts (admin/doctor/patient) still works.
- Keyboard tab order and focus rings intact; reduced-motion path checked.
- Lighthouse run recorded for marketing and dashboard routes.

## Open items

- [ ] Design reference images -> per-screen component specs.
- [ ] Confirm brand name/copy and whether imagery is provided or needs sourcing.
- [ ] Decide mock-vs-real data for doctors/appointments/billing screens while
      backend workflow endpoints are still missing.
- [ ] Confirm git branch strategy before replacing `frontend/` in place.
