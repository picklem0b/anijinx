import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, Heart, MessageCircle, Play, Star, Volume2, VolumeX, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Comments } from '@/components/anime/Comments'
import { getReels } from '@/lib/anilist'
import { formatOf, plain, scoreOf, titleOf, trailerEmbed } from '@/lib/format'
import { useLibrary } from '@/lib/store'
import type { Anime } from '@/lib/types'

function Rail({ icon: Icon, label, active, tone, onClick }: { icon: LucideIcon; label: string; active?: boolean; tone?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} aria-pressed={active} className="flex flex-col items-center gap-1 text-xs">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-black/40 backdrop-blur transition active:scale-90">
        <Icon className={cn('h-6 w-6', active && cn('fill-current', tone))} />
      </span>
      {label}
    </button>
  )
}

interface ReelProps {
  a: Anime
  index: number
  active: boolean
  muted: boolean
  onVisible: (index: number) => void
  onMute: () => void
  onComments: () => void
}

function Reel({ a, index, active, muted, onVisible, onMute, onComments }: ReelProps) {
  const ref = useRef<HTMLElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const navigate = useNavigate()
  const liked = useLibrary((s) => s.liked.includes(a.id))
  const saved = useLibrary((s) => s.watchlist.includes(a.id))
  const comments = useLibrary((s) => s.comments[a.id]?.length ?? 0)
  const toggle = useLibrary((s) => s.toggle)
  const [burst, setBurst] = useState(false)
  const score = scoreOf(a)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && onVisible(index), { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [index, onVisible])

  const tap = () => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current)
      timer.current = undefined
      if (!liked) toggle('liked', a.id)
      setBurst(true)
      window.setTimeout(() => setBurst(false), 700)
      return
    }
    timer.current = window.setTimeout(() => {
      timer.current = undefined
      navigate(`/watch/${a.id}/1`)
    }, 260)
  }

  return (
    <section ref={ref} className="relative h-[100dvh] snap-start snap-always overflow-hidden bg-black">
      <img src={a.bannerImage ?? a.coverImage.extraLarge} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      {active && a.trailer && (
        <iframe
          key={String(muted)}
          src={trailerEmbed(a.trailer, muted, false)}
          title={titleOf(a)}
          allow="autoplay; encrypted-media"
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-full max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40" />
      <button aria-label={`Open ${titleOf(a)} season 1 episode 1`} onClick={tap} className="absolute inset-0 z-10" />
      <AnimatePresence>
        {burst && (
          <motion.div className="pointer-events-none absolute inset-0 z-20 grid place-items-center" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 1.6, opacity: 0 }}>
            <Heart className="h-24 w-24 fill-rose-500 text-rose-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-4 md:bottom-10">
        <Rail icon={Heart} label={liked ? 'Liked' : 'Like'} active={liked} tone="text-rose-500" onClick={() => toggle('liked', a.id)} />
        <Rail icon={MessageCircle} label={String(comments)} onClick={onComments} />
        <Rail icon={Bookmark} label={saved ? 'Saved' : 'Save'} active={saved} tone="text-violet-300" onClick={() => toggle('watchlist', a.id)} />
        <Rail icon={muted ? VolumeX : Volume2} label={muted ? 'Muted' : 'Sound'} onClick={onMute} />
      </div>
      <div className="absolute bottom-24 left-4 right-20 z-20 md:bottom-10">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {a.genres.slice(0, 3).map((g) => (
            <span key={g} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs backdrop-blur">
              {g}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold leading-tight tracking-tight">{titleOf(a)}</h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
          {score && (
            <span className="flex items-center gap-1 font-semibold text-white">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {score}
            </span>
          )}
          {formatOf(a)} · {a.episodes ?? '?'} eps
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">{plain(a.description)}</p>
        <Link to={`/watch/${a.id}/1`} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-violet-500 px-5 text-sm font-semibold hover:bg-violet-400">
          <Play className="h-4 w-4 fill-current" />
          Watch S1 EP1
        </Link>
      </div>
    </section>
  )
}

export default function ReelsPage() {
  const [items, setItems] = useState<Anime[]>([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const [sheet, setSheet] = useState<Anime | null>(null)
  const onVisible = useCallback((i: number) => setActive(i), [])

  useEffect(() => {
    let alive = true
    getReels(page)
      .then((r) => {
        if (!alive) return
        setItems((prev) => [...prev, ...r.media.filter((m) => !prev.some((p) => p.id === m.id))])
        setMore(r.hasNext)
      })
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [page])

  useEffect(() => {
    if (more && items.length && active >= items.length - 3) setPage((p) => p + 1)
  }, [active, items.length, more])

  if (error) return <p className="grid h-[100dvh] place-items-center text-white/60">{error}</p>
  if (!items.length) return <div className="mx-auto h-[100dvh] max-w-[480px] animate-pulse bg-white/5" />

  return (
    <>
      <div className="no-scrollbar mx-auto h-[100dvh] max-w-[480px] snap-y snap-mandatory overflow-y-scroll bg-black">
        {items.map((a, i) => (
          <Reel key={a.id} a={a} index={i} active={i === active} muted={muted} onVisible={onVisible} onMute={() => setMuted((m) => !m)} onComments={() => setSheet(a)} />
        ))}
      </div>
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div key="scrim" className="fixed inset-0 z-50 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)} />
            <motion.div
              key="sheet"
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[72dvh] max-w-[480px] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#121218] p-5"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="line-clamp-1 font-semibold">{titleOf(sheet)}</p>
                <button aria-label="Close comments" onClick={() => setSheet(null)} className="p-1 text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Comments id={sheet.id} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
