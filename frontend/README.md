# OpenClinic Frontend

React + Vite + TypeScript + Tailwind CSS frontend for the OpenClinic educational DBMS project.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **API**: Centralized fetch-based client with JWT auth

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers (Auth)
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main app with routing
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

## Pages

### Patient Portal (Public)
- `/` - Landing page
- `/login` - User login
- `/register` - Patient registration

### Patient Portal (Protected)
- `/dashboard` - Patient dashboard with upcoming appointments
- `/doctors` - Browse doctors with department filtering
- `/doctors/:doctorId/book` - Book appointment with date/time selection
- `/appointments` - View upcoming/past appointments with cancel action
- `/prescriptions` - View prescriptions (placeholder)
- `/invoices` - View invoices (placeholder)
- `/profile` - Manage patient profile

### Staff Panel (Protected - Admin/Doctor/Receptionist)
- `/staff` - Staff dashboard with feature overview (placeholder)

### System
- `/health` - API and database health check

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Backend running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

The Vite dev server proxies `/api/*` requests to `http://localhost:8000`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## API Integration

The frontend uses a centralized API client (`src/api/client.ts`) that:
- Handles JWT token storage in localStorage
- Automatically attaches Authorization headers
- Redirects to login on 401 responses
- Provides typed methods for all endpoints

## Authentication Flow

1. User registers/logs in via `/auth/register` or `/auth/login`
2. Backend returns JWT access token
3. Token stored in localStorage and attached to subsequent requests
4. Protected routes check auth state via `AuthContext`
5. Role-based access control on staff routes

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | patient123 |
| Doctor | doctor@demo.com | doctor123 |
| Admin | admin@demo.com | admin123 |

## Educational Notes

- This is a **college DBMS project prototype**
- All data is **fictional**
- **Not for real clinical use**
- Backend auth endpoints (`/auth/register`, `/auth/login`, `/auth/me`) are implemented

## License

MIT