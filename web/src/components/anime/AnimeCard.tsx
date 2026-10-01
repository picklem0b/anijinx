import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatOf, releaseLabel, scoreOf, titleOf } from '@/lib/format'
import type { Anime } from '@/lib/types'
import { LibButton } from './Actions'

export function AnimeCard({ a, className }: { a: Anime; className?: string }) {
  const score = scoreOf(a)
  return (
    <div className={cn('group relative w-36 shrink-0 snap-start sm:w-44', className)}>
      <Link to={`/anime/${a.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5" style={{ backgroundColor: a.coverImage.color ?? undefined }}>
          <img loading="lazy" src={a.coverImage.large} alt={titleOf(a)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {score && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold backdrop-blur">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {score}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug">{titleOf(a)}</p>
        <p className="text-xs text-white/50">
          {formatOf(a)} · {a.episodes ?? '?'} eps
        </p>
      </Link>
      <LibButton id={a.id} list="watchlist" variant="icon" className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100" />
    </div>
  )
}

export function UpcomingCard({ a, className }: { a: Anime; className?: string }) {
  return (
    <div className={cn('group relative w-40 shrink-0 snap-start sm:w-48', className)}>
      <Link to={`/anime/${a.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5" style={{ backgroundColor: a.coverImage.color ?? undefined }}>
          <img loading="lazy" src={a.coverImage.large} alt={titleOf(a)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5 pt-10">
            <span className="text-xs font-semibold text-violet-300">{releaseLabel(a)}</span>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug">{titleOf(a)}</p>
      </Link>
      <LibButton id={a.id} list="reminders" variant="icon" className="absolute right-2 top-2" />
    </div>
  )
}
