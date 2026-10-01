import { Link } from 'react-router-dom'
import { Reveal, Section, Stagger, StaggerItem } from '@/components/marketing/Reveal'

const VALUES = [
  {
    title: 'Taste over volume',
    body: 'Discovery should feel curated. Rails, seasons and “because you liked” beat an endless grid.',
  },
  {
    title: 'Play only what we own',
    body: 'We stream licensed content. Metadata, artwork and trailers come from AniList.',
  },
  {
    title: 'Fast and quiet',
    body: 'Built to be read and changed by one person: plain TypeScript, plain Postgres, no magic.',
  },
  {
    title: 'Accessible by default',
    body: 'Every animation respects Reduce Motion, every control meets a 44px touch target.',
  },
]

const TIMELINE = [
  ['Phase 1', 'Web app with AniList metadata, trailers and a local library.'],
  ['Phase 2', 'Native mobile client with previews, Reels and offline-first state.'],
  ['Phase 3', 'Hono + Postgres API for cross-device library and progress.'],
  ['Phase 4', 'Licensed video pipeline with signed playback and downloads.'],
]

export default function AboutPage() {
  return (
    <>
      <Section
        eyebrow="About"
        title="Built for anime, and only anime"
        lede="AniJinx is a focused streaming home. No mixed catalogue, no filler — the shows, the schedule, and your place in them."
      >
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <StaggerItem key={v.title}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-white/55">{v.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section eyebrow="Roadmap" title="How we got here">
        <Reveal>
          <ol className="relative space-y-6 border-l border-white/10 pl-6">
            {TIMELINE.map(([phase, body]) => (
              <li key={phase} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-violet-400 ring-4 ring-violet-500/15" />
                <p className="text-sm font-semibold text-violet-300">{phase}</p>
                <p className="text-sm text-white/60">{body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section title="Ready to look around?">
        <Reveal>
          <Link
            to="/"
            className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-black transition hover:bg-white/90"
          >
            Open AniJinx
          </Link>
        </Reveal>
      </Section>
    </>
  )
}
