# Skills Feature

This feature manages categorized technical skills used across public pages and the admin panel.

## Public Experience

### UI Routes

- Home page: `/`
- About page: `/about`

### Public API Endpoint Used

- `GET /skills/grouped`

### Public Behavior

1. Home page displays a grouped skills section with categories:
- frontend
- backend
- tools

2. About page displays a grouped skills section with the same categories.

3. Skills are rendered as badges per category.

4. Empty-category handling:
- Categories without skills show a small "No skills listed" message.

## Admin Experience

### UI Route

- Admin skills page: `/admin/skills`

### Admin API Endpoints Used

- `GET /skills`
- `POST /skills`
- `PUT /skills/:id`
- `DELETE /skills/:id`

### Admin Behavior

1. Admin logs in at `/admin/login` and receives JWT.
2. JWT is stored in localStorage.
3. Skills page loads all skills for management.
4. Admin can create a new skill with:
- skill name
- category (`frontend`, `backend`, `tools`)

5. Admin can edit existing skills.
6. Admin can delete skills with confirmation modal.
7. Admin receives loading, success, and error feedback states.

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
- `http://localhost:3001/admin/skills`

## Files (Frontend)

- `frontend/src/app/admin/skills/page.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/app/about/page.tsx`
- `frontend/src/types/skill.ts`
- `frontend/src/lib/api.ts` (skills methods)
- `frontend/src/components/Sidebar.tsx`

## Files (Backend)

- `src/routes/skill.routes.ts`
- `src/app.ts` (skills route registration)
- `prisma/schema.prisma` (`Skill` model)
