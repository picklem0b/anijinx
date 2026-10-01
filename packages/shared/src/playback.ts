import { trailerEmbed } from './format'
import type { AnimeDetail } from './types'

/**
 * Playback resolution.
 *
 * A public API cannot give us episode streams — no provider in the public-apis
 * Anime category does (see `providers.ts`). So instead of pretending the trailer
 * IS episode N, we resolve honestly and label the result: licensed asset when we
 * have one, otherwise an explicitly-marked preview, plus the official places the
 * user can watch the real episode.
 */

export type PlaybackKind = 'hls' | 'file' | 'trailer'

export interface PlaybackSource {
  kind: PlaybackKind
  url: string
  /** Shown above the player so the viewer is never misled about what is playing. */
  label: string
  /** True only when this is the actual licensed episode. */
  isEpisode: boolean
}

export interface OfficialLink {
  site: string
  url: string
}

/**
 * A stream our own API resolved from the `video_assets` table — i.e. an asset we
 * host or license. Returned by `GET /v1/playback/:animeId/:episode`.
 */
export interface PlaybackAsset {
  url: string
  kind: Exclude<PlaybackKind, 'trailer'>
  provider: string
  durationSeconds: number | null
  aspectRatio: string | null
}

/**
 * Legitimate, licensed places to watch the full episode: the streaming episode
 * entry for this episode number first, then any STREAMING external links.
 */
export function officialLinks(a: AnimeDetail, episode: number): OfficialLink[] {
  const list: OfficialLink[] = []

  const streamed = a.streamingEpisodes.find((e) =>
    new RegExp(`^Episode ${episode}\\b`, 'i').test(e.title),
  )
  if (streamed) list.push({ site: streamed.site, url: streamed.url })

  for (const l of a.externalLinks) {
    if (l.type !== 'STREAMING') continue
    if (list.some((x) => x.url === l.url)) continue
    list.push({ site: l.site, url: l.url })
  }

  return list
}

/**
 * What we can actually play right now.
 *
 * @param licensedUrl a playback URL from our own API (`video_assets`) — Mux HLS,
 *                    a self-hosted manifest, or a file. This is the only path
 *                    that yields a real episode.
 */
export function resolvePlayback(
  a: AnimeDetail,
  episode: number,
  licensedUrl?: string | null,
): PlaybackSource | null {
  if (licensedUrl) {
    return {
      kind: licensedUrl.includes('.m3u8') ? 'hls' : 'file',
      url: licensedUrl,
      label: `Episode ${episode}`,
      isEpisode: true,
    }
  }

  if (a.trailer) {
    return {
      kind: 'trailer',
      url: trailerEmbed(a.trailer, false, true),
      label: `Official trailer — preview, not Episode ${episode}`,
      isEpisode: false,
    }
  }

  return null
}
