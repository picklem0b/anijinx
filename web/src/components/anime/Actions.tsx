import { useState } from 'react'
import { Bell, Bookmark, Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLibrary, type ListKey } from '@/lib/store'

const meta = {
  liked: { icon: Heart, on: 'Liked', off: 'Like', tone: 'text-rose-400' },
  watchlist: { icon: Bookmark, on: 'In watchlist', off: 'Watchlist', tone: 'text-violet-300' },
  reminders: { icon: Bell, on: 'Reminder set', off: 'Remind me', tone: 'text-sky-300' },
} as const

interface LibButtonProps {
  id: number
  list: ListKey
  variant?: 'pill' | 'icon'
  className?: string
}

export function LibButton({ id, list, variant = 'pill', className }: LibButtonProps) {
  const active = useLibrary((s) => s[list].includes(id))
  const toggle = useLibrary((s) => s.toggle)
  const { icon: Icon, on, off, tone } = meta[list]

  const press = () => {
    toggle(list, id)
    if (list === 'reminders' && !active && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission()
  }

  if (variant === 'icon') {
    return (
      <button
        aria-pressed={active}
        aria-label={active ? on : off}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          press()
        }}
        className={cn('grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black/80', active && tone, className)}
      >
        <Icon className={cn('h-4 w-4', active && 'fill-current')} />
      </button>
    )
  }

  return (
    <button
      aria-pressed={active}
      onClick={press}
      className={cn('inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 text-sm font-medium backdrop-blur transition hover:bg-white/20', active && tone, className)}
    >
      <Icon className={cn('h-4 w-4', active && 'fill-current')} />
      {active ? on : off}
    </button>
  )
}

export function Stars({ id }: { id: number }) {
  const value = useLibrary((s) => s.ratings[id] ?? 0)
  const rate = useLibrary((s) => s.rate)
  const [hover, setHover] = useState(0)
  const shown = hover || value

  return (
    <div className="flex items-center" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => rate(id, n)}
          className="p-0.5 transition-transform hover:scale-125"
        >
          <Star className={cn('h-6 w-6', n <= shown ? 'fill-amber-400 text-amber-400' : 'text-white/25')} />
        </button>
      ))}
      {value > 0 && <span className="ml-2 text-sm text-white/60">{value}/5</span>}
    </div>
  )
}
