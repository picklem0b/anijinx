import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Anime } from '@/lib/types'
import { AnimeCard, UpcomingCard } from './AnimeCard'

interface ShelfProps {
  title: string
  subtitle?: string
  items: Anime[] | null
  upcoming?: boolean
  to?: string
}

export function Shelf({ title, subtitle, items, upcoming = false, to }: ShelfProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' })
  const arrow = 'absolute top-1/3 z-10 hidden h-10 w-10 place-items-center rounded-full bg-black/70 opacity-0 backdrop-blur transition group-hover/shelf:opacity-100 md:grid'

  return (
    <section className="px-4 md:px-10">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="text-sm text-violet-300 hover:text-violet-200">
            See all
          </Link>
        )}
      </div>
      <div className="group/shelf relative">
        <button aria-label="Scroll left" onClick={() => scroll(-1)} className={`${arrow} -left-4`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button aria-label="Scroll right" onClick={() => scroll(1)} className={`${arrow} -right-4`}>
          <ChevronRight className="h-5 w-5" />
        </button>
        <div ref={ref} className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth pb-2">
          {items
            ? items.map((a) => (upcoming ? <UpcomingCard key={a.id} a={a} /> : <AnimeCard key={a.id} a={a} />))
            : Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-[2/3] w-36 shrink-0 animate-pulse rounded-xl bg-white/5 sm:w-44" />)}
        </div>
      </div>
    </section>
  )
}
