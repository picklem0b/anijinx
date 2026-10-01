import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, Clapperboard, Compass, Home, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/discover', label: 'Discover', icon: Sparkles, end: false },
  { to: '/browse', label: 'Browse', icon: Compass, end: false },
  { to: '/reels', label: 'Reels', icon: Clapperboard, end: false },
  { to: '/library', label: 'Library', icon: Bookmark, end: false },
]

export function Navbar() {
  const [solid, setSolid] = useState(false)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const reels = useLocation().pathname === '/reels'

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/browse?q=${encodeURIComponent(q.trim())}` : '/browse')
    inputRef.current?.blur()
  }

  /**
   * Header order is deliberate and required: `… nav | search | avatar`.
   * The search input collapses to an icon on narrow viewports and expands on tap.
   */
  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
          solid
            ? 'border-b border-white/5 bg-[#09090d]/85 backdrop-blur-xl'
            : 'bg-gradient-to-b from-black/70 to-transparent',
          reels && 'hidden md:block',
        )}
      >
        <div className="flex h-16 items-center gap-6 px-4 md:px-10">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            ANIJINX
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-1.5 text-sm transition',
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Search + avatar live together on the right, in this exact order. */}
          <div className="ml-auto flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{ width: open ? 280 : 40 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative h-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5"
            >
              <button
                type="button"
                aria-label="Search"
                onClick={() => {
                  setOpen(true)
                  requestAnimationFrame(() => inputRef.current?.focus())
                }}
                className="absolute left-0 top-0 grid h-10 w-10 place-items-center text-white/50 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>
              <form onSubmit={submit}>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setOpen(true)}
                  onBlur={() => !q && setOpen(false)}
                  placeholder="Search anime"
                  className="h-10 w-[280px] bg-transparent pl-10 pr-4 text-sm outline-none placeholder:text-white/30"
                />
              </form>
            </motion.div>

            <Link
              to="/profile"
              aria-label="Your profile"
              className="group h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 transition hover:ring-violet-400/70"
            >
              <img
                src="https://api.dicebear.com/9.x/thumbs/svg?seed=anijinx"
                alt="Your avatar"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-white/10 bg-[#09090d]/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 text-[10px]',
                isActive ? 'text-violet-300' : 'text-white/50',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
