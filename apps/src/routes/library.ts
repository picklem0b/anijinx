import { zValidator } from '@hono/zod-validator'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { listKeySchema } from '@workspace/shared/schemas'
import { db } from '../db/client'
import { anime, libraryEntries } from '../db/schema'
import { toAnime } from '../db/mappers'
import { genresByAnime } from '../db/queries/anime'
import { deviceId, type DeviceEnv } from '../middleware/device'
import { fail } from '../middleware/error'

export const libraryRoutes = new Hono<DeviceEnv>()

libraryRoutes.get('/:list', async (c) => {
  const parsed = listKeySchema.safeParse(c.req.param('list'))
  if (!parsed.success) return fail(c, 400, 'bad_list', 'Unknown list')

  const rows = await db
    .select({ anime })
    .from(libraryEntries)
    .innerJoin(anime, eq(anime.id, libraryEntries.animeId))
    .where(and(eq(libraryEntries.deviceId, deviceId(c)), eq(libraryEntries.list, parsed.data)))
    .orderBy(desc(libraryEntries.createdAt))

  const list = rows.map((r) => r.anime)
  const map = await genresByAnime(list.map((a) => a.id))
  return c.json({ data: list.map((a) => toAnime(a, map.get(a.id) ?? [])) })
})

const toggleBody = z.object({ animeId: z.number().int().positive(), on: z.boolean() })

libraryRoutes.put('/:list', zValidator('json', toggleBody), async (c) => {
  const parsed = listKeySchema.safeParse(c.req.param('list'))
  if (!parsed.success) return fail(c, 400, 'bad_list', 'Unknown list')

  const { animeId, on } = c.req.valid('json')
  const device = deviceId(c)

  if (on) {
    await db
      .insert(libraryEntries)
      .values({ deviceId: device, animeId, list: parsed.data })
      .onConflictDoNothing()
  } else {
    await db
      .delete(libraryEntries)
      .where(
        and(
          eq(libraryEntries.deviceId, device),
          eq(libraryEntries.animeId, animeId),
          eq(libraryEntries.list, parsed.data),
        ),
      )
  }
  return c.json({ data: { animeId, list: parsed.data, on } })
})
