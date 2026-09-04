import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WorldScene, SceneAnchor } from '@/world/WorldScene'
import { assets } from '@/config/assets'
import { t } from '@/config/texts'
import { useGame } from '@/game/store'
import { Egg } from '@/creature/Egg'
import { CreatureView } from '@/creature/CreatureView'
import { HatchSequence, type HatchPhase } from '@/creature/HatchSequence'
import { TopBar } from '@/components/TopBar'
import { ActionBar } from '@/components/ActionBar'
import { FloatingTexts } from '@/components/ui/FloatingTexts'
import { LevelUpOverlay } from '@/components/ui/LevelUpOverlay'
import { FeedTray } from './FeedTray'
import { PlayScreen } from './PlayScreen'
import { ExploreScreen } from './ExploreScreen'
import { EvolutionScreen } from './EvolutionScreen'
import { CodexScreen } from './CodexScreen'
import { ShopScreen } from './ShopScreen'
import { SocialScreen } from './SocialScreen'
import { SettingsScreen } from './SettingsScreen'
import { JournalScreen } from './JournalScreen'
import { MenuScreen } from './MenuScreen'
import { useScene } from '@/world/SceneContext'

const EASE = [0.22, 1, 0.36, 1] as const

/** The main screen: the sanctuary, the socle, the egg or the creature. */
export function HomeScreen({ arrivee }: { arrivee: boolean }) {
  const stage = useGame((s) => s.save.creature.stage)
  const fissures = useGame((s) => s.save.creature.fissures)
  const panneau = useGame((s) => s.ui.panneau)
  const ouvrir = useGame((s) => s.ouvrirPanneau)
  const toucherOeuf = useGame((s) => s.toucherOeuf)
  const terminerEclosion = useGame((s) => s.terminerEclosion)
  const tick = useGame((s) => s.tickRecharges)
  const [hatch, setHatch] = useState<HatchPhase | null>(null)
  const [zoom, setZoom] = useState(arrivee ? 1.14 : 1)
  const scene = useScene()

  // Cinematic dolly-in on arrival.
  useEffect(() => {
    const id = window.setTimeout(() => setZoom(1), 80)
    return () => window.clearTimeout(id)
  }, [])

  // Keep cooldowns fresh.
  useEffect(() => {
    tick()
    const id = window.setInterval(tick, 30000)
    return () => window.clearInterval(id)
  }, [tick])

  const onTapEgg = useCallback(() => {
    if (hatch) return
    if (toucherOeuf() === 'eclosion') setHatch('vibration')
  }, [hatch, toucherOeuf])

  const onNommer = useCallback(
    (nom: string) => {
      terminerEclosion(nom)
      setHatch(null)
    },
    [terminerEclosion],
  )

  const eclosionEnCours = hatch !== null
  const creatureVisible = stage === 'bebe' || hatch === 'naissance' || hatch === 'nom'
  const eggVisible = stage === 'oeuf' && hatch !== 'naissance' && hatch !== 'nom'
  const eclosionLumiere = hatch === 'vibration' ? 0.35 : hatch === 'lumiere' ? 0.85 : hatch === 'flash' ? 1 : 0
  const hint = stage === 'oeuf' && !eclosionEnCours ? (fissures === 0 ? t.oeuf.attente : fissures === 1 ? t.oeuf.encore : t.oeuf.presque) : null

  return (
    <div className="absolute inset-0">
      <WorldScene zoom={zoom} interactif>
        <SceneAnchor x={assets.world.socle.x} y={assets.world.socle.y}>
          {eggVisible && <Egg fissures={fissures} onTap={onTapEgg} eclosion={eclosionLumiere} />}
          {creatureVisible && <CreatureView visible={creatureVisible} />}
          {/* Floating texts sit above the creature's head. */}
          <div className="absolute" style={{ left: 0, top: -assets.creature.bebe.hauteurScene * scene.scale * 0.95 }}>
            <FloatingTexts />
          </div>
        </SceneAnchor>
      </WorldScene>

      <TopBar />

      {/* Egg hint, centred under the socle */}
      <AnimatePresence>
        {hint && (
          <motion.button
            key={hint}
            type="button"
            className="absolute inset-x-0 z-10 flex flex-col items-center gap-2 font-sans text-[0.68rem] uppercase tracking-[0.34em] text-white/70 text-shadow-legible"
            style={{ top: scene.y + assets.world.socle.y * scene.scale + 26 + 34 * scene.scale }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 1, ease: EASE }}
            onClick={onTapEgg}
            data-cursor="glow"
          >
            <span>{hint}</span>
            <span className="hairline w-10 opacity-60" />
            <span className="text-[0.55rem] tracking-[0.3em] text-white/40">{t.oeuf.toucher}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {hatch && <HatchSequence phase={hatch} onPhase={setHatch} onNommer={onNommer} />}

      {stage === 'bebe' && !eclosionEnCours && <ActionBar hidden={panneau === 'nourrir' || panneau === 'jouer'} />}
      {stage === 'bebe' && <FeedTray open={panneau === 'nourrir'} onClose={() => ouvrir(null)} />}
      {panneau === 'jouer' && <PlayScreen onClose={() => ouvrir(null)} />}
      <ExploreScreen open={panneau === 'explorer'} onClose={() => ouvrir(null)} />
      <EvolutionScreen open={panneau === 'evolution'} onClose={() => ouvrir(null)} />
      <CodexScreen open={panneau === 'codex'} onClose={() => ouvrir(null)} />
      <ShopScreen open={panneau === 'boutique'} onClose={() => ouvrir(null)} />
      <SocialScreen open={panneau === 'amis'} onClose={() => ouvrir(null)} />
      <SettingsScreen open={panneau === 'reglages'} onClose={() => ouvrir(null)} />
      <JournalScreen open={panneau === 'journal'} onClose={() => ouvrir(null)} />
      <MenuScreen open={panneau === 'menu'} onClose={() => ouvrir(null)} />
      <LevelUpOverlay />
    </div>
  )
}
