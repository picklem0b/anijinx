import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { Hono } from 'hono'
import { commentInputSchema } from '@workspace/shared/schemas'
import { db } from '../db/client'
import { comments } from '../db/schema'
import { deviceId, type DeviceEnv } from '../middleware/device'
import { fail } from '../middleware/error'

export const commentRoutes = new Hono<DeviceEnv>()

commentRoutes.get('/', async (c) => {
  const animeId = Number(c.req.query('animeId'))
  if (!Number.isInteger(animeId)) return fail(c, 400, 'bad_id', 'animeId required')

  const ep = c.req.query('episode')
  const episodeNumber = ep ? Number(ep) : null

  const rows = await db
    .select()
    .from(comments)
    .where(
      and(
        eq(comments.animeId, animeId),
        episodeNumber == null ? isNull(comments.episodeNumber) : eq(comments.episodeNumber, episodeNumber),
      ),
    )
    .orderBy(desc(comments.createdAt))
    .limit(100)

  return c.json({ data: rows })
})

commentRoutes.post('/', zValidator('json', commentInputSchema), async (c) => {
  const body = c.req.valid('json')
  const [row] = await db
    .insert(comments)
    .values({
      deviceId: deviceId(c),
      animeId: body.animeId,
      episodeNumber: body.episode,
      body: body.body,
    })
    .returning()
  return c.json({ data: row }, 201)
})

commentRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) return fail(c, 400, 'bad_id', 'Invalid comment id')

  const deleted = await db
    .delete(comments)
    .where(and(eq(comments.id, id), eq(comments.deviceId, deviceId(c))))
    .returning()

  if (!deleted.length) return fail(c, 404, 'not_found', 'Comment not found')
  return c.json({ data: deleted[0] })
})
