# AniJinx — Implementation Plan

A Netflix-style streaming app for **anime only**. React Native client, Hono API,
Postgres database. UI-first: no auth until a feature actually needs it.

Stack decisions live in [`stack-and-ux.md`](./stack-and-ux.md). This doc is **how** we build it.

---

## 0. Ground rules (learned from the existing code)

- **AniList owns metadata**, we own episodes, video and user state. The current web app
  already pulls titles/genres/trailers from AniList — reuse that logic.
- **RN has no `<iframe>`.** The web app previews via a YouTube trailer embed; on native
  that must become `react-native-webview` (phase 1) or a Mux-hosted clip (phase 3).
- **Expo auto-configures Metro for monorepos since SDK 52.** Do *not* hand-write
  `watchFolders` / `resolver.nodeModulesPath` — it now breaks things.
- **Expo docs drift every SDK.** Read `https://docs.expo.dev/versions/v<major>.0.0/`
  before writing `expo-*` code. `npx expo install` for every package.
- Only ever play content we **own or license**.

---

## 1. Architecture

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  apps/mobile (Expo RN)  │  HTTPS │  apps/api (Hono, TS)     │
│  expo-router, Query     │ ─────► │  zod-validated routes    │
│  expo-video, Zustand    │        │        │                 │
└───────────┬─────────────┘        │        ▼                 │
            │                      │  Drizzle ORM             │
            │ AniList (phase 1,    │        │                 │
            └─ direct) ──────────► └────────┼─────────────────┘
                                            ▼
                                     Postgres (Docker → Supabase)
                                     + Mux (video) (phase 3)
```

Phase 1 the client talks to **AniList directly** so the UI is buildable with no server.
Phase 2 it flips to `apps/api` behind one adapter file.

---

## 1a. Do we actually need a backend?

Short answer: **not for the UI, and not for a single-device app.** The backend earns its
place for two narrow reasons — protecting secrets and sharing state — not computation.

| Capability | Backend needed? | Why |
|---|---|---|
| Browsing / discovery / search | **No** | AniList is a public GraphQL API, no key |
| Title metadata, trailers, airing calendar | **No** | Same |
| Library, ratings, comments on one device | **No** | `expo-sqlite` / AsyncStorage |
| Watch progress on one device | **No** | Same |
| Cross-device library / progress | **Yes** | Needs shared durable storage |
| Comments seen by other people | **Yes** | Same |
| Gated / signed video playback | **Yes** | Mux token+secret must never ship in the app; signing is server-side |
| Adding episodes/video without an app update | **Yes** | Needs a trusted place to write |

Even video can be client-only if Mux uses **public** playback IDs — at the cost of anyone
being able to rip the stream, and shipping the `anime → episode → playbackId` map as a
bundled JSON manifest. Fine for personal use; wrong for a paid/gated product.

So M0–M5 need **no backend at all**. It appears only when you want cross-device state or
signed playback (M6/M8) — and if this stays single-device, that can be pushed back
indefinitely or dropped. `apps/api` is therefore **optional until it isn't**.

## 2. Repo layout

**As built:**

```
anijinx/
  web/                 # Vite SPA — the entire website (app screens + marketing)
    src/
      pages/           # Home, Discover, Browse, Detail, Watch, Reels, Library, Profile
      pages/marketing/ # Landing, Pricing, About, Help, Contact, Legal, Sign in/Up, 404
      components/anime/     # Navbar, Layout, Hero, Shelf, AnimeCard, …
      components/marketing/ # MarketingLayout, Reveal/Stagger/Section
      lib/             # re-exports @workspace/shared + the zustand store
  mobile/              # Expo native client (primary)
    src/
      app/             # expo-router routes ONLY
      components/      # Typo, Button, AnimeCard, Shelf, Hero, PreviewVideo, Header, …
      constants/theme.ts
      hooks/           # React Query hooks over lib/api.ts
      lib/             # api adapter, queryClient, zustand store
      utils/           # styling (scale/verticalScale), haptics, motion
  apps/                # production API — Hono + Drizzle + Postgres
    src/{index.ts,env.ts,db,routes,middleware,lib,sync}
    drizzle/           # generated migrations
    docker-compose.yml # local Postgres
  packages/
    shared/            # types, zod schemas, AniList client, formatters
    ui/                # web-only shadcn components
  docs/
