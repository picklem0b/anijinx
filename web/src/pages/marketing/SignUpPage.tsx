import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const PERKS = ['Sync your library', 'Airing reminders', 'Downloads on Premium']

export default function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const field =
    'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-violet-400/60'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
      >
        <h1 className="text-2xl font-black tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-white/50">
          No server yet — this screen is the interface only.
        </p>

        <ul className="mt-5 space-y-2">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-white/70">
              <Check className="h-4 w-4 text-emerald-400" />
              {p}
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className={field}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Create a password"
            className={field}
          />
          <button
            type="submit"
            disabled={!email || !password}
            className="h-11 w-full rounded-full bg-violet-500 text-sm font-bold text-white transition hover:bg-violet-400 disabled:opacity-40"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/45">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-violet-300 hover:text-violet-200">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
