import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const field =
    'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-violet-400/60'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
      >
        <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-white/50">
          Accounts are not wired to a server yet — this is the interface, not the backend.
        </p>

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
            placeholder="Password"
            className={field}
          />
          <button
            type="submit"
            disabled={!email || !password}
            className="h-11 w-full rounded-full bg-white text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            Sign in
          </button>
          {submitted && (
            <p className="text-xs text-violet-300">
              No backend yet — nothing was sent. You can continue browsing as a guest.
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-white/45">
          No account?{' '}
          <Link to="/sign-up" className="font-semibold text-violet-300 hover:text-violet-200">
            Create one
          </Link>
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-3 w-full text-center text-xs text-white/35 hover:text-white/60"
        >
          Continue as guest
        </button>
      </motion.div>
    </div>
  )
}
