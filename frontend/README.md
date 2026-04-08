# Frontend App

This folder contains the Next.js frontend for the portfolio platform.

For the full project overview, setup steps, environment variables, deployment flow, and backend notes, read the root [README](../README.md).

## Local Development

From this folder:

```bash
npm install
npm run dev
```

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

The frontend runs on `http://localhost:3001`.

## Production

- Deploy this folder to Vercel.
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL.
- Redeploy after changing environment variables.
