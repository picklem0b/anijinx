# PRD: AniJinx — Anime Streaming Platform

> A PRD exists to align a team on *what* we're building and *why*, clearly enough to
> execute. This one covers the full re-architecture (repo restructure + Expo mobile +
> production API) and the complete page/section inventory.

| Field | Value |
|---|---|
| **Status** | Draft |
| **Owner** | AniJinx (sole developer) |
| **Date** | 2026-10-01 |
| **Reviewers** | — |

---

## Summary

AniJinx is a **Netflix-style streaming app for anime only**. This PRD covers rebuilding it
as three deployables — a Vite **website** (`web/`), an **Expo React Native** app
(`mobile/`), and a production **Hono + Postgres API** (`apps/`) — with a full page/section
inventory, a motion system, and a set of added features. The bet: a fast, animated,
iOS-feeling anime client with a real backend, built from a codebase one person can read and
change with confidence.

## Background

Today the repo is a Vite SPA at `apps/web` (React 19 + React Router + Tailwind v4 +
framer-motion) pulling metadata/trailers from AniList and persisting library state in
`localStorage` under a stale `sora-*` name (already renamed to `anijinx`). There is no
mobile client and no server. Two events prompted this: the product needs a native mobile
experience, and a Termux run surfaced a Vite 8/Rolldown native-binding failure that makes
the web-only path brittle on the primary dev device.

Prior decisions are recorded in [`stack-and-ux.md`](./stack-and-ux.md) and
[`implementation-plan.md`](./implementation-plan.md).

## Problem Statement

AniJinx is a web-only SPA, so it cannot deliver a native, iOS-quality mobile experience;
its state lives on one device in `localStorage`, so nothing survives a reinstall or syncs;
and it has no trusted server, so it can never serve gated video or shared data.
**(assumption: single developer, personal/hobby scale, no external users yet)**

## Target Users

- **Primary:** the developer/owner building and using AniJinx (single user, multi-device:
  Android phone + desktop browser).
- **Secondary:** future invited anime fans who want a lightweight discovery + watchlist app.
- **Non-user (for now):** paying subscribers / public consumer scale.

## Goals

- **G1.** One readable codebase, three clear deployables: `web/`, `mobile/`, `apps/`.
- **G2.** A native mobile client covering every app screen, with an iOS feel.
- **G3.** A production API that persists library, progress, ratings and comments.
- **G4.** A consistent motion system — animation everywhere, without hurting usability.
- **Primary metric:** % of app screens reachable and functional end-to-end on mobile.
- **Guardrail metrics:** cold start time, scroll jank (dropped frames), and
  **reduced-motion compliance** (animations must be disabled when the OS asks).

## Non-goals

- **NG1.** Real user accounts / auth. (Deferred; anonymous device identity only.)
- **NG2.** Payments, subscriptions, DRM licensing deals, or any content we don't own.
- **NG3.** Live streaming / live TV.
- **NG4.** Public consumer scale, social graph, or moderation tooling.
- **NG5.** Native iOS App Store release this pass (dev builds only).
- **NG6.** Rewriting the `web/` design language — the website keeps its current look.

## User Jobs / Use Cases

| Job | Situation |
|---|---|
| **Discover something to watch** | "I have 20 minutes, show me something good." |
| **Decide from a preview** | "Is this worth my time?" — watched muted, on the couch. |
| **Keep a queue** | "Save this for later, on either device." |
| **Resume exactly** | "I watched 12 min of EP 4 last night." |
| **React and discuss** | "Rate it, comment on the episode." |
| **Track airing** | "Remind me when the next episode drops." |

## Requirements

Numbered, testable. **M**ust / **S**hould / **C**ould.

### R1 — Repository restructure · M

1. **R1.1** `apps/web` moves to top-level **`web/`**; the SPA builds and serves unchanged.
2. **R1.2** **`mobile/`** holds the Expo app; `npx expo start` runs it from the root.
3. **R1.3** **`apps/`** holds the production API (Hono + Postgres) with its own
   `package.json`, Docker/Postgres compose, and deploy config.
