# AdGenie Frontend — Next.js App Router

This is the production frontend for AdGenie. The old Vite/React-Router tree has been removed so Next.js has a single routing system and can build cleanly for production.

## Main routes

- `/` landing page
- `/login` and `/register`
- `/dashboard`
- `/dashboard/projects`
- `/dashboard/generator`
- `/dashboard/drafts`
- `/dashboard/calendar`
- `/dashboard/ads`
- `/dashboard/integrations`
- `/dashboard/billing`
- `/hq` and `/hq/login`

## Environment variables

For local development create `.env.local` (or use the included local `.env`):

```env
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:8000
```

For production keep `NEXT_PUBLIC_API_URL=/api` and set `BACKEND_URL` to the public backend URL, for example:

```env
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=https://your-adgenie-backend.onrender.com
```

`/api/*` is proxied at runtime to `BACKEND_URL/api/v1/*` and `/media/*` is proxied to `BACKEND_URL/media/*`. This avoids hard-coding the backend during `next build` and keeps the browser on the frontend origin.

## Local commands

```powershell
npm install
npm run dev
```

Production check:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
npm run start
```

## Docker / Render

The Docker image now binds to `0.0.0.0` and uses Render's `PORT` automatically. Set `BACKEND_URL` in the frontend service Environment settings; it is read at runtime.
