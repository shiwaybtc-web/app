import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { IconCoffre, IconLieu, IconMeteo } from '@/components/ui/Icons'
import { demoMap } from '@/config/exploration'
import { gameConfig } from '@/config/game'
import { t } from '@/config/texts'
import { foodById } from '@/config/foods'
import { codexById } from '@/config/codex'
import { useGame } from '@/game/store'
import { useRealWeather } from '@/world/useWeather'
import type { ChestReward, MapPoint } from '@/types/exploration'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function labelRecompense(r: ChestReward) {
  if (r.type === 'xp') return `+${r.montant} XP`
  if (r.type === 'pieces') return `+${r.montant} éclats`
  if (r.type === 'aliment') return `${foodById[r.id].nom} ×${r.quantite}`
  return codexById[r.id]?.nom ?? r.id
}

/** Seal mini-game: tap when the rotating spark crosses the seal. */
function SealGame({ onResult }: { onResult: (ok: boolean) => void }) {
  const reduced = useReducedMotion()
  const [angle, setAngle] = useState(0)
  const [essais, setEssais] = useState(0)
  const [feedback, setFeedback] = useState<'ok' | 'rate' | null>(null)
  useEffect(() => {
    if (reduced) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      setAngle((a) => (a + ((now - last) / 1000) * 190) % 360)
      last = now
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced])
  const tap = () => {
    const diff = Math.min(Math.abs(angle - 90), 360 - Math.abs(angle - 90))
    const ok = reduced || diff < 22
    setFeedback(ok ? 'ok' : 'rate')
    if (ok) window.setTimeout(() => onResult(true), 500)
    else {
      setEssais((e) => e + 1)
      window.setTimeout(() => setFeedback(null), 600)
      if (essais + 1 >= 3) window.setTimeout(() => onResult(false), 700)
    }
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-sans text-[0.72rem] text-white/60">{t.explorer.miniJeuConsigne}</p>
      <button type="button" onClick={tap} aria-label={t.explorer.miniJeuTitre} className="relative h-44 w-44 outline-none" data-cursor="glow">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="100" cy="100" r="66" fill="none" stroke="rgba(201,184,255,0.35)" strokeWidth="0.6" strokeDasharray="2 6" />
          {/* Seal at 90° (bottom) */}
          <g transform="translate(100 180)">
            <path d="M0 -10 L8 0 L0 10 L-8 0 Z" fill={feedback === 'ok' ? 'rgba(255,255,255,0.95)' : 'rgba(201,184,255,0.9)'} />
          </g>
          <g transform={`rotate(${angle} 100 100)`}>
            <circle cx="180" cy="100" r="5" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))' }} />
          </g>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-[0.7rem] uppercase tracking-[0.3em] text-white/80">
          {feedback === 'ok' ? t.explorer.reussi : feedback === 'rate' ? t.explorer.rate : `${3 - essais}`}
        </span>
      </button>
    </div>
  )
}