4. **R1.4** Root `package.json` workspaces resolve `web`, `mobile`, `apps`, `packages/*`;
   Turbo pipelines cover all three.
5. **R1.5** `packages/shared` holds Zod schemas + types + the AniList client, imported by
   all three deployables.

### R2 — Global chrome (header) · M

1. **R2.1** On every app screen, the header shows the **user avatar at the top right**.
2. **R2.2** Immediately to the **left of the avatar is the search input** (source order:
   `… nav | search input | avatar`).
3. **R2.3** The search input expands/animates into the viewport when focused and collapses
   to a search affordance on small screens.
4. **R2.4** Header becomes translucent/blurred on scroll past 24px.
5. **R2.5** Below `md`, primary navigation moves to a bottom tab bar; header keeps search +
   avatar.

### R3 — Website pages (`web/`) · M

Marketing + app in the existing Vite SPA.

**Marketing:** Landing (hero, feature grid, screenshot gallery, how-it-works, testimonial,
FAQ accordion, CTA bands) · Pricing (tiers + comparison table) · About · Help/Support ·
Contact · Legal (Terms, Privacy, Cookies) · Sign in / Sign up (UI only) · 404.

**App:** Home · Discover · Browse/Search · Title detail · Watch · Reels · Library ·
Profile · Settings.

### R4 — Mobile app pages (`mobile/`) · M

The same app surfaces as R3's app section, in Expo:

| Screen | Must contain |
|---|---|
| **Home** | Hero with autoplaying muted preview; rows |
| **Discover** | Personalized rails, genre grid, seasonal, airing calendar, curated |
| **Browse/Search** | Search, genre chips, filters (year/season/format/status/sort), infinite results |
| **Title detail** | Preview hero, synopsis, metadata, like/watchlist/reminder, star rating, episodes, recommendations, comments |
| **Watch** | Player, episode selector, prev/next, progress save, comments |
| **Reels** | Full-screen vertical trailer feed with like/comment/save rails |
| **Library** | Watchlist, liked, reminders, rated, continue watching |
| **Profile** | Avatar, stats, recent activity |
| **Settings** | Appearance, language, notifications, playback, privacy, downloads |

### R5 — Motion system · S

1. **R5.1** Mobile uses **react-native-reanimated**; web uses **framer-motion**.
2. **R5.2** Required animations: page/route transitions, shared-element card→detail,
   hero parallax, staggered card entrance, skeleton shimmer, spring bottom-sheets,
   press/haptic feedback, scroll-linked header, like-burst, animated numbers.
3. **R5.3** **Every** animation respects `prefers-reduced-motion` / iOS "Reduce Motion"
   and degrades to an instant state change.
4. **R5.4** Animations run on the UI thread where possible; no animation blocks a tap.

### R6 — Added features · S (subset M)

| Feature | Priority |
|---|---|
| Continue-watching with progress bars | M |
| Search suggestions + recent searches | M |
| Skip intro / next-episode countdown | S |
| Downloads for offline (mobile) | S |
| Subtitles/captions controls | S |
| Airing reminders + local notifications | S |
| Comments with like/reply | S |
| Share sheet (deep links) | S |
| Profile customization (avatar, theme) | C |
| Achievements/badges | C |
| Watch party | C |

### R7 — API (`apps/`) · S

`GET /v1/home`, `/discover`, `/anime` (search/filter/cursor), `/anime/:id`,
`/anime/:id/episodes`, `/genres`, `/health`; device-scoped `/library/:list`, `/progress`,
`/ratings`, `/comments` via `x-device-id`. Zod-validated, Drizzle + Postgres. Schema and
routes per [`implementation-plan.md`](./implementation-plan.md) §3–4.

### R8 — Content & playback · S

- Episodes/video are only ever content we own or license.
- Playback via Mux **signed** URLs (secret stays server-side) or self-hosted HLS.
- Phase 1 previews use `react-native-webview` (YouTube/Dailymotion trailer).

## User Stories

