import { useState } from 'react'
import { Reveal, Section } from '@/components/marketing/Reveal'
import { cn } from '@/lib/utils'

const DOCS = {
  terms: {
    label: 'Terms',
    title: 'Terms of service',
    body: [
      'AniJinx streams only content it owns or is licensed to distribute. Metadata, artwork, episode lists and trailers are provided by the public AniList API.',
      'You agree not to redistribute, re-host, or attempt to circumvent playback protections. Access may be suspended if a title is removed at the rights holder’s request.',
      'The service is provided as-is. We aim for high availability but do not guarantee uninterrupted playback.',
    ],
  },
  privacy: {
    label: 'Privacy',
    title: 'Privacy policy',
    body: [
      'AniJinx stores your library, ratings, comments and watch progress in your browser under an anonymous identifier. No account is required.',
      'When cross-device sync is enabled, that anonymous identifier is the only thing transmitted — never your name or email address.',
      'We do not sell data and we do not embed third-party advertising trackers.',
    ],
  },
  cookies: {
    label: 'Cookies & storage',
    title: 'Cookies and local storage',
    body: [
      'The website uses strictly necessary local storage to remember your preferences and your library.',
      'No advertising or cross-site tracking cookies are used.',
      'Clearing your browser storage removes your library from this device. Cross-device sync will make this recoverable.',
    ],
  },
} as const

type Key = keyof typeof DOCS

export default function LegalPage() {
  const [tab, setTab] = useState<Key>('terms')
  const doc = DOCS[tab]

  return (
    <Section eyebrow="Legal" title="Terms and privacy">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(DOCS) as Key[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              k === tab
                ? 'bg-violet-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
            )}
          >
            {DOCS[k].label}
          </button>
        ))}
      </div>

      <Reveal key={tab} className="mt-8">
        <article className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">{doc.title}</h2>
          {doc.body.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-white/60">
              {p}
            </p>
          ))}
          <p className="text-xs text-white/35">Last updated 1 October 2026</p>
        </article>
      </Reveal>
    </Section>
  )
}
