import * as anilist from '@workspace/shared/anilist'
import type { PlaybackAsset } from '@workspace/shared/playback'
import type { Anime, Filters } from '@workspace/shared/types'

/**
 * One adapter, two implementations. Phase 1 talks to AniList directly so the
 * UI is buildable with no server. Flipping to the Hono API is a one-line change
 * here — every screen imports `api`, never `anilist`.
 */
export interface AniJinxApi {
  home(): Promise<{ trending: Anime[]; popular: Anime[]; upcoming: Anime[] }>
  anime(id: number): Promise<import('@workspace/shared/types').AnimeDetail>
  search(f: Filters, page: number): Promise<{ media: Anime[]; hasNext: boolean }>
  reels(page: number): Promise<{ media: Anime[]; hasNext: boolean }>
  byIds(ids: number[]): Promise<Anime[]>
  recommendations(
    liked: number[],
  ): Promise<{ personal: boolean; genres: string[]; items: Anime[] }>
  seasonal(season: string, year: number): Promise<Anime[]>
  airing(): Promise<Anime[]>
}

const anilistAdapter: AniJinxApi = {
  home: anilist.getHome,
  anime: anilist.getAnime,
  search: anilist.searchAnime,
  reels: anilist.getReels,
  byIds: anilist.getByIds,
  recommendations: anilist.getRecommendations,
  seasonal: anilist.getSeasonal,
  airing: anilist.getAiring,
}

/** Set EXPO_PUBLIC_API_URL to switch every screen over to the Hono API. */
export const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const api: AniJinxApi = anilistAdapter

/**
 * Asks our API for a licensed stream for one episode.
 *
 * Returns null when the API is not configured, the episode has no asset, or the
 * request fails — the caller then falls back to the labelled trailer. We only
 * ever play assets the API hands us (hosted/licensed `video_assets` rows); this
 * never talks to a third-party streaming site.
 */
export async function fetchPlayback(
  animeId: number,
  episode: number,
): Promise<PlaybackAsset | null> {
  if (!apiUrl) return null
  try {
    const res = await fetch(`${apiUrl}/v1/playback/${animeId}/${episode}`)
    if (!res.ok) return null
    const json = (await res.json()) as { data?: PlaybackAsset }
    return json.data ?? null
  } catch {
    return null
  }
}
