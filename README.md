# KUN Glass & Aluminium — Website & CMS

Full-stack website with an admin CMS for **KUN Glass & Aluminium**, a glass, aluminium and ACP fabrication company in Nashik, Maharashtra.

## Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + Framer Motion |
| Backend  | Node.js + Express 4 + TypeScript                          |
| Database | MongoDB Atlas (Mongoose 8)                                |
| Auth     | JWT in HTTP-only cookie (+ Authorization header fallback)  |
| Media    | Multer (memory) + ImageKit                                |

## Project Structure

```
kun glasses/
├── backend/     Express REST API + seed script
└── frontend/    Next.js website + admin panel
```

## Architecture

```
VISITOR → Vercel (frontend) → Render (API) → MongoDB Atlas
ADMIN   → Vercel (frontend) → Render (API) → ImageKit → MongoDB Atlas
```

The frontend and API are on **different domains**, so the auth cookie is issued with
`SameSite=None; Secure` in production and `SameSite=Lax` in local development.
CORS is restricted to the origin(s) listed in `CLIENT_URL`.

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally (default URI `mongodb://127.0.0.1:27017/kun_glass`)

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env        # Windows (or: cp .env.example .env)
npm run dev                   # starts API on http://localhost:5000
```

Optional — create the first admin (required before you can log in):

```bash
# add SEED_ADMIN_PASSWORD=<strong-password> to backend/.env first
npm run seed
```

The seeder **refuses to run without `SEED_ADMIN_PASSWORD`** and is never executed
automatically on server start. It is also non-destructive: an existing admin is
left completely alone. To deliberately reset its password:

```bash
SEED_ADMIN_RESET_PASSWORD=true npm run seed
```

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env        # Windows (or: cp .env.example .env)
npm run dev                   # starts website on http://localhost:3000
```

Open http://localhost:3000 for the public site and http://localhost:3000/admin for the CMS.

## Environment Variables

**Backend (`backend/.env`)** — see `backend/.env.example` for the full annotated list.

| Variable | Required in production | Purpose |
| --- | --- | --- |
| `NODE_ENV` | yes | `production` |
| `PORT` | provided by Render | API port |
| `CLIENT_URL` | **yes** | Allowed CORS origin(s), comma-separated |
| `MONGODB_URI` | **yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **yes** | Long random string (e.g. `openssl rand -base64 48`) |
| `JWT_EXPIRES_IN` / `JWT_COOKIE_EXPIRES_IN` | no | Token lifetime (default 7d) |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` | yes for uploads | ImageKit |
| `SMTP_*`, `FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` | no | Enquiry emails (skipped if unset) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | only for seeding | First admin |

The API fails fast at boot if `JWT_SECRET`, `CLIENT_URL` or `MONGODB_URI` are missing
in production, so a misconfigured deploy never half-starts.

**Frontend (`frontend/.env`)**

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `https://<your-api>.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for metadata, sitemap, robots) |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |

## Roles

- `SUPER_ADMIN` — full access (settings, users, media, everything)
- `ADMIN` — manage content, enquiries, media, settings
- `EDITOR` — manage content (services/projects/clients) only

## Scripts

| Command | Where | Purpose |
| --- | --- | --- |
| `npm run dev` | backend | Start API with hot reload |
| `npm run build` | backend | Compile TypeScript to `dist/` |
| `npm start` | backend | Run the compiled production server |
| `npm run seed` | backend | One-time controlled seeding |
| `npm run dev` | frontend | Start Next.js dev server |
| `npm run build` | frontend | Production build (includes TypeScript checks) |
| `npm run typecheck` | frontend | TypeScript only, no build |
| `npm start` | frontend | Serve the production build |

## Public API Endpoints

- `GET /api/health` — health check (used by Render)
- `GET /api/settings/public` — site settings + contact methods (drives Navbar/Footer/Contact)
- `GET /api/services/public`, `GET /api/services/slug/:slug`
- `GET /api/projects/public`, `GET /api/projects/slug/:slug`
- `GET /api/clients/public`
- `POST /api/enquiries` — public enquiry form

Admin mutations (POST/PUT/PATCH/DELETE) all require an authenticated, role-authorised session.

## Deployment Checklist

### Backend — Render

- [ ] Repository connected, **Root Directory = `backend`**
- [ ] Build command: `npm install && npm run build`
- [ ] **Start command: `npm start` — NOT `npm run seed && npm start`.**
      The seeder must never run on every deploy/restart.
- [ ] Health check path: `/api/health` (also reports the runtime mode)
- [ ] `NODE_ENV=production`
- [ ] **Delete any `PORT` variable.** Render injects its own; a hardcoded
      `PORT=5000` overrides it and breaks routing.
- [ ] `MONGODB_URI` = MongoDB Atlas URI
- [ ] `JWT_SECRET` = strong random value
- [ ] `CLIENT_URL` = the Vercel frontend URL, no trailing slash
- [ ] `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- [ ] `SMTP_*`, `FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` (optional)
- [ ] Seed the first admin once, manually — not on every restart

> **Critical:** do not copy your local `.env` into Render. A local
> `NODE_ENV=development` makes the API issue `SameSite=Lax` cookies, which
> browsers refuse to send on cross-site requests — login returns 200 but every
> authenticated call then 401s. The API also treats `RENDER=true` as production
> as a safety net, but set `NODE_ENV=production` correctly.

### Frontend — Vercel

- [ ] Repository connected, **Root Directory = `frontend`**
- [ ] Framework preset: Next.js (auto-detected)
- [ ] `NEXT_PUBLIC_API_URL` = `https://<your-api>.onrender.com` (no trailing slash)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://<your-app>.vercel.app`
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- [ ] Production build succeeds (`npm run build`)
- [ ] Redirect `NEXT_PUBLIC_API_URL` changes require a redeploy

### Database — MongoDB Atlas

- [ ] Cluster created
- [ ] Database user created with read/write access
- [ ] IP access list allows Render (or `0.0.0.0/0`)
- [ ] Production URI stored in Render as `MONGODB_URI`

### ImageKit

- [ ] Public key, private key and URL endpoint set
- [ ] Upload tested from Admin → Media
- [ ] Images render on the public site

## Notes

- Address, phone, email and social links are managed from **Admin → Settings**.
- Project cover/gallery images are separate from global page heroes.
- Both ImageKit uploads and external HTTPS image URLs are supported; galleries may mix both.
- SMTP and ImageKit are optional: without them the site still runs (uploads disabled, notifications skipped).
