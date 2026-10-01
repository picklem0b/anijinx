import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const MARKETING_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/help', label: 'Help' },
  { to: '/contact', label: 'Contact' },
]

export function MarketingLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            ANIJINX
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {MARKETING_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-1.5 text-sm transition',
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Same required order as the app header: search, then avatar. */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/browse"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:text-white"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Link
              to="/profile"
              aria-label="Your profile"
              className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15 transition hover:ring-violet-400/70"
            >
              <img
                src="https://api.dicebear.com/9.x/thumbs/svg?seed=anijinx"
                alt="Your avatar"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </motion.main>

      <footer className="border-t border-white/5 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">AniJinx</p>
            <p className="text-xs text-white/40">
              Anime only. Metadata and trailers from AniList.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link to="/help" className="hover:text-white">
              Help
            </Link>
            <Link to="/legal" className="hover:text-white">
              Legal
            </Link>
            <Link to="/sign-in" className="hover:text-white">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
