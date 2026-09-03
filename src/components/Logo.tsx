import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { siteConfig } from '@/config/site'

type LogoProps = {
  variant?: 'hero' | 'small'
  shimmer?: boolean
  className?: string
}

/**
 * The NEXA wordmark. Letters are wrapped individually so the intro screen
 * can sample them into particles.
 */
export const Logo = forwardRef<HTMLSpanElement, LogoProps>(function Logo(
  { variant = 'small', shimmer = true, className },
  ref,
) {
  const letters = siteConfig.brand.name.split('')
  return (
    <span
      ref={ref}
      aria-label={siteConfig.brand.name}
      className={cn(
        'logo-wordmark inline-block select-none leading-none',
        shimmer && 'logo-wordmark--shimmer',
        variant === 'hero'
          ? 'text-[clamp(3.6rem,15vw,11rem)] tracking-[0.34em] sm:tracking-ultra'
          : 'text-[1.05rem] tracking-[0.34em]',
        className,
      )}
    >
      {letters.map((l, i) => (
        <span key={i} data-letter={l} className="inline-block">
          {l}
        </span>
      ))}
    </span>
  )
})
