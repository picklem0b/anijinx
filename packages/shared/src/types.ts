export interface Trailer {
  id: string
  site: string
}

export interface Anime {
  id: number
  title: { romaji: string; english: string | null }
  coverImage: { extraLarge: string; large: string; color: string | null }
  bannerImage: string | null
  format: string | null
  status: string | null
  episodes: number | null
  duration: number | null
  season: string | null
  seasonYear: number | null
  averageScore: number | null
  popularity: number | null
  genres: string[]
  description: string | null
  trailer: Trailer | null
  nextAiringEpisode: { airingAt: number; episode: number } | null
  startDate: { year: number | null; month: number | null; day: number | null }
  studios: { nodes: { name: string }[] }
}

export interface AnimeDetail extends Anime {
  streamingEpisodes: { title: string; thumbnail: string | null; url: string; site: string }[]
  externalLinks: { site: string; url: string; type: string }[]
  recommendations: { nodes: { mediaRecommendation: Anime | null }[] }
}

export interface Filters {
  q: string
  genres: string[]
  year: string
  season: string
  format: string
  status: string
  sort: string
}

export interface Comment {
  id: string
  text: string
  at: number
  ep: number | null
}

/** A saved playback position for one episode. */
export interface Progress {
  animeId: number
  episode: number
  positionSeconds: number
  durationSeconds: number
  updatedAt: number
}

export type ListKey = 'liked' | 'watchlist' | 'reminders'
