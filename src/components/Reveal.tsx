import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  children?: ReactNode
  className?: string
  delay?: number
  /** Distance in px the element rises from. */
  y?: number
  once?: boolean
  as?: 'div' | 'p' | 'h2' | 'h3' | 'span' | 'li'
}

/** Fade + rise in when scrolled into view. Instant under reduced motion. */
export function Reveal({ children, className, delay = 0, y = 26, once = true, as = 'div' }: Props) {
  const reduced = useReducedMotion()
  const Component = motion[as]
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y, filter: reduced ? 'blur(0px)' : 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduced ? 0.01 : 1.1, ease: EASE, delay },
    },
  }
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
    >
      {children}
    </Component>
  )
}
