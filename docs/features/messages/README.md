# Messages (Contact) Feature

This feature includes a public contact form and an admin message management dashboard.

## Public Experience

### UI Route

- Contact page: `/contact`

### Public API Endpoint Used

- `POST /messages`

### Public Behavior

1. Visitor fills `name`, `email`, and `message`.
2. Form submits message to backend.
3. UI shows loading, success, or error state.

## Admin Experience

### UI Route

- Admin messages dashboard: `/admin/messages`

### Admin API Endpoints Used

- `GET /messages`
- `PUT /messages/:id`
- `DELETE /messages/:id`

### Admin Behavior

1. Admin logs in from `/admin/login`.
2. JWT token is stored in localStorage.
3. Dashboard fetches all messages with auth header.
4. Admin can:
- Filter by `All` or `Unread`
- Mark message as read
- Delete message with confirmation

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
3. Open public contact page
- `http://localhost:3001/contact`
4. Open admin dashboard
- `http://localhost:3001/admin/messages`

## Files (Frontend)

- `frontend/src/app/contact/page.tsx`
- `frontend/src/app/admin/messages/page.tsx`
- `frontend/src/lib/api.ts` (message methods)
- `frontend/src/types/message.ts`
- `frontend/src/components/Modal.tsx`
