import type { PeriodWeights, WeatherKind } from '@/types/world'

const LAYERS: Record<keyof PeriodWeights, string> = {
  aube: 'linear-gradient(180deg, rgba(255,196,150,0.16) 0%, rgba(255,225,190,0.06) 45%, rgba(130,95,170,0.14) 100%)',
  jour: 'linear-gradient(180deg, rgba(205,228,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(160,190,230,0.06) 100%)',
  crepuscule: 'linear-gradient(180deg, rgba(110,60,140,0.22) 0%, rgba(255,150,95,0.12) 48%, rgba(50,32,95,0.3) 100%)',
  nuit: 'linear-gradient(180deg, rgba(6,12,42,0.62) 0%, rgba(10,18,60,0.5) 50%, rgba(4,7,26,0.7) 100%)',
}

const WEATHER: Partial<Record<WeatherKind, string>> = {
  soleil: 'radial-gradient(ellipse at 50% 30%, rgba(255,214,150,0.16), rgba(255,214,150,0) 60%)',
  chaleur: 'linear-gradient(180deg, rgba(255,160,90,0.14), rgba(255,120,60,0.1))',
  froid: 'linear-gradient(180deg, rgba(160,200,255,0.12), rgba(120,160,230,0.16))',
  nuageux: 'linear-gradient(180deg, rgba(150,160,190,0.18), rgba(90,100,130,0.16))',
  pluie: 'linear-gradient(180deg, rgba(70,90,130,0.3), rgba(40,55,95,0.3))',
  orage: 'linear-gradient(180deg, rgba(40,35,80,0.42), rgba(25,20,60,0.4))',
  neige: 'linear-gradient(180deg, rgba(200,215,240,0.2), rgba(150,170,210,0.2))',
}

/** Stacked colour washes whose opacities follow the real time of day and weather. */
export function AmbientLayers({ poids, meteo }: { poids: PeriodWeights; meteo: WeatherKind }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {(Object.keys(LAYERS) as Array<keyof PeriodWeights>).map((k) => (
        <div
          key={k}
          className="absolute inset-0 transition-opacity duration-[2500ms] ease-linear"
          style={{ background: LAYERS[k], opacity: poids[k] }}
        />
      ))}
      {/* Moonlight, only at night. */}
      <div
        className="absolute inset-0 transition-opacity duration-[2500ms]"
        style={{
          background: 'radial-gradient(ellipse at 74% 8%, rgba(190,205,255,0.22), rgba(190,205,255,0) 45%)',
          opacity: poids.nuit,
        }}
      />
      {(Object.keys(WEATHER) as WeatherKind[]).map((k) => (
        <div
          key={k}
          className="absolute inset-0 transition-opacity duration-[1800ms]"
          style={{ background: WEATHER[k], opacity: meteo === k ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
