import { and, desc, eq, inArray, ilike, sql } from 'drizzle-orm'
import { db } from '../client'
import { anime, animeGenres, genres } from '../schema'
import { PAGE_SIZE } from '../../lib/cursor'
import type { SearchQuery } from '@workspace/shared/schemas'

/** Genres for a set of anime ids, as a Map so callers can join in memory. */
export async function genresByAnime(ids: number[]) {
  const map = new Map<number, string[]>()
  if (!ids.length) return map
  const rows = await db
    .select({ animeId: animeGenres.animeId, name: genres.name })
    .from(animeGenres)
    .innerJoin(genres, eq(genres.id, animeGenres.genreId))
    .where(inArray(animeGenres.animeId, ids))
  for (const r of rows) {
    const list = map.get(r.animeId) ?? []
    list.push(r.name)
    map.set(r.animeId, list)
  }
  return map
}

export async function listAnime(q: SearchQuery) {
  const where = [eq(anime.format, anime.format)] // always-true seed condition

  if (q.q) where.push(ilike(anime.romaji, `%${q.q}%`))
  if (q.year) where.push(eq(anime.seasonYear, q.year))
  if (q.season) where.push(eq(anime.season, q.season))
  if (q.format) where.push(eq(anime.format, q.format))
  if (q.status) where.push(eq(anime.status, q.status))

  if (q.genre.length) {
    const ids = db
      .select({ id: animeGenres.animeId })
      .from(animeGenres)
      .innerJoin(genres, eq(genres.id, animeGenres.genreId))
      .where(inArray(genres.name, q.genre))
    where.push(inArray(anime.id, ids))
  }

  const order =
    q.sort === 'TRENDING_DESC' || q.sort === 'POPULARITY_DESC'
      ? desc(anime.popularity)
      : q.sort === 'SCORE_DESC'
        ? desc(anime.score)
        : desc(anime.seasonYear)

  const rows = await db
    .select()
    .from(anime)
    .where(and(...where))
    .orderBy(order, desc(anime.id))
    .limit(PAGE_SIZE + 1)
    .offset((q.cursor - 1) * PAGE_SIZE)

  const hasNext = rows.length > PAGE_SIZE
  return { rows: rows.slice(0, PAGE_SIZE), hasNext, cursor: q.cursor }
}

export async function getAnimeById(id: number) {
  const [row] = await db.select().from(anime).where(eq(anime.id, id)).limit(1)
  return row ?? null
}

export async function countAnime() {
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(anime)
  return row?.n ?? 0
}
