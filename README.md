# GODHAND

A bilingual (Persian-first / English) dark-fantasy web experience, built to grow into a modular AI platform.

## Stack
- Astro + TypeScript for the static frontend
- Cloudflare Worker for the future AI/API layer
- Persian RTL and English LTR localization
- No provider credentials in browser code

## Development
```bash
npm install
npm run dev
npm run check
npm run build
```

## Project layout
- `src/pages/` — routes
- `src/i18n.ts` — interface translations
- `worker/` — independent Cloudflare API Worker
- `public/` — static assets

## API Worker
See `worker/README.md`. Configure provider keys as Cloudflare Worker secrets; never commit real credentials.

## Deployment
Frontend and API are intentionally separate deployments. The rebuild branch is a safe staging area; the existing `main` branch is not modified. No production deployment or DNS changes are performed by this project setup.

## Security baseline
- Secrets stay server-side.
- API validates input, limits request size, and applies origin checks.
- Chat history is not persisted by default.
- Do not add real credentials to `.env`, source files, or Git history.
