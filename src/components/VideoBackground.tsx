import { useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { getPointer } from '@/lib/pointer'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  /** True once the user has entered through the intro. */
  entered: boolean
  /** Scroll progress of the hero (0 at top, 1 when fully scrolled past). */
  scrollProgress: MotionValue<number>
}

/**
 * Full-screen looping video.
 *
 * Two <video> elements alternate: shortly before one ends, the other starts
 * from zero and fades in, hiding the loop seam. The layer also carries a
 * pointer-driven parallax and a scroll-driven darkening.
 */
export function VideoBackground({ entered, scrollProgress }: Props) {
  const isMobile = useMediaQuery(`(max-width: ${siteConfig.video.mobileMaxWidth}px)`)
  const reduced = useReducedMotion()
  const pauseVideo = reduced && siteConfig.video.pauseOnReducedMotion

  const videoA = useRef<HTMLVideoElement>(null)
  const videoB = useRef<HTMLVideoElement>(null)

  const sources = useMemo(() => {
    if (isMobile)
      return [
        { src: siteConfig.video.mobile.webm, type: 'video/webm' },
        { src: siteConfig.video.mobile.mp4, type: 'video/mp4' },
      ]
    return [
      { src: siteConfig.video.desktop.webm, type: 'video/webm' },
      { src: siteConfig.video.desktop.mp4, type: 'video/mp4' },
    ]
  }, [isMobile])

  // Crossfade loop -----------------------------------------------------------
  useEffect(() => {
    const a = videoA.current
    const b = videoB.current
    if (!a || !b) return
    if (pauseVideo) {
      a.pause()
      b.pause()
      return
    }

    const fade = siteConfig.video.loopCrossfadeSeconds
    let active = a
    let standby = b
    let switching = false
    let frame = 0

    const setOpacity = (el: HTMLVideoElement, v: number) => {
      el.style.opacity = String(v)
    }
    setOpacity(a, 1)
    setOpacity(b, 0)
    const tryPlay = (el: HTMLVideoElement) => el.play().catch(() => undefined)
    tryPlay(a)

    const startSwitch = (instant: boolean) => {
      switching = true
      standby.currentTime = 0
      const incoming = standby
      const outgoing = active
      tryPlay(incoming).then(() => {
        const t0 = performance.now()
        const run = (now: number) => {
          const p = instant ? 1 : Math.min(1, (now - t0) / (fade * 1000))
          setOpacity(incoming, p)
          if (p < 1) {
            requestAnimationFrame(run)
          } else {
            setOpacity(outgoing, 0)
            outgoing.pause()
            active = incoming
            standby = outgoing
            switching = false
          }
        }
        requestAnimationFrame(run)
      })
    }

    const tick = () => {
      const duration = active.duration
      if (duration && !switching) {
        if (active.ended) startSwitch(true)
        else if (active.currentTime >= duration - fade - 0.12) startSwitch(false)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay(active)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [pauseVideo, sources])

  // Pointer parallax ---------------------------------------------------------
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 40, damping: 18, mass: 0.8 })
  const sy = useSpring(py, { stiffness: 40, damping: 18, mass: 0.8 })

  useEffect(() => {
    if (reduced || !entered) return
    const pointer = getPointer()
    if (pointer.coarse) return
    const strength = siteConfig.animation.parallaxStrength
    let frame = 0
    const tick = () => {
      px.set(-pointer.nx * strength)
      py.set(-pointer.ny * strength * 0.7)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced, entered, px, py])

  // Scroll darkening: the world stays behind while sections take over --------
  const scrollShade = useTransform(scrollProgress, [0, 0.35, 1], [0, 0.35, 0.82])
  const scrollScale = useTransform(scrollProgress, [0, 1], [1, 1.08])

  const objectPosition = isMobile
    ? siteConfig.video.objectPosition.mobile
    : siteConfig.video.objectPosition.desktop

  const videoClass = 'absolute inset-0 h-full w-full object-cover'
  const videoStyle = { objectPosition, willChange: 'opacity' } as const

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-night-950" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          x: sx,
          y: sy,
          scale: reduced ? 1 : siteConfig.animation.parallaxScale,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ scale: entered || reduced ? 1 : 1.08 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
        <motion.div className="absolute inset-0" style={{ scale: scrollScale }}>
          <img
            src={siteConfig.video.poster}
            alt=""
            className={videoClass}
            style={{ objectPosition }}
            decoding="async"
          />
          {!pauseVideo && (
            <>
              <video
                key={`a-${isMobile}`}
                ref={videoA}
                className={videoClass}
                style={videoStyle}
                autoPlay
                muted
                playsInline
                preload="auto"
                poster={siteConfig.video.poster}
                disablePictureInPicture
              >
                {sources.map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
              <video
                key={`b-${isMobile}`}
                ref={videoB}
                className={videoClass}
                style={videoStyle}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
              >
                {sources.map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
            </>
          )}
        </motion.div>
        </motion.div>
      </motion.div>

      {/* Night-tint: pulls the bright daylight footage towards the palette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,11,26,0.42) 0%, rgba(7,11,26,0.08) 30%, rgba(7,11,26,0.06) 55%, rgba(7,11,26,0.6) 100%)',
        }}
      />
      {/* Soft vignette for legibility at the edges. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(4,6,15,0) 45%, rgba(4,6,15,0.45) 100%)',
        }}
      />
      {/* Scroll-driven shade. */}
      <motion.div className="absolute inset-0 bg-night-950" style={{ opacity: scrollShade }} />
    </div>
  )
}
