# AdGenie Frontend — Campaign Studio V2

Next.js App Router frontend.

## Campaign Studio

`/dashboard/generator` is now a step-by-step campaign wizard instead of one long form:

1. Choose the saved Brand Brain/project.
2. Define the campaign goal.
3. Select the objective.
4. Add the offer/core message.
5. Set CTA + Facebook/Instagram channels.
6. Add creative direction/constraints and language.

The wizard uses a floating 3D planet assistant. During generation the planet switches into an animated generation state with orbital rings, scanning waves, moving texture/noise and live pipeline phases. Results are presented as three professional creative-route cards. Selecting a route opens a dedicated final Ad Editor where the user can edit and save the copy or regenerate that route's image.

## Local setup

```powershell
cd frontend
npm install
npm run dev
```

Create `.env.local` if the backend is not on the default URL:

```env
BACKEND_URL=http://localhost:8000
```

The included `next.config.js` proxies `/api/*` to FastAPI `/api/v1/*` and `/media/*` to generated backend media.
