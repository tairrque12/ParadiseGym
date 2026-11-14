'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

function enter(reduced: boolean, delay = 0, duration = 0.8) {
  return reduced ? { duration: 0 } : { duration, delay, ease: EASE }
}

type SectionRevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function SectionReveal({
  children,
  className,
  delay = 0,
}: SectionRevealProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

type StaggerContainerProps = {
  children: React.ReactNode
  className?: string
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
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
  children: React.ReactNode
  className?: string
}) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function SlideReveal({
  children,
  className,
  from = 'left',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  from?: 'left' | 'right'
  delay?: number
}) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: from === 'left' ? -48 : 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function RevealOnMount({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  )
}

export function MaskedLine({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <span className={cn('block overflow-hidden', className)}>
      <motion.span
        className="block"
        initial={reducedMotion ? false : { y: '110%' }}
        animate={{ y: '0%' }}
        transition={enter(reducedMotion, delay, 0.9)}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={enter(reducedMotion, delay, 0.8)}
    >
      {children}
    </motion.div>
  )
}

export function NeonRule({
  className,
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <motion.span
      aria-hidden
      className={cn('block h-0.5 w-16 origin-left bg-neon', className)}
      initial={reducedMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={enter(reducedMotion, delay, 0.6)}
    />
  )
}

export function ImageWipe({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      initial={reducedMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={enter(reducedMotion, 0, 0.8)}
    >
      <motion.div
        className="absolute inset-0"
        initial={reducedMotion ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={enter(reducedMotion, 0, 0.8)}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function GrainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay',
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}
