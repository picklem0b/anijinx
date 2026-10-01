import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LibButton, Stars } from '@/components/anime/Actions'
import { Comments } from '@/components/anime/Comments'
import { ErrorState } from '@/components/anime/State'
import { useFetch } from '@/hooks/useFetch'
import { getAnime } from '@/lib/anilist'
import { epCount, streamEp, titleOf } from '@/lib/format'
import { officialLinks, resolvePlayback } from '@/lib/sources'

export default function WatchPage() {
  const { id, ep } = useParams()
  const n = Math.max(1, Number(ep) || 1)
  const { data: a, error } = useFetch(() => getAnime(Number(id)), [id])

  if (error) return <ErrorState text={error} />
  if (!a) return <div className="mx-4 mt-24 aspect-video animate-pulse rounded-2xl bg-white/5 md:mx-10" />

  const source = resolvePlayback(a, n)
  const total = epCount(a)
  const current = streamEp(a, n)
  const official = officialLinks(a, n)
  const nav = 'inline-flex h-10 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm hover:bg-white/10'

  return (
    <div className="grid gap-6 px-4 pt-20 md:px-10 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0">
        {source && (
          <p className="mb-2 flex items-center gap-2 text-xs text-white/50">
            <span className={cn('inline-block h-1.5 w-1.5 rounded-full', source.isEpisode ? 'bg-emerald-400' : 'bg-amber-400')} />
            {source.label}
          </p>
        )}
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          {source?.kind === 'trailer' && <iframe key={source.url} src={source.url} title={titleOf(a)} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full" />}
          {(source?.kind === 'hls' || source?.kind === 'file') && <video key={source.url} src={source.url} controls autoPlay playsInline className="h-full w-full" />}
          {!source && (
            <div className="relative grid h-full place-items-center">
              <img src={a.bannerImage ?? a.coverImage.extraLarge} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              <p className="relative text-white/70">No video available for this title yet.</p>
            </div>
          )}
        </div>
        {source && !source.isEpisode && official.length === 0 && (
          <p className="mt-2 text-xs text-amber-300/80">
            No licensed stream is connected for this title yet, so only the trailer can play here.
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link to={`/anime/${a.id}`} className="text-sm text-violet-300 hover:text-violet-200">
              {titleOf(a)}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              S1 · EP {n}
              {current && <span className="ml-2 text-lg font-medium text-white/60">{current.title.replace(/^Episode \d+\s*-?\s*/i, '')}</span>}
            </h1>
          </div>
          <div className="flex gap-2">
            {n > 1 && (
              <Link to={`/watch/${a.id}/${n - 1}`} className={nav}>
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Link>
            )}
            {n < total && (
              <Link to={`/watch/${a.id}/${n + 1}`} className={nav}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <LibButton id={a.id} list="liked" />
          <LibButton id={a.id} list="watchlist" />
          <Stars id={a.id} />
        </div>
        {official.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-medium">
              {source?.isEpisode ? 'Also available on' : 'Watch the full episode on'}
            </p>
            <div className="flex flex-wrap gap-2">
              {official.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black hover:bg-white/90">
                  {l.site}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 max-w-3xl">
          <Comments id={a.id} ep={n} />
        </div>
      </div>
      {total > 0 && (
        <aside className="lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
          <div className="space-y-2">
            {Array.from({ length: Math.min(total, 200) }, (_, i) => i + 1).map((e) => (
              <Link key={e} to={`/watch/${a.id}/${e}`} className={cn('flex items-center gap-3 rounded-xl border p-2 transition', e === n ? 'border-violet-400 bg-violet-500/15' : 'border-transparent bg-white/5 hover:bg-white/10')}>
                <img loading="lazy" src={streamEp(a, e)?.thumbnail ?? a.coverImage.large} alt="" className="aspect-video w-28 rounded-lg object-cover" />
                <span className="text-sm font-medium">Episode {e}</span>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  )
}