```

`packages/shared` is the contract: Zod schemas → `z.infer` types → reused by both the API
(validation) and the client (parsing). One source of truth.

---

## 3. Data model (Postgres / Drizzle)

AniList id (`Int`) is the natural key for titles and is already used in client URLs.

**Content**

| Table | Key columns | Notes |
|---|---|---|
| `anime` | `id int PK` (= AniList id), `romaji`, `english`, `synopsis`, `cover_url`, `cover_color`, `banner_url`, `format`, `status`, `episodes_count`, `duration`, `season`, `season_year`, `score`, `popularity`, `trailer_id`, `trailer_site`, `next_episode`, `next_airing_at`, `studio`, `raw jsonb`, `synced_at` | Cached AniList mirror |
| `genres` | `id serial PK`, `name text unique` | Normalised |
| `anime_genres` | `anime_id FK`, `genre_id FK` | `PK(anime_id, genre_id)` |
| `episodes` | `id serial PK`, `anime_id FK`, `number int`, `title`, `synopsis`, `thumbnail_url`, `duration_seconds`, `air_date`, `video_asset_id FK null` | **We** define these |
| `video_assets` | `id serial PK`, `provider` (`mux`\|`hls`\|`file`), `playback_id`, `status`, `duration_seconds`, `aspect_ratio` | Mux/self-hosted |
| `rows` / `row_items` | `rows(key, title, subtitle, kind, position)`, `row_items(row_id, anime_id, position)` | Curated Netflix-style rails |

**Device state (phase 2, anonymous — no auth)**

| Table | Key columns |
|---|---|
| `devices` | `id uuid PK`, `created_at`, `last_seen_at` |
| `library_entries` | `device_id`, `anime_id`, `list` (`watchlist`\|`liked`\|`reminders`), `created_at` — `PK(device_id, anime_id, list)` |
| `ratings` | `device_id`, `anime_id`, `value smallint 1..5` — `PK(device_id, anime_id)` |
| `watch_progress` | `device_id`, `episode_id`, `position_seconds`, `duration_seconds`, `completed bool`, `updated_at` — `PK(device_id, episode_id)` |
| `comments` | `id serial PK`, `device_id`, `anime_id`, `episode_number int null`, `body text`, `created_at` |

**Phase 3** adds `users` and an `owner_id` on the state tables; anonymous rows migrate.

Indexes: `anime(status)`, `anime(season_year)`, `anime_genres(genre_id)`,
`episodes(anime_id)`, `library_entries(device_id)`,
`watch_progress(device_id, updated_at desc)`, `comments(anime_id, created_at desc)`.

---

## 4. API design (Hono, `/v1`)

Consistent envelopes: `{ data, nextCursor? }` for lists, `{ data }` for single, errors as
`{ error: { code, message } }` via a middleware.

**Public — no auth**

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/health` | liveness (DB ping) |
| `GET` | `/v1/home` | composed rows: trending, popular, upcoming, continue-watching |
| `GET` | `/v1/discover` | rails + genre list + seasonal + airing calendar |
| `GET` | `/v1/anime` | search/filter: `q, genre[], year, season, format, status, sort, cursor` |
| `GET` | `/v1/anime/:id` | detail + episodes + recommendations |
| `GET` | `/v1/anime/:id/episodes` | episode list |
| `GET` | `/v1/episodes/:id/playback` | signed playback URL (Mux), phase 3 |
| `GET` | `/v1/genres` | genre facets |

**Device-scoped — header `x-device-id` (phase 2)**

| Method | Path | Purpose |
|---|---|---|
| `GET` / `PUT` | `/v1/library/:list` | watchlist / liked / reminders |
| `PUT` | `/v1/progress/:episodeId` | upsert watch position |
| `PUT` | `/v1/ratings/:animeId` | 1–5 rating |
| `GET` / `POST` / `DELETE` | `/v1/comments` | per-title/episode comments |

**Backend shape**

```
apps/api/src/
  index.ts                # Hono app, CORS, error middleware, route mount
  env.ts                  # zod-validated process.env
  db/
    client.ts             # drizzle(postgres(DATABASE_URL))
    schema.ts             # the tables above
    queries/*.ts          # home.ts, anime.ts, discover.ts …
  routes/*.ts             # anime, home, discover, episodes, library, progress, comments
  middleware/{device,error}.ts
  lib/{anilist,mux,cursor}.ts
  sync/anilist.ts         # upsert AniList → anime/genres (cron/script)
drizzle.config.ts
drizzle/                  # migrations (drizzle-kit generate)
docker-compose.yml        # local Postgres
```

- `postgres` driver + `drizzle-orm/postgres-js`; migrations via `drizzle-kit`.
- `@hono/zod-validator` on every body/query; `hono/cors`.
- Query builders live in `db/queries/*` so route handlers stay thin and readable.

---

## 5. Frontend (Expo / React Native)

Match `expense-tracker`: `StyleSheet.create`, `constants/theme.ts`, `utils/styling.ts`
(`scale`/`verticalScale`), `@/*` alias, hand-rolled kit.

**Routing (`src/app/`)**

