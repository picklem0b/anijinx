import { eq } from 'drizzle-orm'
import type { Context, MiddlewareHandler } from 'hono'
import { db } from '../db/client'
import { devices } from '../db/schema'

export type DeviceEnv = { Variables: { deviceId: string } }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Anonymous device identity — no auth. The client generates a uuid once and
 * sends it as `x-device-id`. Rows can be re-owned by a user later.
 */
export const deviceMiddleware: MiddlewareHandler<DeviceEnv> = async (c, next) => {
  const header = c.req.header('x-device-id')
  if (!header || !UUID.test(header)) {
    return c.json({ error: { code: 'missing_device', message: 'x-device-id required' } }, 401)
  }

  const id = header.toLowerCase()
  await db.insert(devices).values({ id }).onConflictDoNothing()
  await db.update(devices).set({ lastSeenAt: new Date() }).where(eq(devices.id, id))

  c.set('deviceId', id)
  await next()
}

export const deviceId = (c: Context<DeviceEnv>) => c.get('deviceId')
