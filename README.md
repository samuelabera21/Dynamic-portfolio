# Dynamic Portfolio Platform

A full-stack portfolio system with a public website, admin dashboard, blog, contact form, newsletter, and feature flags.

## Live Deployment

- Frontend: https://dynamic-portfolio-livid.vercel.app
- Backend API: https://dynamic-portfolio-c7s2.onrender.com

## What This Project Does

- Public portfolio pages for home, about, resume, projects, blog, contact, and unsubscribe.
- Admin dashboard for managing profile, projects, posts, skills, messages, and feature flags.
- Blog publishing with public visibility controlled by a blog feature flag.
- Contact messages stored in the database and forwarded by email.
- Newsletter subscribe, unsubscribe, and broadcast support.

## Tech Stack

### Frontend

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Markdown
- jsPDF for resume generation

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL on Neon
- JWT authentication
- Helmet and CORS
- Brevo email API

### Deployment

- Vercel for the frontend
- Render for the backend

## Project Flow

### Public Site Flow

1. A visitor opens the Vercel frontend.
2. The frontend requests data from `/api/*` endpoints.
3. Next.js rewrites `/api/*` to the deployed backend URL.
4. The backend reads from Neon through Prisma and returns JSON.
5. The homepage combines profile, projects, skills, and feature flags.
6. The blog page checks the `showBlog` flag before showing posts.
7. The contact form saves messages and sends email notifications through Brevo.

### Admin Flow

1. The admin logs in from `/admin/login`.
2. The backend verifies the password against the `User` table.
3. A JWT token is returned and stored in browser local storage.
4. Protected admin requests send `Authorization: Bearer <token>`.
5. The admin dashboard can manage posts, projects, profile, skills, messages, and settings.

### Email Flow

1. A visitor submits a contact message.
2. The backend stores the message in PostgreSQL.
3. The backend sends an admin notification email through Brevo.
4. The backend sends an auto-reply to the sender when the email is valid.
5. Newsletter subscribers are stored in the settings table and receive broadcast emails.

## Database Model

| Table | Purpose |
| --- | --- |
| `User` | Admin login account |
| `Profile` | Main profile content for the portfolio |
| `SocialLink` | Links connected to the profile |
| `Project` | Portfolio projects and featured work |
| `Post` | Blog posts and drafts |
| `Skill` | Technical skill list grouped by category |
| `Message` | Contact form submissions |
| `Setting` | Feature flags and newsletter subscriber storage |

## API Overview

- `GET /home` returns homepage data.
- `POST /auth/login` returns an admin JWT token.
- `GET /projects` and `GET /posts` serve public content.
- `POST`, `PUT`, and `DELETE` routes manage content from the admin dashboard.
- `GET /settings` returns feature flags for the public site.
- `PUT /settings` updates feature flags from the admin dashboard.
- `POST /settings/newsletter/subscribe` and related routes manage newsletter subscribers.

## Environment Variables

### Backend

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon PostgreSQL pooled connection string (recommended) |
| `JWT_SECRET` | Yes | Signs admin login tokens |
| `BREVO_API_KEY` | Yes | Sends contact and newsletter emails |
| `EMAIL_USER` | Yes | Admin email address that receives contact notifications |
| `SMTP_FROM` | No | Sender name and email shown in Brevo messages |
| `FRONTEND_URL` | Yes in production | Used for CORS and unsubscribe links |
| `NEXT_PUBLIC_FRONTEND_URL` | No | Optional extra allowed frontend origin |
| `NEWSLETTER_SECRET` | Recommended | Signs unsubscribe tokens |
| `PORT` | No | Render sets this automatically |

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend base URL used by the frontend rewrite |

## Local Setup

### 1. Clone and install the backend

From the project root:

```bash
npm install
```

### 2. Create the backend `.env`

Create a `.env` file in the project root:

```env
DATABASE_URL="your_neon_postgres_connection_string"
JWT_SECRET="replace_with_a_long_random_secret"
BREVO_API_KEY="your_brevo_api_key"
EMAIL_USER="your_admin_email@example.com"
SMTP_FROM="Samuel Abera <your_sender_email@example.com>"
FRONTEND_URL="http://localhost:3001"
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3001"
NEWSLETTER_SECRET="replace_with_another_random_secret"
```

### 3. Run Prisma migrations

Apply the database schema to Neon or your local PostgreSQL instance:

```bash
npx prisma migrate dev
```

If you only need Prisma client generation, the root `postinstall` and build scripts already run `prisma generate`.

### 4. Start the backend

```bash
npm run dev
```

The backend runs on `http://localhost:3000` by default.

### 5. Install and configure the frontend

Open the `frontend` folder:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend runs on `http://localhost:3001`.

## Production Deployment

### Backend on Render

Use the project root as the service folder.

- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Set all backend environment variables from the table above.
- Set `FRONTEND_URL` to the deployed Vercel URL.

### Frontend on Vercel

Deploy the `frontend` folder as the Next.js app.

- Set `NEXT_PUBLIC_API_BASE_URL` to the Render backend URL.
- Redeploy after changing environment variables.
- The frontend uses a rewrite so `/api/*` is proxied to the backend.

### CORS

Make sure the backend allows the frontend origin through:

- `FRONTEND_URL`
- `NEXT_PUBLIC_FRONTEND_URL`

## Admin Account Setup

There is no public registration route.

1. Create at least one row in the `User` table.
2. Store the password as a bcrypt hash.
3. Use `hash.ts` as a quick helper to generate a hash if needed.
4. Sign in at `/admin/login`.

## Important Behavior

- Publishing a blog post does not automatically make the blog section visible.
- Public blog visibility is controlled by the `showBlog` feature flag in the admin settings page.
- If `showBlog` is off, the navbar hides the Blog link and the blog page shows the disabled state.

## Folder Structure

- `frontend/` Next.js frontend application
- `src/` Express backend source
- `prisma/` Prisma schema and migrations
- `generated/` Prisma client output
- `docs/` feature-level notes

## Troubleshooting

- If the homepage shows an error, check `NEXT_PUBLIC_API_BASE_URL` and redeploy the frontend after changing it.
- If admin login fails, verify that the `User` table has a valid bcrypt password hash.
- If email does not send, confirm `BREVO_API_KEY`, `EMAIL_USER`, and `SMTP_FROM` are set correctly.
- If unsubscribe links are wrong, verify `FRONTEND_URL`.
- If the blog is hidden, check the `showBlog` feature flag in admin settings.
- Check backend health with `GET /health` (app only) and `GET /health?db=1` (app + database).
- If `neonPoolerDetected` is `false`, update `DATABASE_URL` to Neon pooler connection details.

## License

Private project.
