import { Hono } from 'hono'
import { sql } from 'drizzle-orm'
import { db } from '../db/client'

export const healthRoutes = new Hono()

healthRoutes.get('/', async (c) => {
  try {
    await db.execute(sql`select 1`)
    return c.json({ data: { status: 'ok', db: 'up' } })
  } catch {
    return c.json({ data: { status: 'degraded', db: 'down' } }, 503)
  }
})
