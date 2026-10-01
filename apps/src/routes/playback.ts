import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/client'
import { episodes, videoAssets } from '../db/schema'
import { fail } from '../middleware/error'

export const playbackRoutes = new Hono()

const MUX_STREAM = 'https://stream.mux.com'

/**
 * Builds a URL a native player can load from a `video_assets` row.
 *
 * - `mux`  → playbackId is a Mux playback id; we build the HLS manifest URL.
 * - `hls`  → playbackId IS the manifest URL (self-hosted).
 * - `file` → playbackId IS the direct file URL.
 *
 * Nothing here scrapes anything: a row only exists when we host or license the
 * asset ourselves. If an episode has no ready asset we return 404 and the client
 * falls back to the (clearly labelled) trailer.
 */
function sourceFromAsset(asset: { provider: string; playbackId: string | null }) {
  if (!asset.playbackId) return null
  if (asset.provider === 'mux') return `${MUX_STREAM}/${asset.playbackId}.m3u8`
  return asset.playbackId
}

playbackRoutes.get('/:animeId/:episode', async (c) => {
  const animeId = Number(c.req.param('animeId'))
  const episode = Number(c.req.param('episode'))
  if (!Number.isInteger(animeId) || !Number.isInteger(episode)) {
    return fail(c, 400, 'bad_id', 'Invalid anime id or episode')
  }

  const [row] = await db
    .select({ asset: videoAssets })
    .from(episodes)
    .leftJoin(videoAssets, eq(episodes.videoAssetId, videoAssets.id))
    .where(and(eq(episodes.animeId, animeId), eq(episodes.number, episode)))
    .limit(1)

  if (!row) return fail(c, 404, 'no_episode', 'Episode not found')

  const asset = row.asset
  const url = asset ? sourceFromAsset(asset) : null
  if (!asset || asset.status !== 'ready' || !url) {
    return fail(c, 404, 'no_asset', 'No licensed stream for this episode yet')
  }

  return c.json({
    data: {
      url,
      kind: url.includes('.m3u8') ? 'hls' : 'file',
      provider: asset.provider,
      durationSeconds: asset.durationSeconds,
      aspectRatio: asset.aspectRatio,
    },
  })
})
