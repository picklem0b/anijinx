import type { Anime } from '@workspace/shared/types'
import type { InferSelectModel } from 'drizzle-orm'
import type { anime } from './schema'

type AnimeRow = InferSelectModel<typeof anime>

/** DB row → the exact shape the clients already speak. */
export function toAnime(row: AnimeRow, genres: string[] = []): Anime {
  return {
    id: row.id,
    title: { romaji: row.romaji, english: row.english },
    coverImage: {
      extraLarge: row.coverUrl ?? '',
      large: row.coverUrl ?? '',
      color: row.coverColor,
    },
    bannerImage: row.bannerUrl,
    format: row.format,
    status: row.status,
    episodes: row.episodesCount,
    duration: row.duration,
    season: row.season,
    seasonYear: row.seasonYear,
    averageScore: row.score == null ? null : Math.round(row.score),
    popularity: row.popularity,
    genres,
    description: row.synopsis,
    trailer:
      row.trailerId && row.trailerSite
        ? { id: row.trailerId, site: row.trailerSite }
        : null,
    nextAiringEpisode:
      row.nextEpisode && row.nextAiringAt
        ? { airingAt: Math.floor(row.nextAiringAt.getTime() / 1000), episode: row.nextEpisode }
        : null,
    startDate: { year: row.seasonYear, month: null, day: null },
    studios: { nodes: row.studio ? [{ name: row.studio }] : [] },
  }
}
