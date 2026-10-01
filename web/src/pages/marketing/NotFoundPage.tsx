import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-7xl font-black tracking-tighter text-violet-500"
      >
        404
      </motion.p>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-white/50">
        That route does not exist in AniJinx yet.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-black transition hover:bg-white/90"
      >
        Back to Home
      </Link>
    </div>
  )
}
