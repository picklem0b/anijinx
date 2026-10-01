import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  Bell,
  ChevronDown,
  Compass,
  Play,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import { Reveal, Section, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: Compass,
    title: 'Discover, not just search',
    body: 'Personalized rails, genre grids, seasonal picks and an airing calendar built for anime.',
  },
  {
    icon: Play,
    title: 'Previews that sell the show',
    body: 'Trailers autoplay muted on the card you focus, and stop the instant it leaves view.',
  },
  {
    icon: Zap,
    title: 'Continue exactly',
    body: 'Per-episode progress means you always resume where you actually stopped.',
  },
  {
    icon: Bell,
    title: 'Never miss a drop',
    body: 'Reminders fire when the next episode of a title you follow airs.',
  },
  {
    icon: Sparkles,
    title: 'Taste-aware',
    body: 'Like a few titles and AniJinx starts recommending by genre, not by noise.',
  },
  {
    icon: Star,
    title: 'Rate and discuss',
    body: 'Five-star ratings and per-episode comments, kept with your library.',
  },
]

const STEPS = [
  { n: '01', title: 'Browse or discover', body: 'Land on a rail that already knows your taste.' },
  { n: '02', title: 'Preview before you commit', body: 'Muted trailers play as cards come into view.' },
  { n: '03', title: 'Watch and resume', body: 'Progress is remembered per episode, on every device.' },
]

const FAQ = [
  {
    q: 'Is this a real streaming service?',
    a: 'AniJinx streams only content it owns or is licensed to distribute. Metadata, artwork and trailers come from the public AniList API.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. Your library, ratings and progress are stored against an anonymous device id. Accounts only become useful for cross-device sync.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'The website you are on now, and a native mobile app built with Expo for iOS and Android.',
  },
  {
    q: 'How do previews work?',
    a: 'Cards that are mostly visible autoplay their official trailer, muted and looping. Playback stops when the card scrolls away.',
  },
]

const SHOTS = [
  { label: 'Home', tone: 'from-violet-500/40' },
  { label: 'Discover', tone: 'from-sky-500/30' },
  { label: 'Detail', tone: 'from-fuchsia-500/30' },
]

export default function LandingPage() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, reduced ? 0 : 120])
  const heroOpacity = useTransform(scrollY, [0, 420], [1, reduced ? 1 : 0.2])
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(124,92,255,0.35),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-8 md:pt-32">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Anime only. Nothing else.
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight md:text-7xl"
          >
            The streaming home
            <span className="block bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              anime deserves
            </span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg text-white/60"
          >
            A Netflix-style home built for anime — discover by taste, preview before you commit,
            and resume exactly where you stopped.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition hover:bg-white/90"
            >
              <Play className="h-4 w-4 fill-current" />
              Start watching
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-12 items-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-medium backdrop-blur transition hover:bg-white/10"
            >
              See plans
            </Link>
          </motion.div>

          {/* Screenshot gallery */}
          <div className="mt-16">
            <Stagger className="grid gap-4 md:grid-cols-3">
              {SHOTS.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-br to-transparent transition duration-500 group-hover:scale-105',
                        s.tone,
                      )}
                    />
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-white/50">AniJinx interface preview</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section
        eyebrow="Features"
        title="Everything a fan actually uses"
        lede="No bloat, no unrelated catalogue. The features exist because watching anime needs them."
      >
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-400/40 hover:bg-white/[0.06]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-white/55">{body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* How it works */}
      <Section eyebrow="How it works" title="Three steps to something good">
        <Stagger className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="text-sm font-black text-violet-400">{s.n}</span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-white/55">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Testimonial */}
      <Section eyebrow="Loved by viewers" title="What people say">
        <Reveal>
          <figure className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 text-xl font-medium leading-snug md:text-2xl">
              “It finally feels like a streaming app designed by someone who watches anime. The
              previews alone have saved me from three bad starts.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-white/50">
              — Early tester, Android
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Questions, answered">
        <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {FAQ.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 transition', open === i && 'rotate-180')}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-white/55">{item.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA band */}
      <Reveal className="mx-auto max-w-6xl px-4 pb-8 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 md:p-12">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Start with the free plan
          </h2>
          <p className="mt-3 max-w-xl text-white/80">
            Browse, discover and build a library. Upgrade only when you want downloads and
            ad-free episodes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-12 items-center rounded-full bg-black/85 px-7 text-sm font-bold text-white transition hover:bg-black"
            >
              Open the app
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex h-12 items-center rounded-full bg-white/15 px-6 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
            >
              Create an account
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  )
}