```
_layout.tsx                 # providers: QueryClient, SafeArea, StatusBar
(tabs)/_layout.tsx          # Home · Discover · Browse · Library
(tabs)/index.tsx            # Home
(tabs)/discover.tsx
(tabs)/browse.tsx
(tabs)/library.tsx
title/[id].tsx              # detail: hero preview, episodes, rating, comments, more-like-this
watch/[id]/[ep].tsx         # player
reels.tsx                   # full-screen vertical trailer feed
settings/…                  # port the existing settings design system
```

**State & data**

- **TanStack Query** for all server/AniList data (replaces `useFetch`).
- **Zustand** (+ `expo-sqlite`/`AsyncStorage` persist) for library/ratings/preview prefs.
- One `lib/api.ts` adapter with two impls: `anilist` (phase 1) and `http` (phase 2+).
  Flipping to the backend is a one-line change.

**Components ported from web**

`AnimeCard`, `UpcomingCard`, `Shelf` (horizontal `FlatList` + peek + snap),
`Hero` (carousel with autoplaying preview), `LibButton` (heart/bookmark/bell),
`Stars`, `FilterBar` (chips + native bottom-sheet selects), `Comments`, loading/error states.

**The preview problem (important)**

| Phase | Preview mechanism |
|---|---|
| 1 | `react-native-webview` embedding the AniList YouTube/Dailymotion trailer, `muted` + `autoplay` + `loop`, same URL builder as web |
| 3 | `expo-video` (`useVideoPlayer`/`VideoView`) playing a **Mux-hosted short clip** |

`PreviewVideo` exposes one interface; the phase-3 swap is internal. Behaviours:
muted, looping, autoplay when the card is >60% visible (IntersectionObserver equivalent
via `onViewableItemsChanged`), pause off-screen. On Android, set
`surfaceType="textureView"` when two `VideoView`s can overlap (known upstream bug).

**Video (phase 3):** `expo-video` → `useVideoPlayer(source, p => { p.loop = … })`,
`VideoView` with `nativeControls`, `allowsPictureInPicture`, `fullscreenOptions`.
Enable `supportsPictureInPicture`/`supportsBackgroundPlayback` via the `expo-video`
config plugin in `app.json`.

**Theming:** dark Netflix structure, AniJinx **violet `#7C5CFF`** accent, tokens in
`constants/theme.ts` so screens never hard-code hex.

---

## 6. AniList sync

`apps/api/src/sync/anilist.ts`:
1. Page `Page(perPage:50, sort: POPULARITY_DESC)` for trending/popular/upcoming/seasonal.
2. Upsert into `anime` + `genres`/`anime_genres`; store `raw jsonb` for fields we add later.
3. Run on demand (`npm run sync`) and optionally on a schedule.
Client keeps a module-level request cache (already in the web code) to respect rate limits.

---

## 7. Build order (milestones)

| M | Deliverable | Done when |
|---|---|---|
| **M0** | Scaffold `mobile/` + theme + kit + tab navigation | ✅ Done — 4 tabs, kit, theme tokens |
| **M1** | Home: hero + shelves from AniList + `PreviewVideo` | ✅ Done — viewability-driven muted previews |
| **M2** | Discover + Browse/search + filters | ✅ Done — chips + sheet drive results, cursor paging |
| **M3** | Title detail + library (local) | ✅ Done — episodes, ratings, comments persist |
| **M4** | Reels vertical feed | ✅ Done — paging + per-page autoplay |
| **M5** | Settings/Profile port | ✅ Done — playback/notification/data prefs |
| **M6** | `apps/` + Postgres + AniList sync; flip client to HTTP | API built + migrates; client still on AniList adapter |
| **M7** | Device library/progress/comments persistence | State survives reinstall via `x-device-id` |
| **M8** | Mux video + real episodes | Playback signed + streaming over HLS |

M0–M5 need **no backend**. Start there.

---

## 8. Verification

- Mobile: `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` before each milestone.
- API: `npm run typecheck`, `drizzle-kit generate` (schema diff), smoke `GET /v1/health`.
- Seed a couple of titles so UI states (loading/empty/error) are all reachable.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| No `<iframe>` on native | `react-native-webview` in phase 1 (see §5) |
| Overlapping `VideoView` on Android | `surfaceType="textureView"` |
| Expo SDK breaking changes | Versioned docs; `npx expo install`; `expo-doctor` |
| AniList rate limits | Cache + upsert into Postgres; module-level request cache |
| Monorepo Metro misconfig | Let Expo auto-configure; never add manual watchFolders |
| Legal | Playback only for owned/licensed titles; AniList for metadata |
| Retiring `apps/web` | Keep it until feature parity, then delete (and the Vite/Rolldown issue goes with it) |
