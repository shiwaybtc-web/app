export type AmbientLayer = {
  id: 'eau' | 'vent' | 'foret' | 'musique'
  src: string
  volume: number
}

/**
 * Ambient sound architecture. Each layer is an independent looping
 * HTMLAudioElement with its own target volume. Nothing is created or played
 * until the player explicitly enables sound; every change fades.
 */
export class AmbientAudio {
  private elements = new Map<string, HTMLAudioElement>()
  private fades = new Map<string, number>()
  private enabled = false

  constructor(
    private layers: AmbientLayer[],
    private masterVolume = 0.8,
    private fadeMs = 1200,
  ) {}

  get isEnabled() {
    return this.enabled
  }

  get hasSources() {
    return this.layers.some((l) => !!l.src)
  }

  private ensureElement(layer: AmbientLayer) {
    let el = this.elements.get(layer.id)
    if (!el) {
      el = new Audio(layer.src)
      el.loop = true
      el.preload = 'auto'
      el.volume = 0
      this.elements.set(layer.id, el)
    }
    return el
  }

  private fadeTo(id: string, el: HTMLAudioElement, target: number, onDone?: () => void) {
    const existing = this.fades.get(id)
    if (existing) cancelAnimationFrame(existing)
    const start = el.volume
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / this.fadeMs)
      const eased = 1 - Math.pow(1 - p, 3)
      el.volume = start + (target - start) * eased
      if (p < 1) this.fades.set(id, requestAnimationFrame(tick))
      else {
        this.fades.delete(id)
        onDone?.()
      }
    }
    this.fades.set(id, requestAnimationFrame(tick))
  }

  /** Call from a user gesture the first time. */
  async enable() {
    this.enabled = true
    for (const layer of this.layers) {
      if (!layer.src) continue
      const el = this.ensureElement(layer)
      try {
        await el.play()
        this.fadeTo(layer.id, el, layer.volume * this.masterVolume)
      } catch {
        // Autoplay policy or missing file: stay silent.
      }
    }
  }

  disable() {
    this.enabled = false
    for (const [id, el] of this.elements) this.fadeTo(id, el, 0, () => el.pause())
  }

  setLayerVolume(id: AmbientLayer['id'], volume: number) {
    const layer = this.layers.find((l) => l.id === id)
    if (!layer) return
    layer.volume = volume
    const el = this.elements.get(id)
    if (el && this.enabled) this.fadeTo(id, el, volume * this.masterVolume)
  }

  destroy() {
    for (const frame of this.fades.values()) cancelAnimationFrame(frame)
    for (const el of this.elements.values()) {
      el.pause()
      el.src = ''
    }
    this.elements.clear()
  }
}
