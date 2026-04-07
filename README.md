# Dynamic Portfolio Platform

A full-stack portfolio platform with a public website, admin dashboard, content management APIs, and email/newsletter automation.

## Live Deployment

- Frontend (Vercel): https://dynamic-portfolio-livid.vercel.app/
- Backend API (Render): https://dynamic-portfolio-c7s2.onrender.com

## What This Project Includes

- Public portfolio website (home, about, projects, blog, contact, resume)
- Admin login and dashboard
- Project, post, profile, skill, message, and settings management APIs
- Contact email notification + auto-reply
- Newsletter subscribe/unsubscribe and broadcast support

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM + PostgreSQL (Neon)
- JWT authentication
- Nodemailer (Gmail SMTP)

## High-Level Architecture

- Frontend calls `/api/*` routes.
- Next.js rewrite proxies `/api/*` to the Render backend URL.
- Express serves business APIs and uses Prisma to read/write PostgreSQL.
- Protected admin endpoints require `Authorization: Bearer <jwt>`.
- Contact + newsletter flows trigger outbound email through Gmail SMTP.

## Flow: Frontend

1. User opens the Vercel site.
2. Frontend requests data from `/api/home`, `/api/projects`, `/api/posts`, etc.
3. Next.js rewrites `/api/*` to the Render backend base URL.
4. UI renders public content.
5. Admin user logs in on `/admin/login` and receives a JWT token.
6. Token is used for admin API operations (dashboard, CRUD, message moderation, settings).

## Flow: Backend

1. Request enters Express app with Helmet + CORS + JSON middleware.
2. Route handler executes domain logic.
3. For protected routes, JWT middleware validates token using `JWT_SECRET`.
4. Prisma queries PostgreSQL (Neon).
5. JSON response is returned to frontend.

Main API groups:

- `/home` public homepage data aggregation
- `/auth` admin login
- `/admin` dashboard stats (protected)
- `/projects` project CRUD
- `/posts` blog CRUD
- `/profile` profile + social links
- `/skills` skills CRUD/grouping
- `/messages` contact messages + read/delete (protected read/manage)
- `/settings` feature flags + newsletter endpoints

## Flow: Email Service

### Contact Email Flow

1. Public user submits contact form.
2. Backend saves message in database.
3. Backend sends admin notification email to `EMAIL_USER`.
4. Backend sends auto-reply to sender email (if valid).

### Newsletter Flow

1. User subscribes via `/settings/newsletter/subscribe`.
2. Email is normalized and stored in settings table (`newsletterSubscribers`).
3. When newsletter is sent, backend emails all subscribers.
4. Each email includes a signed unsubscribe link.
5. Unsubscribe endpoint verifies token and removes subscriber.

## Environment Variables

### Backend (Render / local root `.env`)

- `DATABASE_URL` PostgreSQL connection string (Neon)
- `JWT_SECRET` token signing secret
- `EMAIL_USER` Gmail address used to send mail
- `EMAIL_PASS` Gmail app password
- `FRONTEND_URL` allowed frontend origin (Vercel URL)
- `NEXT_PUBLIC_FRONTEND_URL` optional second allowed origin
- `NEWSLETTER_SECRET` secret for unsubscribe token signing (recommended)
- `PORT` optional (Render provides it automatically)

### Frontend (Vercel)

- `NEXT_PUBLIC_API_BASE_URL=https://dynamic-portfolio-c7s2.onrender.com`

## Local Development

### 1) Backend

From project root:

```bash
npm install
npm run build
npm run dev
```

Backend default local URL: `http://localhost:3000`

### 2) Frontend

From `frontend` folder:

```bash
npm install
npm run dev
```

Frontend local URL: `http://localhost:3001`

Set frontend env for local dev:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Production Deployment Notes

### Backend (Render)

- Root Directory: leave empty
- Build Command: `npm install --include=dev && npm run build`
- Start Command: `npm start`

### Frontend (Vercel)

- Set env: `NEXT_PUBLIC_API_BASE_URL=https://dynamic-portfolio-c7s2.onrender.com`
- Redeploy after env changes

### CORS

Set backend env:

- `FRONTEND_URL=https://dynamic-portfolio-livid.vercel.app`
- `NEXT_PUBLIC_FRONTEND_URL=https://dynamic-portfolio-livid.vercel.app`

## Admin Access Notes

- Admin login requires a user row in the `User` table.
- If login says `Invalid credentials`, verify an admin user exists in the production database.
- Passwords are bcrypt-hashed in storage.

## Common Troubleshooting

- `Homepage Data Unavailable` usually means incorrect `NEXT_PUBLIC_API_BASE_URL` or missing frontend redeploy.
- `prisma: not found` on Render means Prisma CLI was not available at build time.
- `Invalid credentials` means no matching user or wrong password in database.
- Slow first request on free Render is expected due to instance spin-down.

## Project Structure (Top Level)

- `frontend/` Next.js app
- `src/` Express app source
- `prisma/` schema + migrations
- `generated/` generated Prisma outputs
- `docs/` feature-level docs

## License

Private project.
