# Blog Feature

This feature includes public blog pages and protected admin blog management.

## Public Experience

### UI Routes

- Blog list: `/blog`
- Blog details: `/blog/:id`

### Public API Endpoints Used

- `GET /posts`
- `GET /posts/:id`

### Public Behavior

1. Blog list shows published posts only.
2. User can search posts by title/content (frontend filtering).
3. Posts are sorted newest first.
4. User opens full post details from `Read More`.
5. If post is not found or not published, details page shows 404-style state.

## Admin Experience

### UI Routes

- Admin blog dashboard: `/admin/blog`
- Create post: `/admin/blog/create`
- Edit post: `/admin/blog/edit/:id`

### Admin API Endpoints Used

- `GET /posts/admin/all`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

### Admin Behavior

1. Admin signs in at `/admin/login`.
2. JWT token is stored in localStorage.
3. Admin dashboard shows all posts (published + draft).
4. Admin can:
- Create post
- Edit post
- Save draft
- Publish/unpublish
- Delete with confirmation

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
3. Open public blog pages
- `http://localhost:3001/blog`
- `http://localhost:3001/blog/<post-id>`
4. Open admin blog pages
- `http://localhost:3001/admin/blog`
- `http://localhost:3001/admin/blog/create`

## Files (Frontend)

- `frontend/src/app/blog/page.tsx`
- `frontend/src/app/blog/[id]/page.tsx`
- `frontend/src/app/admin/blog/page.tsx`
- `frontend/src/app/admin/blog/create/page.tsx`
- `frontend/src/app/admin/blog/edit/[id]/page.tsx`
- `frontend/src/components/PostEditorForm.tsx`
- `frontend/src/types/post.ts`
- `frontend/src/lib/api.ts` (post methods)
