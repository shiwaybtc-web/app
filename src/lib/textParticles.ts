/**
 * Samples rendered glyphs into particle positions so a DOM wordmark can
 * dissolve into light. Each letter of the wordmark must be wrapped in an
 * element carrying `data-letter`.
 */

export type TextPoint = { x: number; y: number }

export function sampleLetters(container: HTMLElement, step = 3): TextPoint[] {
  const letters = Array.from(container.querySelectorAll<HTMLElement>('[data-letter]'))
  if (!letters.length) return []

  const canvas = document.createElement('canvas')
  const rect = container.getBoundingClientRect()
  const pad = 24
  const width = Math.ceil(rect.width + pad * 2)
  const height = Math.ceil(rect.height + pad * 2)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'alphabetic'

  for (const letter of letters) {
    const style = getComputedStyle(letter)
    const r = letter.getBoundingClientRect()
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    // Approximate the alphabetic baseline: the glyph box bottom minus descent.
    const fontSize = parseFloat(style.fontSize)
    const baseline = r.top - rect.top + pad + r.height * 0.5 + fontSize * 0.35
    ctx.fillText(letter.dataset.letter || letter.textContent || '', r.left - rect.left + pad, baseline)
  }

  const { data } = ctx.getImageData(0, 0, width, height)
  const points: TextPoint[] = []
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 110) {
        points.push({ x: x - pad + rect.left, y: y - pad + rect.top })
      }
    }
  }
  return points
}
