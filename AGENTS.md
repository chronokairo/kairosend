# AGENTS.md — guidance for AI agents working on Kairosend

## What this is
Kairosend is an open-source **desktop client for Resend** (Next.js + Electron,
Windows & Linux). The UI follows the "Aureate Obsidian" design system defined
in `aureate_obsidian/DESIGN.md` and prototyped in the `*_aureate/code.html`
mockups. **Do not diverge from that design.**

## Stack
- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS 3 (tokens mirrored from DESIGN.md in `tailwind.config.ts`)
- Electron 31 + electron-builder (Win NSIS/portable, Linux AppImage/deb/tgz)
- No backend DB: the app calls the Resend REST API through Next.js API routes
  (`src/app/api/...`). Each user supplies their **own** Resend API key in
  Settings (stored in `localStorage`), sent to same-origin routes via the
  `x-resend-key` header.

## Resend API endpoints implemented (https://resend.com/docs/api-reference)
- `GET  /api/receiving`      → Resend `GET /emails/receiving` (Inbox list)
- `GET  /api/receiving/[id]` → Resend `GET /emails/receiving/:id`
- `GET  /api/emails`         → Resend `GET /emails` (Sent list)
- `GET  /api/emails/[id]`    → Resend `GET /emails/:id`
- `POST /api/emails/send`    → Resend `POST /emails`
- `PATCH /api/emails/[id]/update` → Resend `PATCH /emails/:id` (reschedule)
- `POST  /api/emails/[id]/cancel` → Resend `POST /emails/:id/cancel`

The typed client lives in `src/lib/resend/client.ts` and mirrors the official
SDK surface (`resend.emails.send/get/list/update/cancel`, `resend.receiving.*`),
so it can be swapped for the `resend` npm package with minimal churn.

## Commands (run these before declaring done)
```bash
npm install              # install deps
npm run lint             # ESLint (next/core-web-vitals)
npm run typecheck        # tsc --noEmit
npm run build            # production Next.js build
npm run dev              # Next dev + Electron (waits on :3000)
npm run dist:linux       # build + Linux installers (AppImage/deb/tgz)
npm run dist:win         # build + Windows installers (NSIS/portable)
```
Node is **not** required to be installed on the dev machine to edit source,
but `npm run lint` and `npm run typecheck` must pass before committing.

## Design rules (hard constraints)
- Colors, spacing, radii and type scale come from `tailwind.config.ts`, which
  is a 1:1 mirror of the mockups. Use the token classes
  (`bg-surface`, `text-primary`, `border-outline-variant`, `p-container-padding`,
  `rounded-xl`, `font-display`, `text-body-lg`, …) — **not** raw hex values.
- Layout is the three-pane fixed-fluid model: Sidebar `w-sidebar-width` (280px),
  list `w-list-width` (380px), fluid reading pane.
- Primary accent (Burnt Gold `#f6be39` / container `#d4a017`) is used
  sparingly: CTAs, active states, focus borders only.
- Icons use Material Symbols Outlined (loaded in `layout.tsx`).

## Conventions
- Keep components in `src/components/<domain>/`, pages in `src/app/`.
- Client components that read the API key must be under `<SettingsProvider>`
  (already set up at the root layout).
- API routes use `src/app/api/_lib.ts` (`clientFromRequest` + `errorResponse`).
- No comments in code unless asked.
