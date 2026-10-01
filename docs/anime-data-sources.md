# Anime data sources — what actually works

Every entry in the **Anime** category of
[public-apis](https://github.com/public-apis/public-apis#anime) was probed live
(2026-10-01, plain `curl`, no keys). This is the measured result, not a copy of
the list.

## The headline

**None of them stream anime episodes.**

`AniAPI` is the only entry that even *claims* streaming, and it is dead. Every
other provider is metadata, artwork, quotes, or manga. So "get episode streams
from a free public API" is not a thing that exists — anything that does it is a
scraper of a pirate site, with the legal exposure that implies.

AniJinx therefore treats playback as **content we own or license**, and uses
these APIs only for discovery.

## Metadata — usable, no key

| Provider | Endpoint | Measured | Notes |
|---|---|---|---|
| **AniList** | `https://graphql.anilist.co` | `200` | Primary source. GraphQL, no key for reads. Titles, artwork, trailers, airing schedule. |
| **Jikan** | `https://api.jikan.moe/v4` | `200` | Unofficial MyAnimeList mirror. Best first fallback. |
| **Kitsu** | `https://kitsu.io/api/edge` | `200` | JSON:API. Reads need no token; OAuth is only for writing lists. |
| **Shikimori** | `https://shikimori.one/api` | `200` *with `-L`* | Host 301-redirects. Follow redirects or you get an empty body. |
| **AnimeNewsNetwork** | `.../encyclopedia/api.xml` | `200` | XML, not JSON. Good for studio/staff enrichment only. |
| **Studio Ghibli** | `https://ghibliapi.vercel.app` | `200` | Works, but covers Ghibli films only. |

Non-anime but present in the category: **MangaDex** (`200`, manga only) and
**NekosBest** (`200`, reaction images).

**trace.moe** — `/me` returns your quota (`200`); `/search` answers `405` to a
plain GET because it needs POST/PUT with a frame. It is a scene-lookup tool, not
a catalogue or a player.

## Metadata — needs a key

| Provider | Auth | Measured | Notes |
|---|---|---|---|
| **AniDB** | registered client + `apiKey` | `200` | Responds gzipped, HTTP-only (no TLS), and requires registering a client name. |
| **MyAnimeList** | OAuth | not testable | Official API needs a registered OAuth client. Metadata only. |
| **Danbooru** | `apiKey` | limited | Anonymous reads are heavily rate-limited; a key is effectively mandatory. |

## Dead / unusable

| Provider | Measured | What happened |
|---|---|---|
| **AniAPI** | `302` → placeholder | The only "streaming" entry. API is gone. Do not build on it. |
| **AnimeChan** | `404` | Both `animechan.io` and legacy `animechan.xyz` return 404. |
| **AnimeFacts** | `404` | Heroku dyno retired. |
| **Waifu.pics** | connection refused | Host down. |
| **Catboy** | `200` → parked lander | Every path redirects to a domain-sale page. |
| **Waifu.im** | `403` Cloudflare | "Just a moment…" challenge; blocked for any non-browser client, UA spoofing included. |

## What AniJinx does with this

1. **AniList is the source of truth** for metadata, artwork, trailers and the
   airing calendar.
2. **Jikan and Kitsu are recorded fallbacks** (`packages/shared/src/providers.ts`)
   so a rate-limit or outage has somewhere to go. They are not wired in yet —
   AniList has been reliable and a fallback chain is only worth building when it
   actually breaks.
3. **Playback is honest.** `resolvePlayback()` in `packages/shared/src/playback.ts`
   returns a licensed asset when the API has one and otherwise an
   *explicitly-labelled* trailer preview — it never presents a trailer as
   "Episode N". `officialLinks()` returns the licensed places the user can watch
   the real episode (Crunchyroll, HIDIVE, …) from AniList's `streamingEpisodes`
   and `externalLinks`.
4. **To get real playback** you need licensed assets: fund a Mux account (or
   self-host HLS), store a `video_assets` row per episode, and return the
   playback URL from `GET /v1/episodes/:id/playback`. The web and mobile players
   already accept `hls` / `file` sources, so that is a data problem, not a code
   problem.

> Only ever host content you own or are licensed to distribute.
