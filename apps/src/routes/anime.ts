import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { searchQuerySchema } from '@workspace/shared/schemas'
import { getAnimeById, genresByAnime, listAnime } from '../db/queries/anime'
import { getSuggestions } from '../db/queries/home'
import { toAnime } from '../db/mappers'
import { page } from '../lib/cursor'
import { fail } from '../middleware/error'
import { db } from '../db/client'
import { episodes } from '../db/schema'
import { asc, eq } from 'drizzle-orm'

export const animeRoutes = new Hono()

animeRoutes.get('/', zValidator('query', searchQuerySchema), async (c) => {
  const q = c.req.valid('query')
  const { rows, hasNext, cursor } = await listAnime(q)
  const map = await genresByAnime(rows.map((r) => r.id))
  const items = rows.map((r) => toAnime(r, map.get(r.id) ?? []))
  return c.json(page(items, cursor, hasNext))
})

animeRoutes.get('/suggest', async (c) => {
  const q = c.req.query('q')?.trim()
  if (!q) return c.json({ data: [] })
  return c.json({ data: await getSuggestions(q) })
})

animeRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) return fail(c, 400, 'bad_id', 'Invalid anime id')

  const row = await getAnimeById(id)
  if (!row) return fail(c, 404, 'not_found', 'Anime not found')

  const [map, eps] = await Promise.all([
    genresByAnime([id]),
    db.select().from(episodes).where(eq(episodes.animeId, id)).orderBy(asc(episodes.number)),
  ])

  return c.json({ data: { ...toAnime(row, map.get(id) ?? []), episodes: eps } })
})

animeRoutes.get('/:id/episodes', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) return fail(c, 400, 'bad_id', 'Invalid anime id')
  const eps = await db
    .select()
    .from(episodes)
    .where(eq(episodes.animeId, id))
    .orderBy(asc(episodes.number))
  return c.json({ data: eps })
})
