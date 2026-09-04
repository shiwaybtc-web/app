import { useCallback, useEffect, useState } from 'react'
import { useGame } from '@/game/store'
import { gameConfig } from '@/config/game'
import { demanderPosition } from '@/services/geolocation'
import { meteoInconnue, recupererMeteo } from '@/services/weather'
import type { WeatherKind } from '@/types/world'

/** Effective weather (dev override > real snapshot > unknown). */
export function useWeatherKind(): WeatherKind {
  const override = useGame((s) => s.ui.dev.meteo)
  const reel = useGame((s) => s.save.meteo?.kind)
  return override ?? reel ?? 'inconnu'
}

/** Handles opt-in real weather: consent, fetch, periodic refresh. */
export function useRealWeather() {
  const reglages = useGame((s) => s.save.reglages)
  const meteo = useGame((s) => s.save.meteo)
  const definirMeteo = useGame((s) => s.definirMeteo)
  const definirReglages = useGame((s) => s.definirReglages)
  const [etat, setEtat] = useState<'inactif' | 'chargement' | 'ok' | 'refuse' | 'erreur'>('inactif')

  const actualiser = useCallback(async () => {
    setEtat('chargement')
    try {
      const pos = await demanderPosition()
      const snap = await recupererMeteo(pos.latitude, pos.longitude)
      definirMeteo(snap)
      definirReglages({ geoConsent: 'accorde', meteoReelle: true })
      setEtat('ok')
    } catch (e) {
      const code = (e as { code?: number })?.code
      if (code === 1) {
        definirReglages({ geoConsent: 'refuse', meteoReelle: false })
        definirMeteo(meteoInconnue())
        setEtat('refuse')
      } else {
        setEtat('erreur')
      }
    }
  }, [definirMeteo, definirReglages])

  const desactiver = useCallback(() => {
    definirReglages({ meteoReelle: false })
    definirMeteo(null)
    setEtat('inactif')
  }, [definirMeteo, definirReglages])

  // Refresh on mount and periodically when enabled.
  useEffect(() => {
    if (!reglages.meteoReelle) return
    const stale = !meteo || Date.now() - meteo.at > gameConfig.meteo.rafraichissementMinutes * 60 * 1000
    if (stale) void actualiser()
    const id = window.setInterval(() => void actualiser(), gameConfig.meteo.rafraichissementMinutes * 60 * 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reglages.meteoReelle])

  return { etat, meteo, actif: reglages.meteoReelle, actualiser, desactiver }
}
