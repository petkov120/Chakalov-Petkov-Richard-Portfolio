import { useRef, useState } from 'react'
import Glyph, { MENU_ICONS } from '../icons/Glyph'

const CLIP_SECONDS = 3
const MIN_CLIP = 0.8
const CLIP_SRC = '/images/social/lagos-in-motion.webp'
const OVERLAY_SRC = '/images/social/accra-night-transit.webp'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function formatClipTime(seconds) {
  return `00:${String(Math.max(0, Math.round(seconds))).padStart(2, '0')}`
}

export default function VideoStudio({ onBack }) {
  const previewRef = useRef(null)
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const [tool, setTool] = useState(null)
  const [trim, setTrim] = useState({ start: 0, end: CLIP_SECONDS })
  const [caption, setCaption] = useState(null)
  const [overlay, setOverlay] = useState(null)

  const duration = trim.end - trim.start
  const isTrimmed = trim.start > 0.04 || trim.end < CLIP_SECONDS - 0.04

  const chooseTool = (next) => {
    setTool(next)
    if (next === 'text' && !caption) setCaption({ x: 10, y: 72 })
    if (next === 'overlay' && !overlay) setOverlay({ x: 58, y: 10 })
    if (next === 'cut') {
      setTrim((current) => {
        const full = current.start <= 0.04 && current.end >= CLIP_SECONDS - 0.04
        return full ? { start: 0, end: 2 } : current
      })
    }
  }

  const moveLayer = (kind, event) => {
    const box = previewRef.current?.getBoundingClientRect()
    const origin = dragRef.current
    if (!box || !origin || origin.kind !== kind) return
    const x = ((event.clientX - box.left - origin.dx) / box.width) * 100
    const y = ((event.clientY - box.top - origin.dy) / box.height) * 100
    const next = { x: clamp(x, 4, 70), y: clamp(y, 4, 82) }
    if (kind === 'text') setCaption(next)
    else setOverlay(next)
  }

  const startLayerDrag = (kind, position, event) => {
    event.preventDefault()
    event.stopPropagation()
    const box = previewRef.current.getBoundingClientRect()
    dragRef.current = {
      kind,
      dx: event.clientX - box.left - (position.x / 100) * box.width,
      dy: event.clientY - box.top - (position.y / 100) * box.height,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setTool(kind === 'text' ? 'text' : 'overlay')
  }

  const startTrim = (edge, event) => {
    event.preventDefault()
    event.stopPropagation()
    setTool('cut')
    dragRef.current = { kind: 'trim', edge }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveTrim = (event) => {
    const box = trackRef.current?.getBoundingClientRect()
    const origin = dragRef.current
    if (!box || !origin || origin.kind !== 'trim') return
    const time = clamp(((event.clientX - box.left) / box.width) * CLIP_SECONDS, 0, CLIP_SECONDS)
    setTrim((current) => {
      if (origin.edge === 'start') return { start: Math.min(time, current.end - MIN_CLIP), end: current.end }
      return { start: current.start, end: Math.max(time, current.start + MIN_CLIP) }
    })
  }

  const endDrag = () => {
    dragRef.current = null
  }

  return (
    <div className="x-video">
      <header>
        <button type="button" aria-label="Back" onClick={onBack}><Glyph path={MENU_ICONS.back} size={20} /></button>
        <button type="button" className={isTrimmed || caption || overlay ? 'is-ready' : ''} aria-label="Next">
          <Glyph path={MENU_ICONS.chevron} size={18} />
        </button>
      </header>
      <div className="x-video__preview" ref={previewRef}>
        <img
          src={CLIP_SRC}
          alt="Lagos street clip"
          style={{ objectPosition: `${(trim.start / CLIP_SECONDS) * 100}% 50%` }}
        />
        {caption ? (
          <button
            type="button"
            className={`x-video__caption${tool === 'text' ? ' is-selected' : ''}`}
            style={{ left: `${caption.x}%`, top: `${caption.y}%` }}
            onPointerDown={(event) => startLayerDrag('text', caption, event)}
            onPointerMove={(event) => moveLayer('text', event)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            Lagos in motion
          </button>
        ) : null}
        {overlay ? (
          <button
            type="button"
            className={`x-video__overlay${tool === 'overlay' ? ' is-selected' : ''}`}
            style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}
            aria-label="Move overlay"
            onPointerDown={(event) => startLayerDrag('overlay', overlay, event)}
            onPointerMove={(event) => moveLayer('overlay', event)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <img src={OVERLAY_SRC} alt="" />
          </button>
        ) : null}
      </div>
      <div className="x-video__board">
        <div className="x-video__meter">
          <span>{formatClipTime(0)}/{formatClipTime(duration)}</span>
          <button type="button" aria-label="Play" className="x-video__play"><Glyph path={MENU_ICONS.play} size={16} /></button>
        </div>
        <div
          className={`x-video__track${tool === 'cut' ? ' is-active' : ''}`}
          ref={trackRef}
          onPointerMove={moveTrim}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="x-video__film">
            {[0, 1, 2, 3].map((frame) => (
              <img key={frame} src={CLIP_SRC} alt="" />
            ))}
          </div>
          <i className="x-video__shade" style={{ width: `${(trim.start / CLIP_SECONDS) * 100}%` }} />
          <i className="x-video__shade x-video__shade--end" style={{ width: `${((CLIP_SECONDS - trim.end) / CLIP_SECONDS) * 100}%` }} />
          <div
            className="x-video__range"
            style={{
              left: `${(trim.start / CLIP_SECONDS) * 100}%`,
              width: `${(duration / CLIP_SECONDS) * 100}%`,
            }}
          >
            <button
              type="button"
              aria-label="Trim start"
              onPointerDown={(event) => startTrim('start', event)}
              onPointerMove={moveTrim}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
            <button
              type="button"
              aria-label="Trim end"
              onPointerDown={(event) => startTrim('end', event)}
              onPointerMove={moveTrim}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          </div>
        </div>
      </div>
      <nav className="x-video__tools" aria-label="Edit tools">
        <button type="button" className={tool === 'cut' ? 'is-active' : isTrimmed ? 'is-used' : ''} onClick={() => chooseTool('cut')}>
          <Glyph path={MENU_ICONS.scissors} size={22} />
          Cut
        </button>
        <button type="button" className={tool === 'text' ? 'is-active' : caption ? 'is-used' : ''} onClick={() => chooseTool('text')}>
          <Glyph path={MENU_ICONS.text} size={22} />
          Text
        </button>
        <button type="button" className={tool === 'overlay' ? 'is-active' : overlay ? 'is-used' : ''} onClick={() => chooseTool('overlay')}>
          <Glyph path={MENU_ICONS.overlay} size={22} />
          Overlay
        </button>
      </nav>
    </div>
  )
}
