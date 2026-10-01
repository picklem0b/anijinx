import { Link, useParams } from 'react-router-dom'
import { Play, Star } from 'lucide-react'
import { LibButton, Stars } from '@/components/anime/Actions'
import { Comments } from '@/components/anime/Comments'
import { Shelf } from '@/components/anime/Shelf'
import { ErrorState } from '@/components/anime/State'
import { useFetch } from '@/hooks/useFetch'
import { getAnime } from '@/lib/anilist'
import { countdown, epCount, formatOf, plain, scoreOf, streamEp, titleOf } from '@/lib/format'
import type { Anime } from '@/lib/types'

export default function DetailPage() {
  const { id } = useParams()
  const { data: a, error } = useFetch(() => getAnime(Number(id)), [id])

  if (error) return <ErrorState text={error} />
  if (!a) return <div className="h-screen animate-pulse bg-white/5" />

  const score = scoreOf(a)
  const total = epCount(a)
  const unreleased = a.status === 'NOT_YET_RELEASED'
  const related = a.recommendations.nodes.map((n) => n.mediaRecommendation).filter((r): r is Anime => !!r)
  const meta = [formatOf(a), a.episodes ? `${a.episodes} eps` : null, a.duration ? `${a.duration} min` : null, a.season && a.seasonYear ? `${a.season.toLowerCase()} ${a.seasonYear}` : null, a.studios.nodes[0]?.name].filter(Boolean)

  return (
    <div>
      <div className="relative h-[46vh] min-h-[320px] overflow-hidden">
        <img src={a.bannerImage ?? a.coverImage.extraLarge} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/50 to-black/30" />
      </div>
      <div className="relative -mt-44 flex flex-col gap-8 px-4 md:flex-row md:px-10">
        <img src={a.coverImage.extraLarge} alt={titleOf(a)} className="aspect-[2/3] w-44 shrink-0 rounded-2xl object-cover shadow-2xl md:w-64" />
        <div className="min-w-0 flex-1 md:pt-28">
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">{titleOf(a)}</h1>
          {a.title.english && a.title.english !== a.title.romaji && <p className="mt-1 text-white/50">{a.title.romaji}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
            {score && (
              <span className="flex items-center gap-1 text-base font-semibold text-white">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {score}
              </span>
            )}
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {a.genres.map((g) => (
              <Link key={g} to={`/browse?genre=${encodeURIComponent(g)}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10">
                {g}
              </Link>
            ))}
          </div>
          {a.nextAiringEpisode && (
            <p className="mt-4 text-sm text-violet-300">
              Episode {a.nextAiringEpisode.episode} airs in {countdown(a.nextAiringEpisode.airingAt)}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to={`/watch/${a.id}/1`} className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-500 px-6 text-sm font-semibold transition hover:bg-violet-400">
              <Play className="h-4 w-4 fill-current" />
              {unreleased ? 'Watch trailer' : 'Watch S1 EP1'}
            </Link>
            <LibButton id={a.id} list="watchlist" />
            <LibButton id={a.id} list="liked" />
            {(unreleased || a.nextAiringEpisode) && <LibButton id={a.id} list="reminders" />}
          </div>
          <div className="mt-5">
            <p className="mb-1 text-xs text-white/50">Your rating</p>
            <Stars id={a.id} />
          </div>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-white/75">{plain(a.description)}</p>
        </div>
      </div>
      {total > 0 && (
        <section className="mt-12 px-4 md:px-10">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight">Episodes</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: Math.min(total, 200) }, (_, i) => i + 1).map((n) => (
              <Link key={n} to={`/watch/${a.id}/${n}`} className="group relative aspect-video overflow-hidden rounded-xl bg-white/5">
                <img loading="lazy" src={streamEp(a, n)?.thumbnail ?? a.coverImage.large} alt="" className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                <span className="absolute bottom-2 left-2.5 text-sm font-semibold drop-shadow">EP {n}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="mt-12 max-w-3xl px-4 md:px-10">
        <Comments id={a.id} />
      </section>
      {related.length > 0 && (
        <div className="mt-12">
          <Shelf title="More like this" items={related} />
        </div>
      )}
    </div>
  )
}
