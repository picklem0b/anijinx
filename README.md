# AniJinx

A Netflix-style streaming platform **for anime only** — one Turbo monorepo, three
deployables, one shared contract.

| Workspace | What it is | Stack |
|---|---|---|
| `web/` | The entire website (app screens **and** marketing pages) | Vite + React 19 + React Router + Tailwind v4 + framer-motion |
| `mobile/` | Native client (primary) | Expo SDK 57 + expo-router + React Native 0.86 + Reanimated + expo-video |
| `apps/` | Production backend/API | Hono + Drizzle ORM + Postgres |
| `packages/shared` | Types, Zod schemas, formatters, AniList client | TypeScript |
| `packages/ui` | Web-only shadcn components | Tailwind |

Products decisions live in [`docs/`](./docs): the PRD, the stack decisions, and the
implementation plan.

## Getting started

```bash
npm install
```

### Website

```bash
npm run dev --workspace web          # http://localhost:5173
```

Routes: `/` `/discover` `/browse` `/anime/:id` `/watch/:id/:ep` `/reels` `/library`
`/profile` `/settings`, plus marketing at `/landing` `/about` `/pricing` `/help`
`/contact` `/legal` `/sign-in` `/sign-up`.

### Mobile

```bash
npm run start --workspace mobile     # expo start
```

Data comes straight from AniList in this phase, so no server is required to run the app.

**Termux / Android note.** `expo start` works, but a production export fails with
`hermesc exited with signal: SIGILL` — the Hermes compiler Expo ships is an **x86_64**
binary and Android devices are aarch64. Use the script that skips bytecode generation:

```bash
npm run export:android --workspace mobile
```

Real builds should run on x86_64 CI.

### API

```bash
cd apps
cp .env.example .env
docker compose up -d                 # local Postgres
npm run db:push                      # apply the schema
npm run sync                         # pull AniList media into Postgres
npm run dev                          # http://localhost:8787
```

`GET /v1/health` reports liveness (503 with `db: down` if Postgres is unreachable).
Everything under `/v1/library|progress|ratings|comments` expects an `x-device-id` header —
anonymous identity, **no auth**.

Swap `DATABASE_URL` for a Supabase connection string and nothing else changes.

## Verify

```bash
npm run typecheck                    # all workspaces
npm run build                        # web build
```

## Ground rules

- **AniList owns metadata.** We own episodes and video, and only play what we own or license.
  No public API streams anime episodes — see [`docs/anime-data-sources.md`](./docs/anime-data-sources.md)
  for every provider in the public-apis Anime category, tested live.
- **One source of truth.** Types and Zod schemas live in `packages/shared`; the API parses
  with them and both clients import from them.
- **Motion respects people.** Every animation degrades to an instant change under
  Reduce Motion / `prefers-reduced-motion`.
- **No backend until it earns its place.** The UI runs fully against AniList + on-device state.
