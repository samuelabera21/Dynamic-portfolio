# Portfolio Backend + Frontend Feature Documentation

This folder documents each implemented feature separately.

## Feature READMEs

1. Projects feature: [docs/features/projects/README.md](features/projects/README.md)
2. Messages (Contact) feature: [docs/features/messages/README.md](features/messages/README.md)
3. Blog feature: [docs/features/blog/README.md](features/blog/README.md)
4. Profile feature: [docs/features/profile/README.md](features/profile/README.md)
5. Skills feature: [docs/features/skills/README.md](features/skills/README.md)

## Global Run Guide

1. Start backend API
- From project root:
```bash
npm run dev
```
- Backend base URL: `http://localhost:3000`

2. Start frontend UI
- From `frontend` folder:
```bash
npm run dev
```
- Frontend URL: `http://localhost:3001`

3. Admin authentication flow
- Open admin login route:
`http://localhost:3001/admin/login`
- Login sends request to:
`POST /auth/login`
- JWT token is saved in localStorage and used for admin-only endpoints.

## Notes

- Public routes do not require JWT.
- Admin routes require JWT in `Authorization: Bearer <token>`.
- Frontend uses `/api/*` rewrite proxy to backend `http://localhost:3000/*`.
