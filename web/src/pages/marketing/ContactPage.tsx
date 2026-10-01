import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Reveal, Section } from '@/components/marketing/Reveal'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSent(true)
  }

  const field =
    'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-violet-400/60'

  return (
    <Section
      eyebrow="Contact"
      title="Say hello"
      lede="Feature ideas, bug reports or licensing questions — all welcome."
    >
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <form onSubmit={submit} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={field}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className={field}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={6}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none transition placeholder:text-white/30 focus:border-violet-400/60"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-40"
            >
              {sent ? <Check className="h-4 w-4" /> : null}
              {sent ? 'Message queued' : 'Send message'}
            </button>
            {sent && (
              <p className="text-xs text-white/45">
                The form is local for now, so nothing left your device. Messages will be
                delivered once the API is connected.
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold">support@anijinx.app</p>
              <p className="mt-1 text-xs text-white/45">
                Typical reply within two working days.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold">Licensing</p>
              <p className="mt-1 text-xs text-white/45">
                Only titles we own or are licensed to distribute appear in the player.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
