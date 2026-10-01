import { Hono } from 'hono'
import { db } from '../db/client'
import { genres } from '../db/schema'
import { asc } from 'drizzle-orm'

export const genreRoutes = new Hono()

genreRoutes.get('/', async (c) => {
  const rows = await db.select().from(genres).orderBy(asc(genres.name))
  return c.json({ data: rows })
})
