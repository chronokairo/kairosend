# Kairosend

> An open-source **desktop client for [Resend](https://resend.com)** — built with
> Next.js + Electron for **Windows & Linux**, in the **Aureate Obsidian** design
> language.

Kairosend is a local-first executive mail client. Each user supplies **their
own** Resend API key in Settings; the key never leaves the device (it's stored
in `localStorage` and only sent to the bundled same-origin Next.js API routes,
which proxy the Resend REST API).

## Features
- **Inbox** — received inbound email (`GET /emails/receiving`)
- **Sent** — everything you've sent, with delivery status (`GET /emails`)
- **Compose** — send & **schedule** emails (`POST /emails`)
- **Drafts** — reschedule / cancel scheduled sends (`PATCH` / `POST …/cancel`)
- Full **Aureate Obsidian** UI (dark surfaces, burnt-gold accents, three-pane
  fixed-fluid layout) — see [`aureate_obsidian/DESIGN.md`](./aureate_obsidian/DESIGN.md).

## Getting started

```bash
npm install
npm run dev      # Next dev server on :3000 + Electron window
```

Then open **Settings** (sidebar) and paste your Resend API key from
<https://resend.com/api-keys>.

### Commands
| Command | Description |
| --- | --- |
| `npm run dev` | Next dev + Electron (waits for `:3000`) |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production Next.js build |
| `npm run dist:win` | Windows installers (NSIS + portable) |
| `npm run dist:linux` | Linux installers (AppImage + deb + tar.gz) |

## Architecture

```
electron/        Electron main (spawns Next in prod) + preload
src/app/
  api/           Same-origin proxy routes → Resend (reads x-resend-key header)
    _lib.ts      clientFromRequest + errorResponse
    emails/      list / get / send / [id]/update / [id]/cancel
    receiving/   list / get  (Inbox)
  inbox/         received list + preview  (layout + [id])
  sent/          sent list + preview
  compose/       Send Email (schedule + cc/bcc)
  drafts/        scheduled sends (reschedule / cancel)
src/lib/
  resend/        Typed REST client (mirrors the official SDK surface)
  settings.tsx   Per-user API-key store (localStorage + provider)
  hooks.ts       useList (cursor pagination) + useGet
src/components/  layout (Sidebar/TopBar/AppShell), mail (List/Preview/Compose),
                 ui (Icon/Avatar/primitives), settings (dialog)
tailwind.config.ts   1:1 mirror of the Aureate Obsidian design tokens
```

## How the API key flows
1. User enters their key in **Settings** → stored in `localStorage`.
2. The renderer calls same-origin routes (e.g. `/api/emails`) with the
   `x-resend-key` header (see `src/lib/api.ts`).
3. The Next.js route (`src/app/api/_lib.ts`) builds a `Resend` client from that
   header (falling back to `RESEND_API_KEY` env for hosted deployments).

> **Security:** the key is only ever sent to the local, bundled Next server.
> Never expose the key in client-only `fetch` calls to `api.resend.com`.

## License
MIT © Kairosend contributors. See [`LICENSE`](./LICENSE).
