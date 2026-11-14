# OpenClinic Frontend Development Guide

This guide is for anyone building or maintaining the OpenClinic web interface. It describes the current project, its structure, the frontend/backend boundary, and the conventions new work should follow.

## 1. What this project is

OpenClinic is an educational clinic-management system. It demonstrates patient and staff workflows such as finding doctors, booking appointments, viewing prescriptions and invoices, and managing a patient profile. The frontend is a React single-page application; the backend is FastAPI; MySQL is accessed by the backend.

The frontend exists to present those workflows and send requests to the API. It must never connect directly to MySQL. This keeps database credentials on the server and makes the backend responsible for validation, authorization, and business rules.

This is a student project with fictional data, not a real clinical system. Do not add real patient information or present it as suitable for clinical use.

## 2. Technologies

- React 18 and TypeScript
- Vite 5 for local development and production builds
- React Router 6 for client-side routes
- Tailwind CSS 3 for styling
- A shared `fetch`-based client for API requests and bearer-token handling

## 3. Current source layout

```text
frontend/
├── src/
│   ├── api/
│   │   └── httpClient.ts          # Shared fetch client, auth headers, response handling
│   ├── components/
│   │   └── layout/
│   │       └── Layout.tsx         # Shared page shell and navigation
│   ├── features/
│   │   ├── appointments/          # Booking and appointment list pages
│   │   ├── auth/                  # Login, registration, auth context
│   │   ├── billing/               # Invoice page
│   │   ├── dashboard/             # Patient dashboard
│   │   ├── doctors/               # Doctor directory
│   │   ├── health/                # API/database health page
│   │   ├── home/                  # Landing page
│   │   ├── prescriptions/         # Prescription page
│   │   ├── profile/               # Patient profile page
│   │   └── staff/                 # Staff dashboard
│   ├── shared/
│   │   └── apiTypes.ts             # Shared users, domain, and API response types
│   ├── App.tsx                    # Route definitions and route guards
│   ├── index.css                  # Global styles and Tailwind directives
│   └── main.tsx                   # React entry point and top-level providers
├── index.html
├── package.json
└── vite.config.ts
```

Keep feature-specific screens and logic inside their feature folder. Put UI used by multiple features in `components/`, API transport concerns in `api/`, and shared data contracts in `shared/`.

## 4. How the app starts and routes

`src/main.tsx` mounts the app inside `BrowserRouter` and `AuthProvider`. `src/App.tsx` maps URLs to feature pages and applies the shared layout and route guards.

Current routes:

| Route | Access | Page |
|---|---|---|
| `/` | Signed out | Landing page |
| `/login` | Signed out | Login |
| `/register` | Signed out | Patient registration |
| `/dashboard` | Signed in | Patient dashboard |
| `/doctors` | Signed in | Doctor directory |
| `/doctors/:doctorId/book` | Signed in | Book an appointment |
| `/appointments` | Signed in | Patient appointments |
| `/prescriptions` | Signed in | Prescriptions |
| `/invoices` | Signed in | Invoices |
| `/profile` | Signed in | Patient profile |
| `/staff` | Admin, doctor, or receptionist | Staff dashboard |
| `/health` | Public | API and database health |

The route guards improve navigation and user experience. They are not security controls: every protected operation must also be authorized by the backend.

## 5. Authentication and API requests

`features/auth/AuthContext.tsx` owns the frontend's current-user state and exposes `login`, `register`, `logout`, and `checkAuth` to components. `api/httpClient.ts` owns request transport and access-token storage:

1. Login or registration sends credentials to `/api/v1/auth/login` or `/api/v1/auth/register`.
2. The backend returns a JWT access token.
3. The API client stores the token in `localStorage` and adds it as a `Bearer` authorization header to protected requests.
4. The auth context calls `/api/v1/auth/me` to load the current user.
5. A 401 from an authenticated request clears the saved token and returns the browser to `/login`.

