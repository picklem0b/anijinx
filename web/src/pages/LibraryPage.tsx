import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Bookmark, Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimeCard, UpcomingCard } from '@/components/anime/AnimeCard'
import { useFetch } from '@/hooks/useFetch'
import { getByIds } from '@/lib/anilist'
import { useLibrary } from '@/lib/store'

const tabs = [
  { key: 'watchlist', label: 'Watchlist', icon: Bookmark },
  { key: 'liked', label: 'Liked', icon: Heart },
  { key: 'reminders', label: 'Reminders', icon: Bell },
  { key: 'rated', label: 'Rated', icon: Star },
] as const

type Tab = (typeof tabs)[number]['key']

export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>('watchlist')
  const lib = useLibrary()
  const lists: Record<Tab, number[]> = { watchlist: lib.watchlist, liked: lib.liked, reminders: lib.reminders, rated: Object.keys(lib.ratings).map(Number) }
  const ids = lists[tab]
  const { data, error } = useFetch(() => getByIds(ids), [ids.join(',')])

  return (
    <div className="px-4 pt-24 md:px-10">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Library</h1>
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={cn('flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition', tab === key ? 'border-violet-400 bg-violet-500/20 text-violet-100' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10')}>
            <Icon className="h-4 w-4" />
            {label}
            <span className="text-white/40">{lists[key].length}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-white/60">{error}</p>}
      {ids.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-white/60">Nothing here yet.</p>
          <Link to="/browse" className="mt-4 inline-flex h-10 items-center rounded-full bg-violet-500 px-6 text-sm font-semibold hover:bg-violet-400">
            Find something to watch
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data
            ? data.map((a) => (tab === 'reminders' ? <UpcomingCard key={a.id} a={a} className="w-full" /> : <AnimeCard key={a.id} a={a} className="w-full" />))
            : ids.map((id) => <div key={id} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />)}
        </div>
      )}
    </div>
  )
}