export function ExploreScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const position = useGame((s) => s.ui.positionDemo)
  const deplacer = useGame((s) => s.deplacerJoueurDemo)
  const ouvrirCoffre = useGame((s) => s.ouvrirCoffre)
  const decouvrirLieu = useGame((s) => s.decouvrirLieu)
  const codex = useGame((s) => s.save.codex)
  const coffres = useGame((s) => s.save.recharges.coffres)
  const reduced = useReducedMotion()
  const weather = useRealWeather()
  const [sel, setSel] = useState<MapPoint | null>(null)
  const [mini, setMini] = useState(false)
  const [gagne, setGagne] = useState<ChestReward[] | null>(null)
  const [, force] = useState(0)

  useEffect(() => {
    if (!open) return
    const id = window.setInterval(() => force((v) => v + 1), 10000)
    return () => window.clearInterval(id)
  }, [open])

  const proche = useMemo(() => (sel ? distance(position, sel) <= demoMap.porteeInteraction : false), [position, sel])

  const fermer = () => {
    setSel(null)
    setMini(false)
    setGagne(null)
    onClose()
  }

  const rechargeRestante = (id: string) => Math.max(0, (coffres[id] ?? 0) - Date.now())

  return (
    <Sheet open={open} onClose={fermer} titre={t.explorer.titre} large extra={<Chip tone="blue">{t.explorer.demoTitre}</Chip>}>
      <p className="mb-4 font-sans text-[0.72rem] font-light leading-relaxed text-white/50">{t.explorer.demoTexte}</p>

      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        {/* Map */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-night-900">
          <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={t.explorer.demoTitre}>
            <defs>
              <radialGradient id="ex-ground" cx="50%" cy="55%" r="75%">
                <stop offset="0" stopColor="#1a2a52" />
                <stop offset="1" stopColor="#080d20" />
              </radialGradient>
              <radialGradient id="ex-fog" cx="50%" cy="55%" r="60%">
                <stop offset="0.5" stopColor="#04060f" stopOpacity="0" />
                <stop offset="1" stopColor="#04060f" stopOpacity="0.85" />
              </radialGradient>
              <pattern id="ex-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              </pattern>
              <filter id="ex-soft">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            <rect width="400" height="300" fill="url(#ex-ground)" />
            <g filter="url(#ex-soft)" opacity="0.9">
              <ellipse cx="120" cy="120" rx="100" ry="70" fill="#22355f" />
              <ellipse cx="280" cy="200" rx="115" ry="75" fill="#1e3058" />
              <ellipse cx="310" cy="80" rx="70" ry="50" fill="#273966" />
            </g>
            <g fill="#1d3a55" opacity="0.5">
              {[[80, 90], [100, 75], [120, 100], [140, 80], [350, 230], [330, 250], [365, 255]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={7 + (i % 3) * 3} />
              ))}
            </g>
            <path d="M-10 180c50-20 80 10 120 5s60-40 110-25 70 45 120 35 60-20 80-15" fill="none" stroke="rgba(127,192,255,0.45)" strokeWidth="6" strokeLinecap="round" />
            <path d="M-10 180c50-20 80 10 120 5s60-40 110-25 70 45 120 35 60-20 80-15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="4 10" style={{ animation: reduced ? 'none' : 'dash-draw 12s linear infinite', strokeDashoffset: 200 }} />
            <rect width="400" height="300" fill="url(#ex-grid)" />
            <rect width="400" height="300" fill="url(#ex-fog)" />
            {/* Player range */}
            <circle cx={position.x * 4} cy={position.y * 3} r={demoMap.porteeInteraction * 4} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" strokeDasharray="3 5" style={{ transition: 'cx 1.2s cubic-bezier(0.22,1,0.36,1), cy 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
            {/* Points */}
            {demoMap.points.map((p) => {
              const decouvert = p.codex ? codex.includes(p.codex) : false
              const recharge = p.kind === 'coffre' && rechargeRestante(p.id) > 0
              const c = p.kind === 'coffre' ? '#e9d39a' : p.kind === 'lieu' ? '#a9d8ff' : p.kind === 'evenement' ? '#c9b8ff' : '#9d7cff'
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x * 4} ${p.y * 3})`}
                  className="cursor-pointer"
                  data-cursor="glow"
                  role="button"
                  tabIndex={0}
                  aria-label={p.titre}
                  onClick={() => setSel(p)}
                  onKeyDown={(e) => e.key === 'Enter' && setSel(p)}
                  style={{ opacity: recharge ? 0.45 : 1 }}
                >
                  <circle r="12" fill="transparent" />
                  {sel?.id === p.id && <circle r="11" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />}
                  {p.kind === 'coffre' && (
                    <g>
                      <rect x="-5" y="-3.5" width="10" height="8" rx="1.5" fill="rgba(4,6,15,0.7)" stroke={c} strokeWidth="0.9" />
                      <path d="M-5 -1h10M0 -1v2.5" stroke={c} strokeWidth="0.9" />
                    </g>
                  )}
                  {p.kind === 'lieu' && (
                    <g>
                      <path d="M0 6c-4-4.5-6-7-6-9.5a6 6 0 0 1 12 0C6-1 4 1.5 0 6Z" fill={decouvert ? c : 'rgba(4,6,15,0.6)'} stroke={c} strokeWidth="0.9" />
                      {!decouvert && <text y="-2" textAnchor="middle" fontSize="6" fill={c} fontFamily="Cinzel, serif">?</text>}
                    </g>
                  )}
                  {p.kind === 'evenement' && <path d="M0 -7 L6 0 L0 7 L-6 0 Z" fill="rgba(4,6,15,0.6)" stroke={c} strokeWidth="0.9" />}
                  {p.kind === 'presence' && (
                    <g>
                      <circle r="5" fill={c} opacity="0.2" />
                      <circle r="2" fill={c} />
                    </g>
                  )}
                </g>
              )
            })}
            {/* Player */}
            <g transform={`translate(${position.x * 4} ${position.y * 3})`} style={{ transition: 'transform 1.2s cubic-bezier(0.22,1,0.36,1)' }}>
              <circle r="9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: reduced ? 'none' : 'pulse-ring 3s ease-out infinite' }} />
              <circle r="3.5" fill="#fff" />
            </g>
          </svg>
        </div>

        {/* Side: selection / weather */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {sel ? (
              <motion.div key={sel.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="flex items-center gap-2 font-sans text-[0.58rem] uppercase tracking-[0.3em] text-white/45">
                  {sel.kind === 'coffre' ? <IconCoffre size={14} /> : <IconLieu size={14} />}
                  {sel.kind === 'coffre' ? t.explorer.coffre : sel.kind === 'lieu' ? t.explorer.lieu : sel.kind === 'evenement' ? t.explorer.evenement : t.explorer.presence}
                </div>
                <h3 className="mt-2 font-display text-[0.95rem] tracking-[0.18em] text-white">{sel.titre}</h3>
                <p className="mt-1.5 font-sans text-[0.78rem] font-light leading-relaxed text-white/60">{sel.kind === 'presence' ? t.explorer.presenceTexte : sel.description}</p>

                {gagne ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold-200/80">{t.explorer.recompenses}</span>
                    <ul className="flex flex-wrap gap-2">
                      {gagne.map((r, i) => (
                        <li key={i} className="rounded-full border border-white/10 px-3 py-1 font-sans text-[0.68rem] tracking-[0.12em] text-white/80">
                          {labelRecompense(r)}
                        </li>
                      ))}
                    </ul>
                    <Button size="sm" variant="subtle" className="self-start" onClick={() => setGagne(null)}>
                      {t.commun.continuer}
                    </Button>
                  </div>
                ) : mini ? (
                  <div className="mt-4">
                    <SealGame
                      onResult={(ok) => {
                        setMini(false)
                        if (ok) setGagne(ouvrirCoffre(sel.id))
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!proche && sel.kind !== 'presence' && sel.kind !== 'evenement' && (
                      <Button size="sm" variant="subtle" onClick={() => deplacer(sel.x, sel.y)}>
                        {t.explorer.seDeplacer}
                      </Button>
                    )}
                    {sel.kind === 'coffre' &&
                      (rechargeRestante(sel.id) > 0 ? (
                        <span className="font-sans text-[0.62rem] tracking-[0.16em] text-white/45">
                          {t.explorer.coffreRecharge} {Math.ceil(rechargeRestante(sel.id) / 60000)} min
                        </span>
                      ) : (
                        <Button size="sm" disabled={!proche} onClick={() => setMini(true)}>
                          {proche ? t.explorer.coffreProche : t.explorer.coffreLoin}
                        </Button>
                      ))}
                    {sel.kind === 'lieu' &&
                      (sel.codex && codex.includes(sel.codex) ? (
                        <Chip tone="blue">{t.explorer.decouvert}</Chip>
                      ) : (
                        <Button size="sm" disabled={!proche} onClick={() => decouvrirLieu(sel.id)}>
                          {proche ? t.explorer.decouvrir : t.explorer.coffreLoin}
                        </Button>
                      ))}
                    {(sel.kind === 'evenement' || sel.kind === 'presence') && <Chip>{t.commun.futur}</Chip>}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.p key="vide" className="rounded-2xl border border-dashed border-white/10 p-4 font-sans text-[0.75rem] font-light text-white/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {t.explorer.positionDemo}. Touchez un point de la carte.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Real weather */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-sans text-[0.58rem] uppercase tracking-[0.3em] text-white/45">
                <IconMeteo kind={weather.meteo?.kind ?? 'inconnu'} size={14} />
                {t.explorer.meteoReelle}
              </span>
              {weather.actif && weather.meteo?.source === 'reel' && (
                <span className="font-sans text-[0.68rem] tracking-[0.12em] text-white/75">
                  {t.meteo[weather.meteo.kind]}
                  {weather.meteo.temperatureC !== null && ` · ${Math.round(weather.meteo.temperatureC)}°C`}
                </span>
              )}
            </div>
            <p className="mt-2 font-sans text-[0.7rem] font-light leading-relaxed text-white/50">{t.explorer.meteoExplication}</p>
            {weather.etat === 'refuse' && <p className="mt-2 font-sans text-[0.68rem] text-gold-200/70">{t.explorer.meteoRefusee}</p>}
            {weather.etat === 'erreur' && <p className="mt-2 font-sans text-[0.68rem] text-gold-200/70">{t.explorer.meteoErreur}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant={weather.actif ? 'subtle' : 'primary'} disabled={weather.etat === 'chargement'} onClick={() => void weather.actualiser()}>
                {weather.actif ? t.explorer.meteoActualiser : t.explorer.meteoActiver}
              </Button>
              {weather.actif && (
                <Button size="sm" variant="ghost" onClick={weather.desactiver}>
                  {t.explorer.meteoDesactiver}
                </Button>
              )}
            </div>
          </div>

          <p className={cn('font-sans text-[0.6rem] tracking-[0.14em] text-white/35')}>
            Coffres réels géolocalisés, événements et présences : {t.commun.futur.toLowerCase()} · recharge des coffres de démonstration : {gameConfig.explorer.rechargeCoffreMinutes} min.
          </p>
        </div>
      </div>
    </Sheet>
  )
}
