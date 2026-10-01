import type { Anime, AnimeDetail, Trailer } from './types'

export const titleOf = (a: Anime) => a.title.english ?? a.title.romaji

/**
 * Keeps the first occurrence of each id. AniList's popularity/trending sorts are
 * not stable across pages, so a later page can re-return an item an earlier page
 * already gave us. Deduping here keeps list keys unique.
 */
export function uniqueById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>()
  const out: T[] = []
  for (const item of items) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    out.push(item)
  }
  return out
}

export const scoreOf = (a: Anime) => (a.averageScore ? (a.averageScore / 10).toFixed(1) : null)

export const plain = (s: string | null) =>
  (s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim()

export const formatOf = (a: Anime) => (a.format ? a.format.replace('_', ' ') : 'Anime')

export function countdown(at: number) {
  const ms = at * 1000 - Date.now()
  if (ms <= 0) return 'Airing now'
  const d = Math.floor(ms / 864e5)
  const h = Math.floor((ms % 864e5) / 36e5)
  const m = Math.floor((ms % 36e5) / 6e4)
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Hermes (Android) ships without `Intl`, so `toLocaleDateString` and
 * `Intl.RelativeTimeFormat` are both undefined there. These helpers are pure
 * JS so they behave the same on web, iOS and Android.
 */
export function releaseLabel(a: Anime) {
  if (a.nextAiringEpisode)
    return `EP ${a.nextAiringEpisode.episode} in ${countdown(a.nextAiringEpisode.airingAt)}`
  const { year, month, day } = a.startDate
  if (!year) return 'Date TBA'
  if (!month) return String(year)
  const m = MONTHS[month - 1] ?? String(month)
  return day ? `${m} ${day}, ${year}` : `${m} ${year}`
}

const UNITS: { unit: 'day' | 'hour' | 'minute'; size: number }[] = [
  { unit: 'day', size: 86400 },
  { unit: 'hour', size: 3600 },
  { unit: 'minute', size: 60 },
]

export function ago(ts: number) {
  const seconds = Math.round((ts - Date.now()) / 1000)
  const past = seconds < 0
  const abs = Math.abs(seconds)

  if (abs < 60) return 'just now'

  for (const { unit, size } of UNITS) {
    if (abs >= size) {
      const n = Math.round(abs / size)
      const noun = `${unit}${n === 1 ? '' : 's'}`
      return past ? `${n} ${noun} ago` : `in ${n} ${noun}`
    }
  }
  return 'just now'
}

export function epCount(a: AnimeDetail) {
  return a.episodes ?? (a.nextAiringEpisode ? a.nextAiringEpisode.episode - 1 : 0)
}

export function streamEp(a: AnimeDetail, n: number) {
  return a.streamingEpisodes.find((e) => new RegExp(`^Episode ${n}\\b`, 'i').test(e.title))
}

/** Runtime in minutes → "1h 24m" */
export function runtimeOf(a: Anime) {
  if (!a.duration) return null
  const total = a.duration * (a.episodes ?? 1)
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

/** 12345 → "12.3K" */
export function compact(n: number | null) {
  if (!n) return null
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`
  return `${(n / 1_000_000).toFixed(1)}M`
}

export function trailerEmbed(t: Trailer, muted: boolean, controls: boolean) {
  const m = muted ? 1 : 0
  const c = controls ? 1 : 0
  if (t.site === 'youtube') {
    return `https://www.youtube.com/embed/${t.id}?autoplay=1&mute=${m}&controls=${c}&loop=1&playlist=${t.id}&playsinline=1&modestbranding=1&rel=0`
  }
  return `https://www.dailymotion.com/embed/video/${t.id}?autoplay=1&mute=${m}&controls=${controls}`
}

export function trailerThumb(t: Trailer) {
  if (t.site === 'youtube') return `https://i.ytimg.com/vi/${t.id}/maxresdefault.jpg`
  return `https://www.dailymotion.com/thumbnail/video/${t.id}`
}
