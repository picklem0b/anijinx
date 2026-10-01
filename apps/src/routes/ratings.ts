import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { ratingInputSchema } from '@workspace/shared/schemas'
import { db } from '../db/client'
import { ratings } from '../db/schema'
import { deviceId, type DeviceEnv } from '../middleware/device'
import { fail } from '../middleware/error'

export const ratingRoutes = new Hono<DeviceEnv>()

ratingRoutes.get('/', async (c) => {
  const rows = await db.select().from(ratings).where(eq(ratings.deviceId, deviceId(c)))
  return c.json({ data: rows })
})

ratingRoutes.put('/:animeId', zValidator('json', ratingInputSchema), async (c) => {
  const animeId = Number(c.req.param('animeId'))
  if (!Number.isInteger(animeId)) return fail(c, 400, 'bad_id', 'Invalid anime id')
  const { value } = c.req.valid('json')

  const [row] = await db
    .insert(ratings)
    .values({ deviceId: deviceId(c), animeId, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [ratings.deviceId, ratings.animeId],
      set: { value, updatedAt: new Date() },
    })
    .returning()

  return c.json({ data: row })
})
