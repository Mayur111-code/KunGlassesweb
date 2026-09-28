# KUN Glass & Aluminium — Website & CMS

Production-ready full-stack website with an admin CMS for **KUN Glass & Aluminium**, a glass, aluminium and ACP fabrication company in Nashik, Maharashtra.

## Stack

| Layer    | Tech                                          |
| -------- | --------------------------------------------- |
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion |
| Backend  | Node.js + Express + TypeScript                 |
| Database | MongoDB (Mongoose 8)                           |
| Auth     | JWT in HTTP-only cookie + Authorization header  |
| Media    | Multer + ImageKit                              |

## Project Structure

```
kun glasses/
├── backend/     Express REST API + seed script
└── frontend/    Next.js website + admin panel
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (default URI `mongodb://127.0.0.1:27017/kun_glass`)

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env        # Windows (or: cp .env.example .env)
npm run seed                  # seed admin, services, clients, projects, settings
npm run dev                   # starts API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env        # Windows (or: cp .env.example .env)
npm run dev                   # starts website on http://localhost:3000
```

Open http://localhost:3000 for the public site and http://localhost:3000/admin for the CMS.

## Default Admin Login (from seed)

```
Email:    admin@kunglass.com
Password: admin@123
```

> Change this password immediately after first login.

## Environment Variables

**Backend (`backend/.env`)**
- `PORT` — API port (default 5000)
- `CLIENT_URL` — allowed CORS origin (default `http://localhost:3000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN`
- `BCRYPT_ROUNDS`
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` — image uploads
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` — enquiry email notifications
- `FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`

**Frontend (`frontend/.env`)**
- `NEXT_PUBLIC_API_URL` — backend base URL (default `http://localhost:5000`)
- `NEXT_PUBLIC_SITE_URL` — site canonical URL
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint

## Roles

- `SUPER_ADMIN` — full access (settings, users, media, everything)
- `ADMIN` — manage content, enquiries, media, settings
- `EDITOR` — manage content (services/projects/clients) only

## Scripts

| Command         | Where      | Purpose                             |
| --------------- | ---------- | ----------------------------------- |
| `npm run dev`   | backend    | Start API (ts-node-dev)             |
| `npm run seed`  | backend    | Seed database with demo content      |
| `npm run build` / `npx tsc` | backend | Compile API to `dist/`   |
| `npm run dev`   | frontend   | Start Next.js dev server             |
| `npm run build` | frontend   | Production build                     |

## Public API Endpoints

- `GET /api/settings/public` — site settings + contact methods (drives Navbar/Footer/Contact)
- `GET /api/services/public`, `GET /api/services/slug/:slug`
- `GET /api/projects/public`, `GET /api/projects/slug/:slug`
- `GET /api/clients/public`
- `POST /api/enquiries` — public enquiry form

## Notes

- Address is managed from **Admin → Settings** (contact methods, seo, socials, whatsapp, footer).
- Sample projects, services and clients are seeded for demonstration.
- Email/SMTP and ImageKit are env-configured; without credentials the app still works with image uploads unavailable and notifications skipped.