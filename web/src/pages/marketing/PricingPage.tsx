import { Link } from 'react-router-dom'
import { Check, Minus } from 'lucide-react'
import { Reveal, Section, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { cn } from '@/lib/utils'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    blurb: 'Everything you need to find and track anime.',
    features: ['Unlimited browsing', 'Discover + seasonal rails', 'Library on one device', 'Ad-supported previews'],
    cta: 'Current plan',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$6.99',
    cadence: 'per month',
    blurb: 'For people who watch every season.',
    features: ['Ad-free episodes', 'Offline downloads', 'Full HD and higher bitrate', 'Cross-device sync', 'Airing reminders'],
    cta: 'Choose Premium',
    highlight: true,
  },
  {
    name: 'Annual',
    price: '$59.99',
    cadence: 'per year',
    blurb: 'Two months free, billed once.',
    features: ['Everything in Premium', 'Two months free', 'Early access to new features'],
    cta: 'Choose Annual',
    highlight: false,
  },
]

const ROWS: [string, boolean, boolean, boolean][] = [
  ['Browse and discover', true, true, true],
  ['Ad-supported previews', true, false, false],
  ['Offline downloads', false, true, true],
  ['Cross-device sync', false, true, true],
  ['Airing reminders', false, true, true],
  ['Early access features', false, false, true],
]

export default function PricingPage() {
  return (
    <>
      <Section
        eyebrow="Plans"
        title="Straightforward pricing"
        lede="Start free. Upgrade when downloads and ad-free playback matter."
      >
        <Stagger className="grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <StaggerItem key={tier.name}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-2xl border p-6',
                  tier.highlight
                    ? 'border-violet-400/60 bg-violet-500/10 shadow-[0_0_60px_-20px_rgba(124,92,255,0.8)]'
                    : 'border-white/10 bg-white/[0.03]',
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h3
                    className={cn(
                      'font-bold',
                      tier.highlight ? 'text-violet-300' : 'text-white',
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p className="text-3xl font-black">{tier.price}</p>
                </div>
                <p className="text-xs text-white/40">{tier.cadence}</p>
                <p className="mt-3 text-sm text-white/55">{tier.blurb}</p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.name === 'Free' ? '/' : '/sign-up'}
                  className={cn(
                    'mt-6 inline-flex h-11 items-center justify-center rounded-full text-sm font-bold transition',
                    tier.highlight
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-white/10 text-white hover:bg-white/20',
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section eyebrow="Compare" title="Every plan, side by side">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-white/45">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Feature</th>
                  <th className="px-4 py-3 text-center font-medium">Free</th>
                  <th className="px-4 py-3 text-center font-medium">Premium</th>
                  <th className="px-4 py-3 text-center font-medium">Annual</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, a, b, c]) => (
                  <tr key={label} className="border-t border-white/5">
                    <td className="px-4 py-3 text-white/75">{label}</td>
                    {[a, b, c].map((on, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {on ? (
                          <Check className="mx-auto h-4 w-4 text-emerald-400" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-white/20" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
