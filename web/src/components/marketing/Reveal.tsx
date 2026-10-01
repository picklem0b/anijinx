import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Fade + rise as the element scrolls into view. Instant under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Staggered container for lists/grids of cards. */
export function Stagger({
  children,
  className,
  step = 0.06,
}: {
  children: ReactNode
  className?: string
  step?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : step } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={
        reduced
          ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
          : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
      }
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Small section wrapper with a heading and optional eyebrow. */
export function Section({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow?: string
  title: string
  lede?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('mx-auto max-w-6xl px-4 py-16 md:px-8', className)}>
      <Reveal>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        {lede && <p className="mt-3 max-w-2xl text-white/60">{lede}</p>}
      </Reveal>
      {children && <div className="mt-10">{children}</div>}
    </section>
  )
}
