# Projects Feature

This feature includes public project browsing and admin project management (CRUD).

## Public Experience

### UI Routes

- Projects list: `/projects`
- Project details: `/projects/:id`

### Public API Endpoints Used

- `GET /projects`
- `GET /projects/:id`

### Public Behavior

1. Projects page fetches published projects.
2. User can search and filter by tech.
3. User opens details page to read full project data.

## Admin Experience

### UI Routes

- Admin list: `/admin/projects`
- Create project: `/admin/projects/new`
- Edit project: `/admin/projects/:id`

### Admin API Endpoints Used

- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

### Admin Behavior

1. Admin signs in from `/admin/login`.
2. JWT token is stored in localStorage.
3. Token is sent in `Authorization: Bearer <token>`.
4. Admin can create, update, toggle feature/publish flags, and delete projects.

## How To Run This Feature

1. Start backend
```bash
npm run dev
```
2. Start frontend
```bash
cd frontend
npm run dev
```
3. Open public page
- `http://localhost:3001/projects`
4. Open admin page
- `http://localhost:3001/admin/projects`

## Files (Frontend)

- `frontend/src/app/projects/page.tsx`
- `frontend/src/app/projects/[id]/page.tsx`
- `frontend/src/app/admin/projects/page.tsx`
- `frontend/src/app/admin/projects/new/page.tsx`
- `frontend/src/app/admin/projects/[id]/page.tsx`
- `frontend/src/components/ProjectCard.tsx`
- `frontend/src/components/ProjectForm.tsx`
