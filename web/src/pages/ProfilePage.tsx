import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { getByIds } from '@/lib/anilist'
import { ago } from '@/lib/format'
import { useFetch } from '@/hooks/useFetch'
import { useLibrary } from '@/lib/store'
import { AnimeCard } from '@/components/anime/AnimeCard'
import { Stagger, StaggerItem } from '@/components/marketing/Reveal'

export default function ProfilePage() {
  const liked = useLibrary((s) => s.liked)
  const watchlist = useLibrary((s) => s.watchlist)
  const ratings = useLibrary((s) => s.ratings)
  const progress = useLibrary((s) => s.progress)

  const recentIds = Object.values(progress)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((p) => p.animeId)
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .slice(0, 12)
  const { data: recent } = useFetch(() => getByIds(recentIds), [recentIds.join(',')])

  const latest = Object.values(progress).sort((a, b) => b.updatedAt - a.updatedAt)[0]
  const minutes = Math.round(
    Object.values(progress).reduce((sum, p) => sum + p.positionSeconds, 0) / 60,
  )

  const stats = [
    ['Watchlist', watchlist.length],
    ['Liked', liked.length],
    ['Rated', Object.keys(ratings).length],
    ['Minutes', minutes],
  ] as const

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center"
      >
        <img
          src="https://api.dicebear.com/9.x/thumbs/svg?seed=anijinx"
          alt="Your avatar"
          className="h-24 w-24 rounded-full ring-2 ring-violet-500"
        />
        <div>
          <h1 className="text-2xl font-black tracking-tight">AniJinx Viewer</h1>
          <p className="text-sm text-white/45">Local profile · no account yet</p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/settings"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            to="/sign-in"
            className="inline-flex h-11 items-center rounded-full bg-white/10 px-6 text-sm font-medium transition hover:bg-white/20"
          >
            Sign in
          </Link>
        </div>
      </motion.div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Recent activity
          {latest && (
            <span className="ml-2 text-sm font-normal text-white/40">
              last watched {ago(latest.updatedAt)}
            </span>
          )}
        </h2>

        {recent && recent.length > 0 ? (
          <Stagger className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 no-scrollbar">
            {recent.map((a) => (
              <StaggerItem key={a.id}>
                <AnimeCard a={a} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="mt-3 text-sm text-white/40">
            Watch something and it will show up here.
          </p>
        )}
      </section>

      <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['/about', 'About us'],
          ['/pricing', 'Plans & pricing'],
          ['/help', 'Help centre'],
          ['/legal', 'Terms & privacy'],
        ].map(([to, label]) => (
          <Link
            key={to}
            to={to}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-medium transition hover:border-violet-400/40 hover:bg-white/[0.06]"
          >
            {label}
          </Link>
        ))}
      </section>
    </div>
  )
}
