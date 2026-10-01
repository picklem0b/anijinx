/**
 * Anime data providers — measured, not assumed.
 *
 * Every entry below was probed live against the public-apis "Anime" category
 * (https://github.com/public-apis/public-apis#anime). `status` records what the
 * endpoint actually returned, so nobody has to guess later.
 *
 * THE HEADLINE FINDING: none of them stream episodes. AniAPI is the only entry
 * that even claims streaming and it is dead. Legitimate playback means content
 * you own or license; everything here is metadata, artwork, quotes or manga.
 *
 * See docs/anime-data-sources.md for the raw test output.
 */

export type ProviderStatus = 'ok' | 'needs-key' | 'dead' | 'blocked' | 'not-streaming'

export type ProviderKind = 'metadata' | 'artwork' | 'quotes' | 'manga' | 'tooling' | 'streaming'

export interface Provider {
  name: string
  baseUrl: string
  kind: ProviderKind
  auth: 'none' | 'apiKey' | 'oauth'
  status: ProviderStatus
  /** What we measured. */
  note: string
  docs: string
}

export const PROVIDERS: Provider[] = [
  {
    name: 'AniList',
    baseUrl: 'https://graphql.anilist.co',
    kind: 'metadata',
    auth: 'none',
    status: 'ok',
    note: 'Public GraphQL. No key for read-only. Titles, artwork, trailers, airing schedule. This is our primary source.',
    docs: 'https://github.com/AniList/ApiV2-GraphQL-Docs',
  },
  {
    name: 'Jikan',
    baseUrl: 'https://api.jikan.moe/v4',
    kind: 'metadata',
    auth: 'none',
    status: 'ok',
    note: 'Unofficial MyAnimeList mirror. Returns 200 with no key. Good first fallback for metadata.',
    docs: 'https://docs.api.jikan.moe/',
  },
  {
    name: 'Kitsu',
    baseUrl: 'https://kitsu.io/api/edge',
    kind: 'metadata',
    auth: 'none',
    status: 'ok',
    note: 'JSON:API. Read endpoints work without a token; OAuth only needed to write lists.',
    docs: 'https://kitsu.docs.apiary.io/',
  },
  {
    name: 'Shikimori',
    baseUrl: 'https://shikimori.one/api',
    kind: 'metadata',
    auth: 'none',
    status: 'ok',
    note: 'Works, but the host 301-redirects — follow redirects or you will see an empty body.',
    docs: 'https://shikimori.one/api/doc',
  },
  {
    name: 'AnimeNewsNetwork',
    baseUrl: 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml',
    kind: 'metadata',
    auth: 'none',
    status: 'ok',
    note: 'Returns XML, not JSON. Fine for enriching studio/staff data, awkward for everything else.',
    docs: 'https://www.animenewsnetwork.com/encyclopedia/api.php',
  },
  {
    name: 'Studio Ghibli',
    baseUrl: 'https://ghibliapi.vercel.app',
    kind: 'metadata',
    auth: 'none',
    status: 'ok',
    note: 'Works, but only covers Ghibli films. Not a general catalogue.',
    docs: 'https://ghibliapi.vercel.app',
  },
  {
    name: 'MangaDex',
    baseUrl: 'https://api.mangadex.org',
    kind: 'manga',
    auth: 'none',
    status: 'ok',
    note: 'Manga only — no anime episodes. Useful if AniJinx ever adds a manga shelf.',
    docs: 'https://api.mangadex.org/docs/',
  },
  {
    name: 'NekosBest',
    baseUrl: 'https://nekos.best/api/v2',
    kind: 'artwork',
    auth: 'none',
    status: 'ok',
    note: 'Anime reaction images. Decorative only — no catalogue or playback.',
    docs: 'https://docs.nekos.best/',
  },
  {
    name: 'Trace Moe',
    baseUrl: 'https://api.trace.moe',
    kind: 'tooling',
    auth: 'none',
    status: 'ok',
    note: '/me returns quota fine. /search rejects GET with 405 — it needs POST/PUT with a frame URL or file. Scene lookup, not playback.',
    docs: 'https://soruly.github.io/trace.moe-api/',
  },
  {
    name: 'AniDB',
    baseUrl: 'http://api.anidb.net:9001/httpapi',
    kind: 'metadata',
    auth: 'apiKey',
    status: 'needs-key',
    note: 'Responds, but gzipped and gated behind a registered client name + API key, and it is HTTP-only (no TLS).',
    docs: 'https://wiki.anidb.net/HTTP_API_Definition',
  },
  {
    name: 'MyAnimeList',
    baseUrl: 'https://api.myanimelist.net/v2',
    kind: 'metadata',
    auth: 'oauth',
    status: 'needs-key',
    note: 'Official API requires OAuth client registration. Metadata only, no streams.',
    docs: 'https://myanimelist.net/apiconfig/references/api/v2',
  },
  {
    name: 'Danbooru Anime',
    baseUrl: 'https://danbooru.donmai.us',
    kind: 'artwork',
    auth: 'apiKey',
    status: 'needs-key',
    note: 'Anonymous reads are heavily rate-limited; an API key is effectively required.',
    docs: 'https://danbooru.donmai.us/wiki_pages/help:api',
  },
  {
    name: 'Waifu.im',
    baseUrl: 'https://api.waifu.im',
    kind: 'artwork',
    auth: 'none',
    status: 'blocked',
    note: 'Cloudflare challenge ("Just a moment…") — 403 from any non-browser client, including with a normal UA.',
    docs: 'https://waifu.im/docs',
  },
  {
    name: 'AniAPI',
    baseUrl: 'https://api.aniapi.com',
    kind: 'streaming',
    auth: 'oauth',
    status: 'dead',
    note: 'The only entry claiming "streaming". Now 302-redirects to a placeholder page; the API is gone. Do not build on it.',
    docs: 'https://aniapi.com/docs/',
  },
  {
    name: 'AnimeChan',
    baseUrl: 'https://animechan.io',
    kind: 'quotes',
    auth: 'none',
    status: 'dead',
    note: 'Quotes only. Both animechan.io and the legacy animechan.xyz return 404.',
    docs: 'https://github.com/RocktimSaikia/anime-chan',
  },
  {
    name: 'AnimeFacts',
    baseUrl: 'https://anime-facts-rest-api.herokuapp.com',
    kind: 'quotes',
    auth: 'none',
    status: 'dead',
    note: '404 — the Heroku dyno is retired.',
    docs: 'https://chandan-02.github.io/anime-facts-rest-api/',
  },
  {
    name: 'Waifu.pics',
    baseUrl: 'https://api.waifu.pics',
    kind: 'artwork',
    auth: 'none',
    status: 'dead',
    note: 'Connection refused — host is down.',
    docs: 'https://waifu.pics/docs',
  },
  {
    name: 'Catboy',
    baseUrl: 'https://catboys.com',
    kind: 'artwork',
    auth: 'none',
    status: 'dead',
    note: 'Redirects every path to a parked lander page. Domain no longer serves an API.',
    docs: 'https://catboys.com/api',
  },
]

/** The providers we actually depend on, in fallback order. */
export const METADATA_CHAIN = PROVIDERS.filter(
  (p) => p.status === 'ok' && p.kind === 'metadata' && p.name !== 'AnimeNewsNetwork',
)

export const providerByName = (name: string) => PROVIDERS.find((p) => p.name === name)
