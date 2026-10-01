import { zValidator } from '@hono/zod-validator'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { progressInputSchema } from '@workspace/shared/schemas'
import { db } from '../db/client'
import { episodes, watchProgress } from '../db/schema'
import { deviceId, type DeviceEnv } from '../middleware/device'
import { fail } from '../middleware/error'

export const progressRoutes = new Hono<DeviceEnv>()

progressRoutes.get('/', async (c) => {
  const rows = await db
    .select()
    .from(watchProgress)
    .where(eq(watchProgress.deviceId, deviceId(c)))
    .orderBy(desc(watchProgress.updatedAt))
    .limit(50)
  return c.json({ data: rows })
})

/** Upsert by (device, episode). Body carries animeId + episode number. */
progressRoutes.put('/', zValidator('json', progressInputSchema), async (c) => {
  const body = c.req.valid('json')
  const device = deviceId(c)

  const [match] = await db
    .select()
    .from(episodes)
    .where(and(eq(episodes.animeId, body.animeId), eq(episodes.number, body.episode)))
    .limit(1)

  if (!match) return fail(c, 404, 'no_episode', 'Episode not found for this title')

  const completed = body.durationSeconds > 0 && body.positionSeconds / body.durationSeconds > 0.95

  const [row] = await db
    .insert(watchProgress)
    .values({
      deviceId: device,
      episodeId: match.id,
      positionSeconds: Math.floor(body.positionSeconds),
      durationSeconds: Math.floor(body.durationSeconds),
      completed,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [watchProgress.deviceId, watchProgress.episodeId],
      set: {
        positionSeconds: Math.floor(body.positionSeconds),
        durationSeconds: Math.floor(body.durationSeconds),
        completed,
        updatedAt: new Date(),
      },
    })
    .returning()

  return c.json({ data: row })
})
