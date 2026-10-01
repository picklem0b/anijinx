import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, Play, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatOf, plain, scoreOf, titleOf } from '@/lib/format'
import type { Anime } from '@/lib/types'
import { LibButton } from './Actions'

export function Hero({ items }: { items: Anime[] | null }) {
  const [index, setIndex] = useState(0)
  const slides = items?.filter((a) => a.bannerImage).slice(0, 6) ?? []

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => setIndex((n) => (n + 1) % slides.length), 7000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!items) return <div className="h-[78vh] min-h-[480px] animate-pulse bg-white/5" />
  const a = slides[index]
  if (!a) return null
  const score = scoreOf(a)

  return (
    <section className="relative h-[78vh] min-h-[480px] overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={a.id}
          src={a.bannerImage ?? a.coverImage.extraLarge}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090d]/90 via-[#09090d]/30 to-transparent" />
      <AnimatePresence mode="wait">
        <motion.div
          key={a.id}
          className="absolute bottom-16 left-4 right-4 max-w-2xl md:bottom-24 md:left-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="rounded-full bg-violet-500/90 px-3 py-1 text-xs font-semibold">Trending #{index + 1}</span>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">{titleOf(a)}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
            {score && (
              <span className="flex items-center gap-1 font-semibold text-white">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {score}
              </span>
            )}
            <span>{formatOf(a)}</span>
            {a.seasonYear && <span>{a.seasonYear}</span>}
            <span>{a.genres.slice(0, 3).join(' · ')}</span>
          </div>
          <p className="mt-3 line-clamp-3 max-w-xl text-sm text-white/70 md:text-base">{plain(a.description)}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to={`/watch/${a.id}/1`} className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-500 px-6 text-sm font-semibold transition hover:bg-violet-400">
              <Play className="h-4 w-4 fill-current" />
              Watch S1 EP1
            </Link>
            <Link to={`/anime/${a.id}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 text-sm font-medium backdrop-blur transition hover:bg-white/20">
              <Info className="h-4 w-4" />
              Details
            </Link>
            <LibButton id={a.id} list="watchlist" variant="icon" className="h-11 w-11" />
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6 right-4 flex gap-1.5 md:bottom-10 md:right-10">
        {slides.map((s, i) => (
          <button key={s.id} aria-label={`Show slide ${i + 1}`} onClick={() => setIndex(i)} className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-8 bg-white' : 'w-3 bg-white/30')} />
        ))}
      </div>
    </section>
  )
}
