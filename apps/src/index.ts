import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { env } from './env'
import { errorHandler } from './middleware/error'
import { deviceMiddleware, type DeviceEnv } from './middleware/device'
import { animeRoutes } from './routes/anime'
import { commentRoutes } from './routes/comments'
import { genreRoutes } from './routes/genres'
import { healthRoutes } from './routes/health'
import { homeRoutes } from './routes/home'
import { libraryRoutes } from './routes/library'
import { playbackRoutes } from './routes/playback'
import { progressRoutes } from './routes/progress'
import { ratingRoutes } from './routes/ratings'

const app = new Hono<DeviceEnv>()

app.use(logger())
app.use(cors({ origin: env.CORS_ORIGIN, allowHeaders: ['Content-Type', 'x-device-id'] }))
app.onError(errorHandler)

app.route('/v1/health', healthRoutes)
app.route('/v1', homeRoutes)
app.route('/v1/genres', genreRoutes)
app.route('/v1/anime', animeRoutes)
app.route('/v1/playback', playbackRoutes)

// Everything below needs an anonymous device identity — still no auth.
const scoped = new Hono<DeviceEnv>()
scoped.use('*', deviceMiddleware)
scoped.route('/library', libraryRoutes)
scoped.route('/progress', progressRoutes)
scoped.route('/ratings', ratingRoutes)
scoped.route('/comments', commentRoutes)
app.route('/v1', scoped)

app.notFound((c) => c.json({ error: { code: 'not_found', message: 'Unknown route' } }, 404))

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`AniJinx API listening on http://localhost:${info.port}`)
})
