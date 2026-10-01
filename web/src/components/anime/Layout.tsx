import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()
  const reels = pathname === '/reels'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="anijinx-root min-h-screen bg-[#09090d] text-white">
      <Navbar />
      <main className={reels ? '' : 'pb-24 md:pb-10'}>
        <Outlet />
      </main>
      {!reels && <footer className="px-4 pb-24 text-xs text-white/30 md:px-10 md:pb-8">Metadata and artwork from AniList.</footer>}
    </div>
  )
}
