import { desc, eq, isNotNull, ne, sql } from 'drizzle-orm'
import { db } from '../client'
import { anime, rows, rowItems } from '../schema'
import { toAnime } from '../mappers'
import { genresByAnime } from './anime'

async function decorate<T extends { id: number }>(list: T[]) {
  const map = await genresByAnime(list.map((a) => a.id))
  return list.map((row) => toAnime(row as never, map.get(row.id) ?? []))
}

const byPopularity = (limit = 20) =>
  db.select().from(anime).orderBy(desc(anime.popularity)).limit(limit)

const byScore = (limit = 20) =>
  db.select().from(anime).orderBy(desc(anime.score)).limit(limit)

const airing = (limit = 20) =>
  db
    .select()
    .from(anime)
    .where(eq(anime.status, 'RELEASING'))
    .orderBy(desc(anime.popularity))
    .limit(limit)

const upcoming = (limit = 20) =>
  db
    .select()
    .from(anime)
    .where(eq(anime.status, 'NOT_YET_RELEASED'))
    .orderBy(desc(anime.popularity))
    .limit(limit)

export interface Rail {
  key: string
  title: string
  subtitle: string | null
  items: ReturnType<typeof toAnime>[]
}

export async function getHomeRails(): Promise<Rail[]> {
  const [popular, top, airingRows, upcomingRows] = await Promise.all([
    byPopularity(),
    byScore(),
    airing(),
    upcoming(),
  ])

  const rails = [
    { key: 'trending', title: 'Trending Now', subtitle: 'What everyone is watching', rows: popular },
    { key: 'top', title: 'Top Rated', subtitle: 'Highest scored on AniList', rows: top },
    { key: 'airing', title: 'Currently Airing', subtitle: 'New episodes weekly', rows: airingRows },
    { key: 'upcoming', title: 'Coming Soon', subtitle: 'Mark your calendar', rows: upcomingRows },
  ]

  return Promise.all(
    rails.map(async (r) => ({
      key: r.key,
      title: r.title,
      subtitle: r.subtitle,
      items: await decorate(r.rows),
    })),
  )
}

export async function getCuratedRows(): Promise<Rail[]> {
  const curated = await db.select().from(rows).orderBy(rows.position)
  if (!curated.length) return []

  const out: Rail[] = []
  for (const row of curated) {
    const items = await db
      .select()
      .from(anime)
      .innerJoin(rowItems, eq(rowItems.animeId, anime.id))
      .where(eq(rowItems.rowId, row.id))
      .orderBy(rowItems.position)
      .limit(30)
    out.push({
      key: row.key,
      title: row.title,
      subtitle: row.subtitle,
      items: await decorate(items.map((i) => i.anime)),
    })
  }
  return out
}

export async function getDiscover() {
  const [seasonGenres, topAir, comingSoon] = await Promise.all([
    db
      .select({ name: sql<string>`g.name`, count: sql<number>`count(*)::int` })
      .from(sql`genres g`)
      .innerJoin(sql`anime_genres ag`, sql`ag.genre_id = g.id`)
      .groupBy(sql`g.name`)
      .orderBy(desc(sql`count(*)`)),
    airing(12),
    upcoming(12),
  ])

  const withTrailers = await db
    .select()
    .from(anime)
    .where(sql`${anime.trailerId} is not null`)
    .orderBy(desc(anime.popularity))
    .limit(16)

  return {
    rails: await getCuratedRows(),
    genres: seasonGenres,
    airing: await decorate(topAir),
    upcoming: await decorate(comingSoon),
    trailers: await decorate(withTrailers),
  }
}

export async function getSuggestions(q: string, limit = 8) {
  void isNotNull(ne(anime.id, 0))
  const rows = await db
    .select({ id: anime.id, romaji: anime.romaji, english: anime.english, cover: anime.coverUrl })
    .from(anime)
    .where(sql`${anime.romaji} ilike ${'%' + q + '%'} or ${anime.english} ilike ${'%' + q + '%'}`)
    .limit(limit)
  return rows
}
