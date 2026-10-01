import { Hono } from 'hono'
import { getDiscover, getHomeRails } from '../db/queries/home'

export const homeRoutes = new Hono()

homeRoutes.get('/home', async (c) => c.json({ data: { rails: await getHomeRails() } }))

homeRoutes.get('/discover', async (c) => c.json({ data: await getDiscover() }))
