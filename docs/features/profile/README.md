# Profile Feature

This feature is the central personal branding data source for the portfolio.

## Public Experience

### UI Routes

- Home page: `/`
- About page: `/about`

### Public API Endpoint Used

- `GET /profile`

### Public Behavior

1. Home hero displays dynamic profile data:
- Name
- Role/title
- Short bio
- Avatar image
- Available-for-hire badge when `available = true`
- CTA links to Projects and Contact

2. About page displays:
- Full bio
- Profile image
- Location (if available)
- Resume download link (`resumeUrl`)
- Dynamic social links from API

3. Empty-state handling:
- No avatar fallback UI
- No social links message
- Resume-not-available message

## Admin Experience

### UI Route

- Admin profile page: `/admin/profile`

### Admin API Endpoints Used

- `GET /profile`
- `PUT /profile`

### Admin Behavior

1. Admin logs in at `/admin/login` and receives JWT.
2. JWT is stored in localStorage.
3. Admin profile form is pre-filled from API.
4. Admin can update:
- Name
- Role
- Bio
- Avatar URL
- Resume URL
- Location
- Available-for-hire toggle

5. Admin can manage social links dynamically:
- Add social link
- Edit platform and URL
- Remove social link

6. Save sends `PUT /profile` with:
- `Authorization: Bearer <token>` header
- full profile payload including social links array

## Backend System Behavior

- Profile is treated as a single resource.
- If profile does not exist, backend auto-creates a default profile on `GET /profile`.
- Public pages consume API data, avoiding hardcoded personal details.

## How To Run This Feature

1. Start backend API from project root:
```bash
npm run dev
```

2. Start frontend UI:
```bash
cd frontend
npm run dev
```

3. Open public routes:
- `http://localhost:3001/`
- `http://localhost:3001/about`

4. Open admin route:
- `http://localhost:3001/admin/profile`

## Files (Frontend)

- `frontend/src/app/page.tsx`
- `frontend/src/app/about/page.tsx`
- `frontend/src/app/admin/profile/page.tsx`
- `frontend/src/types/profile.ts`
- `frontend/src/lib/api.ts` (profile methods)
- `frontend/src/components/Navbar.tsx`
- `frontend/src/components/Sidebar.tsx`

## Files (Backend)

- `src/routes/profile.routes.ts`
- `src/app.ts` (profile route registration)
- `prisma/schema.prisma` (`Profile` and `SocialLink` models)