In local development, `vite.config.ts` proxies requests beginning with `/api` to `http://localhost:8000`. The API client currently uses the relative `/api/v1` base path. Although `frontend/.env.example` contains `VITE_API_BASE_URL`, the client does not currently read that variable; do not assume changing it changes the API destination.

The shared `ApiResponse<T>` type represents the API client's normalized result. The backend auth endpoints return plain response models while health endpoints return an envelope; the client normalizes both forms. Continue using the shared client so token headers and error handling stay consistent.

### Backend functionality status

The backend currently implements authentication (`register`, `login`, `me`) and health endpoints. Some frontend screens already call planned workflow URLs, but their backend endpoints are not implemented yet. Calls currently made by the frontend include:

- `GET /departments` and `GET /doctors`
- `GET /doctors/{id}` and `GET /doctors/{id}/slots?date=...`
- `GET /appointments`, `POST /appointments`, and `PATCH /appointments/{id}/cancel`
- `GET /patients/me`

The prescriptions, invoices, and staff screens are placeholders. Before wiring a screen to real data, coordinate the endpoint, request/response shape, ownership rules, and error behavior with the backend developer. Do not treat a frontend URL or TypeScript type as proof that the backend endpoint exists.

## 6. Local development

Prerequisites: Node.js 18 or newer, npm, and the FastAPI backend running on port 8000 for API-backed pages.

From this directory:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. To start both project servers from the repository root, use `python scripts/dev.py` after backend dependencies and local configuration have been set up.

Available frontend scripts:

```bash
npm run dev       # Start Vite
npm run build     # Type-check TypeScript and create a production build
npm run preview   # Serve the production build locally
npm run lint      # Configured to call ESLint; ESLint is not currently installed/configured
```

## 7. Rules for new frontend work

### Do

- Put each screen or cohesive UI flow in its feature folder.
- Use `api/httpClient.ts` for backend requests; keep fetch, token, and response handling centralized.
- Add or update types in `shared/apiTypes.ts` when they are shared across features. Match the agreed backend contract rather than guessing field names.
- Show loading, empty, success, and error states for data-driven screens.
- Validate user input for usability, then rely on the backend to repeat validation at the trust boundary.
- Preserve existing URL paths and role behavior unless a route change is agreed with the team.
- Use fictional/demo data only. Keep credentials and secrets out of frontend source and browser storage; the current JWT is an access token and is stored in local storage by the existing design.
- Run `npm run build` before handing off frontend changes.

### Do not

- Connect to MySQL from the browser or put database credentials in `VITE_*` variables.
- Treat route guards, hidden buttons, or client-side role checks as authorization.
- Call `fetch` directly from a page when the shared client can do it.
- Duplicate authentication state or write/read the token outside the API client and auth flow without coordinating a design change.
- Hardcode fake API success responses to make an unfinished backend feature look complete. If mock data is needed for a design preview, label it clearly and keep it separate from the real API path.
- Change database schema or backend business rules as part of a frontend-only task.
- Add a UI library or another abstraction for a one-off screen without a clear need and team agreement.

## 8. A practical feature workflow

1. Confirm the user workflow and whether the required backend endpoint exists.
2. Agree on the API method, URL, authorization, request fields, and response fields with the backend developer.
3. Add/update shared types and the smallest API-client method needed.
4. Build the UI in the owning feature folder, including loading and failure states.
5. Add or update the route in `App.tsx` if the feature needs a page, preserving its access rules.
6. Check the flow against the running backend and run `npm run build`.
7. Document any unfinished backend dependency rather than implying the workflow is complete.

## 9. Known project limitations

- Workflow API endpoints for doctors, appointments, patient profile, prescriptions, and billing are pending on the backend.
- Prescription, invoice, and staff screens are placeholders.
- There is no frontend test suite or working ESLint installation/configuration at present.
- This project is an educational prototype and must not be used for real clinical care.
