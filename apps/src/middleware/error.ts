import type { Context, ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function fail(c: Context, status: number, code: string, message: string) {
  return c.json({ error: { code, message } }, status as never)
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      { error: { code: 'http_error', message: err.message } },
      err.status,
    )
  }
  console.error(err)
  return c.json({ error: { code: 'internal_error', message: 'Something went wrong' } }, 500)
}
