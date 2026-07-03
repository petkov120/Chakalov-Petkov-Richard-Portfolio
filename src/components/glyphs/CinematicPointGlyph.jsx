import { useEffect, useRef, useState } from 'react'
import { GlyphGradientDefs, PointHandPaths, TickArcPaths } from './glyphPaths'

export default function CinematicPointGlyph() {
  const rootRef = useRef(null)
  const [drawn, setDrawn] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReduceMotion(mq.matches)
    syncMotion()
    mq.addEventListener('change', syncMotion)
    return () => mq.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setDrawn(true)
      return undefined
    }

    const node = rootRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <svg
      ref={rootRef}
      className="investigation-glyph investigation-glyph--cinematic"
      viewBox="0 0 400 280"
      aria-hidden
    >
      <GlyphGradientDefs />
      <g className="investigation-glyph__ghost">
        <PointHandPaths />
        <TickArcPaths />
      </g>
      <g className={`investigation-glyph__draw${drawn ? ' is-drawn' : ''}`}>
        <PointHandPaths />
        <TickArcPaths />
      </g>
    </svg>
  )
}
