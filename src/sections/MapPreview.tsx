import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { siteConfig, type MapMarker, type MapMarkerKind } from '@/config/site'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'

const MARKER_COLORS: Record<MapMarkerKind, string> = {
  player: '#ffffff',
  chest: '#e9d39a',
  unknown: '#a9d8ff',
  event: '#c9b8ff',
  creature: '#9d7cff',
}

function MarkerGlyph({ kind, active }: { kind: MapMarkerKind; active: boolean }) {
  const c = MARKER_COLORS[kind]
  const glow = active ? { filter: `drop-shadow(0 0 6px ${c})` } : undefined
  switch (kind) {
    case 'chest':
      return (
        <g style={glow}>
          <rect x="-6" y="-4" width="12" height="9" rx="1.5" fill="rgba(4,6,15,0.7)" stroke={c} strokeWidth="1" />
          <path d="M-6 -1h12M0 -1v3" stroke={c} strokeWidth="1" />
        </g>
      )
    case 'unknown':
      return (
        <g style={glow}>
          <circle r="7" fill="rgba(4,6,15,0.55)" stroke={c} strokeWidth="0.8" strokeDasharray="2 2" />
          <text y="3" textAnchor="middle" fontSize="8" fill={c} fontFamily="Cinzel, serif">
            ?
          </text>
        </g>
      )
    case 'event':
      return (
        <g style={glow}>
          <path d="M0 -8 L7 0 L0 8 L-7 0 Z" fill="rgba(4,6,15,0.6)" stroke={c} strokeWidth="1" />
          <path d="M0 -3 L2.5 0 L0 3 L-2.5 0 Z" fill={c} />
        </g>
      )
    case 'creature':
      return (
        <g style={glow}>
          <circle r="5.5" fill={c} opacity="0.18" />
          <circle r="2.2" fill={c} />
          <circle r="7.5" fill="none" stroke={c} strokeWidth="0.6" opacity="0.5" />
        </g>
      )
    default:
      return (
        <g style={glow}>
          <circle r="4" fill={c} />
          <circle r="4" fill="none" stroke={c} strokeWidth="1" opacity="0.7" />
        </g>
      )
  }
}

function LegendGlyph({ kind }: { kind: MapMarkerKind }) {
  return (
    <svg viewBox="-10 -10 20 20" className="h-4 w-4" aria-hidden>
      <MarkerGlyph kind={kind} active={false} />
    </svg>
  )
}

