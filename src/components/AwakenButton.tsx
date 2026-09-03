import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  onAwaken: () => void
  disabled?: boolean
}

/**
 * The AWAKEN sigil: a slow rune ring around a crystal shard.
 * Hover lights the rings; click releases a burst before handing over to the
 * awakening overlay (where the egg / creature will appear in the future).
 */
export function AwakenButton({ onAwaken, disabled }: Props) {
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [burst, setBurst] = useState(false)
  const id = useId()
  const gradId = `shard-${id}`
  const glowId = `glow-${id}`

  const handleClick = () => {
    if (disabled || burst) return
    setBurst(true)
    window.setTimeout(() => {
      onAwaken()
      setBurst(false)
    }, reduced ? 0 : 620)
  }

  const lit = hover || burst

  return (
    <button
      type="button"
      data-cursor="glow"
      aria-label={siteConfig.hero.cta}
      onClick={handleClick}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      disabled={disabled}
      className="group relative flex h-44 w-44 items-center justify-center outline-none sm:h-52 sm:w-52"
    >
      {/* Ambient halo */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-[-30%] rounded-full transition-opacity duration-1000 ease-premium',
          lit ? 'opacity-100' : 'opacity-40',
        )}
        style={{
          background:
            'radial-gradient(circle, rgba(157,124,255,0.28) 0%, rgba(127,192,255,0.12) 38%, rgba(0,0,0,0) 68%)',
          filter: 'blur(14px)',
        }}
      />

      {/* Burst ring */}
      {burst && !reduced && (
        <>
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-white/70"
            initial={{ scale: 0.7, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(201,184,255,0) 70%)' }}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </>
      )}

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#c9b8ff" />
            <stop offset="1" stopColor="#7fc0ff" />
          </linearGradient>
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer hairline ring */}
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
          className={cn('transition-all duration-700', lit && 'stroke-white/60')}
        />

        {/* Rune ring: rotating dashes, faster and brighter on hover */}
        <g
          className="origin-center"
          style={{
            animation: reduced ? 'none' : `spin-slow ${lit ? 26 : 70}s linear infinite`,
            transition: 'opacity 0.8s',
            opacity: lit ? 1 : 0.55,
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="rgba(214,198,255,0.9)"
            strokeWidth="1.1"
            strokeDasharray="2 9 14 9 2 22"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="100"
            r="78"
            fill="none"
            stroke="rgba(127,192,255,0.55)"
            strokeWidth="0.6"
            strokeDasharray="1 6"
          />
        </g>

        {/* Counter-rotating inner ring */}
        <g
          className="origin-center"
          style={{
            animation: reduced ? 'none' : `spin-slow ${lit ? 40 : 110}s linear infinite reverse`,
            opacity: lit ? 0.95 : 0.45,
            transition: 'opacity 0.8s',
          }}
        >
          <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="30 12 4 12" />
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="33"
              x2="100"
              y2="39"
              stroke="rgba(233,211,154,0.85)"
              strokeWidth="0.8"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </g>

        {/* Crystal shard */}
        <g
          filter={lit ? `url(#${glowId})` : undefined}
          className="origin-center transition-transform duration-700 ease-premium"
          style={{ transform: lit ? 'translateY(-2px) scale(1.06)' : 'none' }}
        >
          <path
            d="M100 56 L114 82 L100 118 L86 82 Z"
            fill={`url(#${gradId})`}
            opacity={lit ? 1 : 0.85}
            style={{ transition: 'opacity 0.7s' }}
          />
          <path d="M100 56 L100 118 M86 82 L114 82" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
          <path d="M100 56 L114 82 L100 118" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.6" />
        </g>

        {/* Label */}
        <text
          x="100"
          y="150"
          textAnchor="middle"
          fontFamily="Cinzel, Georgia, serif"
          fontSize="12.5"
          letterSpacing="4.2"
          fill="#f4f2ff"
          style={{
            transition: 'opacity 0.6s, filter 0.6s',
            opacity: lit ? 1 : 0.82,
            filter: lit ? 'drop-shadow(0 0 6px rgba(201,184,255,0.9))' : 'none',
          }}
        >
          {siteConfig.hero.cta}
        </text>
      </svg>
    </button>
  )
}
