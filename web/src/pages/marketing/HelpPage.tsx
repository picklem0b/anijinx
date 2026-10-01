import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Reveal, Section } from '@/components/marketing/Reveal'
import { cn } from '@/lib/utils'

const FAQ = [
  {
    q: 'Where does the show information come from?',
    a: 'Metadata, artwork, episode lists and trailers come from the public AniList GraphQL API. Episode playback uses licensed video assets served separately.',
  },
  {
    q: 'Why does a card play a video while I scroll?',
    a: 'A card that is mostly visible autoplays its trailer, muted and looping. It stops the moment the card leaves the viewport. You can turn the behaviour off in Settings.',
  },
  {
    q: 'Does my library sync between devices?',
    a: 'Not yet. Today your library, ratings and progress live in this browser. Cross-device sync arrives with the API, which identifies you with an anonymous device id — no account required.',
  },
  {
    q: 'Can I download episodes?',
    a: 'Downloads are planned for the Premium plan once the licensed video pipeline is connected.',
  },
  {
    q: 'How do I reduce animations?',
    a: 'AniJinx honours the operating system Reduce Motion setting. Enable it and every animation degrades to an instant state change.',
  },
  {
    q: 'Something is broken — what do I do?',
    a: 'Use the contact page. Include the title, the device and what you expected to happen; that is usually enough to reproduce it.',
  },
]

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section
      eyebrow="Support"
      title="Help centre"
      lede="The questions people actually ask, answered plainly."
    >
      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
        {FAQ.map((item, i) => (
          <div key={item.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
            >
              <span className="font-medium">{item.q}</span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 transition', open === i && 'rotate-180')} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.26 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-4 text-sm text-white/55">{item.a}</p>
            </motion.div>
          </div>
        ))}
      </div>

      <Reveal className="mt-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="font-semibold">Still stuck?</h3>
          <p className="mt-1.5 text-sm text-white/55">
            Send us the details and we will take a look.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex h-10 items-center rounded-full bg-white/10 px-5 text-sm font-medium transition hover:bg-white/20"
          >
            Contact support
          </Link>
        </div>
      </Reveal>
    </Section>
  )
}