**Epic: Global chrome**
- As a viewer, I want the search input and my avatar together at the top right, so that
  account and search are always one tap away.
  - *Given* any app screen, *when* it loads, *then* avatar is the rightmost header item and
    the search input sits immediately to its left.
  - *Given* a narrow viewport, *when* the header renders, *then* the search collapses to an
    icon and expands on tap.

**Epic: Discovery**
- As a viewer, I want rows and a Discover page, so that I can find something to watch
  without typing.
  - *Given* Home is loading, *then* shimmer shelves show, replaced by real cards.
  - *Given* a card is >60% visible, *then* its trailer preview autoplays muted and pauses
    when it leaves.

**Epic: Library**
- As a viewer, I want like/watchlist/reminder/rating to persist, so that my queue survives
  a restart.
  - *Given* I like a title offline, *then* on reconnect it appears in Library.

## Acceptance Criteria (platform-wide)

- Every screen in R3/R4 exists and is navigable in both `web/` and `mobile/`.
- Header order is verifiably `nav … search-input, avatar`.
- With reduced motion enabled, zero non-essential animations play.
- `web/` builds; `mobile/` typechecks and boots; `apps/` passes typecheck + `/v1/health`.

## UX Notes

- **States:** every data surface defines loading (skeleton), empty, error, and offline.
- **Header:** translucent on scroll; bottom tabs under `md` (web) and always (mobile).
- **Motion:** entrance ≈ 200–400ms, springs for sheets, no animation longer than 600ms.
- **Theming:** dark default, violet accent `#7C5CFF`, tokens in `constants/theme.ts` /
  CSS vars — no hard-coded hex in components.
- **Accessibility:** min 44px touch targets, focus-visible rings, captions, reduced motion.

## Analytics / Success Metrics

- **Primary:** % of the R3/R4 screen inventory functional on mobile (target 100% for MVP).
- **Supporting:** time-to-first-content < 1.5s; trailer-preview start rate; library action
  rate per session.
- **Guardrails:** cold-start < 2s; 60fps scroll (no sustained dropped frames); reduced-
  motion compliance = 100%.
- **Instrumentation (assumption: local-only, no analytics yet):** on-device counters +
  dev logging until the API lands, then server-side events.

## Dependencies

- AniList GraphQL (public, no key) for metadata/trailers.
- Expo SDK 57 + expo-router + expo-video + reanimated (mobile).
- Hono + Drizzle + Postgres (apps/), Mux for signed playback (phase 3).
- Vite + framer-motion (web/).

## Risks

| Risk | Mitigation |
|---|---|
| Scope: "every page" × 2 clients is very large | Phase it; MVP = app screens, marketing second |
| RN has no iframe for trailer previews | `react-native-webview` in phase 1; Mux clips later |
| Overlapping `VideoView` on Android | `surfaceType="textureView"` |
| Too much motion hurts usability/perf | Reduced-motion + duration budget + guardrails |
| Restructure breaks Turbo/workspaces | Do the move in one commit; verify build/typecheck |
| Expo SDK breaking changes | Versioned docs; `npx expo install`; `expo-doctor` |
| Legal | Play only owned/licensed content; AniList for metadata only |

## Open Questions

1. Marketing copy/brand assets (logo, tagline, screenshots) — source? *(owner: you)*
2. `apps/` naming: single API package now, or `apps/api` to allow more deployables later?
3. Do `web/` and `mobile/` share design tokens, or evolve independently?
4. Which added features beyond the M-set make MVP?

## Launch Plan

Phased, each phase independently shippable:
**P0** restructure → **P1** mobile app screens → **P2** motion + added features →
**P3** marketing pages on web → **P4** `apps/` API + client flip → **P5** Mux playback.

## Rollout Plan

Local/dev first; no public deploy until P4. The website stays live throughout.
Rollback = revert the restructure commit; `web/` is unchanged in behavior.

## Post-launch Review

After each phase: verify goal metrics + guardrails. **Keep** if screens are functional and
scroll stays smooth; **iterate** if motion or load times regress; **kill** a feature if it
adds complexity without improving discovery or resume.
