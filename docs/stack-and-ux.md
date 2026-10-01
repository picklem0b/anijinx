# AniJinx — Stack & UX Decisions

Status: **agreed, not yet implemented** · Scope: rearchitecture of the current web SPA

AniJinx is an anime **discovery + streaming** app. Netflix-style dark UI, a dedicated
**Discover** surface, and a premium **muted autoplay preview** on mobile. Metadata and
artwork come from AniList; **video playback is only for content you own or are licensed
to distribute.**

---

## 1. Decisions at a glance

| Layer          | Choice                                                        | Why                                                                 |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Client         | **Expo SDK 57 + expo-router + React Native 0.86 + React 19**  | Matches `expense-tracker`; iOS feel; one codebase for iOS/Android/web |
| Language       | TypeScript (strict)                                           | Readable, catch errors early                                        |
| Server state   | **TanStack Query**                                            | Replaces the hand-rolled `useFetch`; caching/retries/refetch        |
| Local state    | **Zustand**                                                   | Already used; small and transparent                                 |
| Video          | **expo-video (HLS)** + **Mux**                                | Native AVPlayer, PiP, signed playback, auto thumbnails              |
| Backend        | **Hono + Drizzle ORM + Postgres**                             | Minimal, readable, you own every line                               |
| Validation     | **Zod** (shared between client and API)                       | One schema, two runtimes                                            |
| Database       | **Local Postgres (Docker) → Supabase Postgres**               | Local-first now, managed later                                      |
| Auth           | **None** (UI-first) → Supabase Auth only if accounts are needed | Don't build auth until a feature actually requires it             |
| Monorepo       | **Turbo**: `apps/mobile`, `apps/api`, `apps/web`, `packages/shared` | Existing turbo root; web retires once mobile lands             |

---

## 1a. Build order

The backend is **not needed for the UI-first phase.** The app runs against AniList
(metadata/trailers) plus local seed/mock data stored on-device.

1. **Phase 1 — UI.** `apps/mobile` only. Navigation, Discover, Home, Detail, Player,
   Library, Reels, Settings. Data from AniList + mock fixtures. No server, no auth.
2. **Phase 2 — API.** Add `apps/api` (Hono + Drizzle + Postgres) once state must be
   shared or durable (library, progress, comments).
3. **Phase 3 — Playback + accounts.** Mux-hosted video for owned/licensed titles;
   add auth only when a feature demands it (never "just in case").

## 2. Frontend — Expo / React Native

Follow the `expense-tracker` project's conventions so the code stays easy to read:

- Routes in `src/app/` (expo-router file-based routing); non-route code outside `src/app/`.
- Small hand-rolled kit: `Typo`, `Button`, `Input`, `ScreenWrapper`, `Loading`.
- `src/constants/theme.ts` for `colors` / `spacing` / `radius`.
- `src/utils/styling.ts` for `scale()` / `verticalScale()`.
- `@/*` path alias to `src/*`.
- `npx expo install <pkg>` for every dependency; `npx tsc --noEmit` + `npx expo lint` before done.
- Expo ships breaking changes each SDK — check the versioned docs, don't answer from memory.

**iOS feel / polish:** `expo-glass-effect`, `expo-symbols`, `expo-image`, native tabs,
safe-area insets, `react-native-reanimated` transitions, haptics.

**Design language:** dark Netflix structure (full-bleed hero, dense rows with peek,
top-10, continue-watching) with AniJinx's **violet accent** (`#7C5CFF`) kept for brand
continuity rather than Netflix red.

### Mobile preview

A card that gains focus autoplays its trailer **muted and looping** after a short delay,
fading in over the artwork; it stops when it leaves the viewport. Tap → detail;
double-tap → like. Full trailer/first clip plays in the title detail hero.

---

## 3. Backend — Hono + Drizzle + Postgres

**Language: TypeScript**, runtime **Node.js** (Hono is portable to Bun/Deno/Cloudflare).
One language across client and server means Zod schemas and types are shared via
`packages/shared`. Local-first, fully readable, no magic:

```
apps/
  src/
    index.ts            # Hono app + route mounting
    env.ts              # zod-validated process.env
    db/
      client.ts         # drizzle(postgres(DATABASE_URL))
      schema.ts         # tables
      queries/          # anime.ts, home.ts — thin route handlers
    routes/             # anime, home, genres, health, library, progress, ratings, comments
    middleware/         # error envelope, anonymous device identity
    sync/anilist.ts     # AniList → Postgres upsert + curated rails
  drizzle/              # generated migrations
  docker-compose.yml    # local Postgres
```

- **Hono** for routing (tiny, typed, `zValidator` from `@hono/zod-validator`).
- **Drizzle** for schema + queries + `drizzle-kit` migrations — reads like SQL, fully typed.
- **Postgres** via the `postgres` driver, run locally with Docker Compose.
- Core tables: `users`, `titles` (cached AniList media), `episodes`, `videos`
  (Mux playback ids), `watch_progress`, `likes`, `watchlist`, `reminders`, `ratings`,
  `comments`.

Why not SDK-first Supabase: keeping the data layer plain Postgres + Drizzle means the
Supabase migration is a **connection-string swap**, not a rewrite.

---

## 4. Video pipeline — Mux

Upload → Mux asset with **signed** playback → HLS streamed by `expo-video`. Mux handles
transcoding, adaptive bitrate, thumbnails/storyboards, and secure playback URLs.

- Env: `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`.
- Swap-in alternative if you want zero managed services: `ffmpeg` → HLS segments on
  Cloudflare R2 / S3 with signed URLs served by the Hono API.

> Only upload content you own or are licensed to distribute.

---

## 5. Migration path to Supabase

1. Point `DATABASE_URL` at the Supabase Postgres connection string — Drizzle is unchanged.
2. Add `@supabase/supabase-js` for Auth; map users to `users`.
3. Move artwork/avatars to Supabase Storage; keep video on Mux.
4. Optionally use Realtime for comments/activity.

---

## 6. Target monorepo layout

```
anijinx/
  web/      # Vite SPA — the entire website (app screens + marketing pages)
  mobile/   # Expo native client (primary)
  apps/     # production backend/API (Hono + Drizzle + Postgres)
  packages/ # shared (types, Zod schemas, AniList client) + ui
```

---

## 7. UX surfaces

- **Home** — hero + rows (Trending, Popular, Continue watching, Top 10, Coming soon).
- **Discover** — personalized rails ("Because you liked …"), genre grid, seasonal picks,
  airing calendar, mood collections.
- **Browse / Search** — filters (genre, year, season, format, status, sort).
- **Title detail** — hero preview, episodes, ratings, comments, "More like this".
- **Player** — progress save, next-episode, official-link fallback.
- **Library** — watchlist / liked / reminders / rated.
- **Reels** — TikTok-style vertical trailer feed (already prototyped on web).
- **Profile / Settings** — appearance, language, notifications.

---

## 8. Notes & risks

- The Termux Rolldown failure earlier is a Vite 8 / android-arm64 issue; moot once the
  web target retires. Pin Vite 7 if the web app is kept.
- Stale `sora` naming has been renamed to `anijinx` (store key, root class, logo).
