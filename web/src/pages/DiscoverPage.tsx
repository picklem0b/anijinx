import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, CalendarClock, TrendingUp } from 'lucide-react'
import { getAiring, getHome, getRecommendations } from '@/lib/anilist'
import { GENRES, SEASONS } from '@/lib/options'
import { ago, titleOf } from '@/lib/format'
import type { Anime } from '@/lib/types'
import { useFetch } from '@/hooks/useFetch'
import { useLibrary } from '@/lib/store'
import { Shelf } from '@/components/anime/Shelf'
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { cn } from '@/lib/utils'

const currentSeason = () => {
  const m = new Date().getMonth()
  return m < 3 ? 'WINTER' : m < 6 ? 'SPRING' : m < 9 ? 'SUMMER' : 'FALL'
}

const QUICK = [
  { icon: TrendingUp, label: 'Top rated', to: '/browse?sort=SCORE_DESC' },
  { icon: CalendarDays, label: 'Airing now', to: '/browse?status=RELEASING' },
  { icon: CalendarClock, label: 'Upcoming', to: '/browse?status=NOT_YET_RELEASED' },
]

export default function DiscoverPage() {
  const liked = useLibrary((s) => s.liked)
  const [season, setSeason] = useState(currentSeason())

  const home = useFetch(getHome, [])
  const airing = useFetch(getAiring, [])
  const recs = useFetch(() => getRecommendations(liked), [liked])

  const seasonal = useMemo(() => {
    const items: Anime[] = home.data?.popular ?? []
    return items.filter((a) => a.season === season).slice(0, 20)
  }, [home.data, season])

  const airingItems = airing.data ?? []

  return (
    <div className="pb-16 pt-24">
      <header className="px-4 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-black tracking-tight md:text-4xl"
        >
          Discover
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="mt-2 text-sm text-white/55"
        >
          Personalized rails, seasons and what airs next.
        </motion.p>

        <Stagger className="mt-6 flex flex-wrap gap-2">
          {QUICK.map(({ icon: Icon, label, to }) => (
            <StaggerItem key={label}>
              <Link
                to={to}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-violet-400/50 hover:text-white"
              >
                <Icon className="h-4 w-4 text-violet-300" />
                {label}
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </header>

      {recs.data?.personal && (
        <div className="mt-8">
          <Shelf
            title="Because you liked…"
            subtitle={recs.data.genres.join(' · ')}
            items={recs.data.items}
          />
        </div>
      )}

      {!home.data && <div className="mt-8 h-56 animate-pulse rounded-2xl bg-white/5 md:mx-10" />}

      {home.data && (
        <>
          <Shelf title="Trending now" subtitle="What everyone is watching" items={home.data.trending} to="/browse" />
          <Shelf title="Popular on AniJinx" items={home.data.popular} to="/browse" />
        </>
      )}

      <section className="mt-12 px-4 md:px-10">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Browse by season</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SEASONS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setSeason(value)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                season === value
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {seasonal.length > 0 ? (
          <Shelf title={`${season} picks`} items={seasonal} />
        ) : (
          <p className="mt-6 text-sm text-white/40">
            No titles cached for this season yet.
          </p>
        )}
      </section>

      <section className="mt-12 px-4 md:px-10">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Genres</h2>
        <Stagger className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {GENRES.map((g) => (
            <StaggerItem key={g}>
              <Link
                to={`/browse?genre=${encodeURIComponent(g)}`}
                className="group relative flex h-20 items-end overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-violet-400/50"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/25 to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="relative text-sm font-semibold">{g}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {airingItems.length > 0 && (
        <section className="mt-12 px-4 md:px-10">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Airing calendar</h2>
          <div className="mt-4 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
            {airingItems.slice(0, 10).map((a, i) => (
              <Reveal key={a.id} delay={i * 0.03}>
                <Link
                  to={`/anime/${a.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition hover:bg-white/[0.04]"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{titleOf(a)}</span>
                    <span className="block text-xs text-white/45">
                      EP {a.nextAiringEpisode?.episode} ·{' '}
                      {ago((a.nextAiringEpisode?.airingAt ?? 0) * 1000)}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
