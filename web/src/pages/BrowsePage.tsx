import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimeCard } from '@/components/anime/AnimeCard'
import { FilterBar } from '@/components/anime/FilterBar'
import { searchAnime } from '@/lib/anilist'
import type { Anime, Filters } from '@/lib/types'

function read(p: URLSearchParams): Filters {
  return {
    q: p.get('q') ?? '',
    genres: p.getAll('genre'),
    year: p.get('year') ?? '',
    season: p.get('season') ?? '',
    format: p.get('format') ?? '',
    status: p.get('status') ?? '',
    sort: p.get('sort') ?? '',
  }
}

export default function BrowsePage() {
  const [params, setParams] = useSearchParams()
  const filters = read(params)
  const key = params.toString()
  const [pg, setPg] = useState({ key, page: 1 })
  const page = pg.key === key ? pg.page : 1
  const [items, setItems] = useState<Anime[]>([])
  const [more, setMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    const timer = setTimeout(() => {
      searchAnime(read(new URLSearchParams(key)), page)
        .then((r) => {
          if (!alive) return
          setItems((prev) => (page === 1 ? r.media : [...prev, ...r.media]))
          setMore(r.hasNext)
          setLoading(false)
        })
        .catch((e: Error) => {
          if (!alive) return
          setError(e.message)
          setLoading(false)
        })
    }, 250)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [key, page])

  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  const toggleGenre = (genre: string) => {
    const next = new URLSearchParams(params)
    const current = next.getAll('genre')
    next.delete('genre')
    ;(current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre]).forEach((g) => next.append('genre', g))
    setParams(next, { replace: true })
  }

  return (
    <div className="px-4 pt-24 md:px-10">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">{filters.q ? `Results for “${filters.q}”` : 'Browse'}</h1>
      <FilterBar filters={filters} active={key.length > 0} onChange={update} onGenre={toggleGenre} onReset={() => setParams({})} />
      {error && <p className="mt-10 text-center text-white/60">{error}</p>}
      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((a) => (
          <AnimeCard key={a.id} a={a} className="w-full" />
        ))}
        {loading && Array.from({ length: 12 }, (_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />)}
      </div>
      {!loading && !error && items.length === 0 && <p className="mt-16 text-center text-white/50">No anime match these filters.</p>}
      {!loading && more && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => setPg({ key, page: page + 1 })} className="rounded-full border border-white/10 bg-white/5 px-8 py-2.5 text-sm font-medium hover:bg-white/10">
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