export function MapPreview() {
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = siteConfig.map.markers.find((m) => m.id === activeId) ?? null
  const player = siteConfig.map.markers.find((m) => m.kind === 'player') as MapMarker

  // Subtle tilt / shift following the pointer inside the map.
  const wrapRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 20 })
  const sy = useSpring(my, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el || reduced) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width - 0.5) * -10)
      my.set(((e.clientY - r.top) / r.height - 0.5) * -10)
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [mx, my, reduced])

  return (
    <section id="explore" className="relative px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={siteConfig.map.eyebrow} title={siteConfig.map.title} subtitle={siteConfig.map.subtitle} />

        <Reveal delay={0.2} y={40} className="mt-16 sm:mt-20">
          <div
            ref={wrapRef}
            className="glass relative overflow-hidden rounded-3xl p-[1px]"
            style={{ boxShadow: '0 40px 120px -40px rgba(157,124,255,0.35)' }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-night-900 sm:aspect-[16/9]">
              <motion.div className="absolute inset-[-4%]" style={{ x: sx, y: sy }}>
                <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Preview of the NEXA world map">
                  <defs>
                    <radialGradient id="map-ground" cx="50%" cy="55%" r="75%">
                      <stop offset="0" stopColor="#1a2a52" />
                      <stop offset="0.6" stopColor="#0f1838" />
                      <stop offset="1" stopColor="#080d20" />
                    </radialGradient>
                    <radialGradient id="map-fog" cx="50%" cy="56%" r="58%">
                      <stop offset="0" stopColor="#04060f" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#04060f" stopOpacity="0.05" />
                      <stop offset="0.8" stopColor="#04060f" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#04060f" stopOpacity="0.9" />
                    </radialGradient>
                    <radialGradient id="map-haze" cx="50%" cy="56%" r="58%">
                      <stop offset="0.6" stopColor="#c9b8ff" stopOpacity="0" />
                      <stop offset="1" stopColor="#c9b8ff" stopOpacity="0.14" />
                    </radialGradient>
                    <linearGradient id="map-river" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#7fc0ff" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#c9b8ff" stopOpacity="0.35" />
                    </linearGradient>
                    <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="0.6" />
                    </pattern>
                    <filter id="map-soft" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="14" />
                    </filter>
                    <radialGradient id="player-cone" cx="0" cy="0" r="1">
                      <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect width="800" height="500" fill="url(#map-ground)" />

                  {/* Terrain masses */}
                  <g filter="url(#map-soft)" opacity="0.9">
                    <ellipse cx="240" cy="200" rx="200" ry="120" fill="#22355f" />
                    <ellipse cx="560" cy="330" rx="230" ry="130" fill="#1e3058" />
                    <ellipse cx="620" cy="140" rx="150" ry="90" fill="#273966" />
                    <ellipse cx="140" cy="380" rx="120" ry="80" fill="#18284c" />
                  </g>
                  {/* Forest */}
                  <g fill="#1d3a55" opacity="0.45">
                    {[
                      [170, 150], [200, 130], [230, 160], [260, 140], [190, 180], [300, 170], [330, 150], [700, 380], [730, 350], [670, 400], [650, 360], [710, 420],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r={9 + (i % 3) * 4} />
                    ))}
                  </g>
                  {/* Contours */}
                  <g fill="none" stroke="rgba(201,184,255,0.12)" strokeWidth="0.8">
                    <path d="M40 120c80-60 200-70 300-30s180 30 260-40" />
                    <path d="M0 260c120-40 240-20 340 20s220 70 320 10c60-36 100-46 140-40" />
                    <path d="M60 440c100-70 260-60 380-10s220 20 340-40" />
                    <path d="M520 60c60 30 90 90 80 150" />
                    <path d="M100 300c60 10 90 40 100 80" />
                  </g>
                  <rect width="800" height="500" fill="url(#map-grid)" />

                  {/* River */}
                  <path
                    d="M-20 300c90-30 150 20 220 10s110-70 200-40 130 80 220 60 120-40 200-30"
                    fill="none"
                    stroke="url(#map-river)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <path
                    d="M-20 300c90-30 150 20 220 10s110-70 200-40 130 80 220 60 120-40 200-30"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1"
                    strokeDasharray="6 14"
                    style={{ animation: reduced ? 'none' : 'dash-draw 12s linear infinite', strokeDashoffset: 200 }}
                  />

                  {/* Player cone + radar */}
                  <g transform={`translate(${player.x * 8} ${player.y * 5})`}>
                    <g style={{ transformOrigin: '0px 0px', animation: reduced ? 'none' : 'radar-sweep 9s linear infinite' }}>
                      <path d="M0 0 L-60 -150 A160 160 0 0 1 60 -150 Z" fill="url(#player-cone)" />
                    </g>
                    {[0, 1].map((i) => (
                      <circle
                        key={i}
                        r="26"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="0.8"
                        style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: reduced ? 'none' : `pulse-ring 4s ease-out ${i * 2}s infinite`, opacity: reduced ? 0.4 : undefined }}
                      />
                    ))}
                    <circle r="60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" strokeDasharray="3 5" />
                  </g>

                  {/* Fog of war: the unknown dissolves into night, with a faint crystal haze. */}
                  <rect width="800" height="500" fill="url(#map-haze)" />
                  <rect width="800" height="500" fill="url(#map-fog)" />

                  {/* Markers */}
                  {siteConfig.map.markers.map((m, i) => {
                    const isActive = activeId === m.id
                    return (
                      <g
                        key={m.id}
                        transform={`translate(${m.x * 8} ${m.y * 5})`}
                        className="cursor-pointer"
                        data-cursor="glow"
                        role="button"
                        tabIndex={0}
                        aria-label={`${m.title}: ${m.description}`}
                        onPointerEnter={() => setActiveId(m.id)}
                        onPointerLeave={() => setActiveId((id) => (id === m.id ? null : id))}
                        onClick={() => setActiveId((id) => (id === m.id ? null : m.id))}
                        onFocus={() => setActiveId(m.id)}
                        onBlur={() => setActiveId(null)}
                        style={{ outline: 'none' }}
                      >
                        <circle r="16" fill="transparent" />
                        <g style={{ animation: reduced || m.kind === 'player' ? 'none' : `marker-bob ${3.5 + (i % 4) * 0.6}s ease-in-out ${i * 0.3}s infinite` }}>
                          <g style={{ transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)', transform: isActive ? 'scale(1.25)' : 'scale(1)' }}>
                            <MarkerGlyph kind={m.kind} active={isActive} />
                          </g>
                        </g>
                      </g>
                    )
                  })}
                </svg>
              </motion.div>

              {/* Tooltip */}
              <div
                className={cn(
                  'glass pointer-events-none absolute rounded-xl px-4 py-3 transition-all duration-500 ease-premium',
                  active ? 'opacity-100' : 'translate-y-1 opacity-0',
                )}
                style={{
                  left: `${Math.min(80, Math.max(4, (active?.x ?? 50) - 8))}%`,
                  top: `${Math.min(80, Math.max(4, (active?.y ?? 50) + 9))}%`,
                }}
                aria-live="polite"
              >
                <p className="font-display text-[0.7rem] uppercase tracking-[0.24em] text-white">{active?.title}</p>
                <p className="mt-1 font-sans text-[0.72rem] font-light text-white/60">{active?.description}</p>
              </div>

              {/* HUD corners */}
              <div className="pointer-events-none absolute left-5 top-5 font-sans text-[0.55rem] uppercase tracking-[0.34em] text-white/40">
                Explorer · live preview
              </div>
              <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2 font-sans text-[0.55rem] uppercase tracking-[0.34em] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-300 shadow-[0_0_8px_rgba(169,216,255,0.9)]" />
                Signal
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {siteConfig.map.legend.map((item) => (
            <span key={item.kind} className="flex items-center gap-2 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-white/50">
              <LegendGlyph kind={item.kind} />
              {item.label}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
