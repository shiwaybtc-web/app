import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame } from '@/game/store'
import { SceneProvider } from '@/world/SceneContext'
import { IntroScreen } from '@/screens/IntroScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { Cursor } from '@/components/Cursor'
import { DevPanel } from '@/dev/DevPanel'
import { t } from '@/config/texts'
import { useAmbientAudio } from '@/audio/useAmbientAudio'

export default function App() {
  const pret = useGame((s) => s.ui.pret)
  const ecran = useGame((s) => s.ui.ecran)
  const charger = useGame((s) => s.charger)
  const entrer = useGame((s) => s.entrerDansLeJeu)
  const marquerIntroVue = useGame((s) => s.marquerIntroVue)
  const [arrivee, setArrivee] = useState(false)
  useAmbientAudio()

  useEffect(() => {
    void charger()
  }, [charger])

  // Persist on tab hide as a safety net.
  useEffect(() => {
    const onHide = () => document.visibilityState === 'hidden' && void useGame.getState().sauvegarderMaintenant()
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])

  if (!pret) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-night-950">
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.36em] text-white/40">{t.intro.chargement}</span>
      </div>
    )
  }

  return (
    <SceneProvider>
      <Cursor />
      <div className="relative h-[100svh] w-full overflow-hidden bg-night-950">
        {ecran === 'jeu' && <HomeScreen arrivee={arrivee} />}
        <AnimatePresence>
          {ecran === 'intro' && (
            <IntroScreen
              key="intro"
              onEnter={() => {
                setArrivee(true)
                marquerIntroVue()
                entrer()
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <DevPanel />
    </SceneProvider>
  )
}
