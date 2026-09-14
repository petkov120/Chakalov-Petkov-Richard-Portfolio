import { useEffect, useRef, useState } from 'react'
import Glyph, { MENU_ICONS } from '../icons/Glyph'

const CLIP_SECONDS = 3
const MIN_CLIP = 0.8
const CLIP_SRC = '/images/social/lagos-in-motion.webp'
const STASH = [
  { id: 'accra', src: '/images/social/accra-night-transit.webp' },
  { id: 'abuja', src: '/images/social/abuja-after-rain.webp' },
  { id: 'bridge', src: '/images/social/third-mainland-bridge.webp' },
]
const WAVE = [26, 58, 82, 40, 94, 61, 30, 74, 48, 66, 88, 34, 52, 71, 42, 96, 63, 22, 69, 47, 84, 37, 57, 78, 44, 65, 28, 86, 53, 73, 49, 91, 36, 67, 55, 79, 43, 60, 89, 32, 70, 45, 81, 38, 64, 76, 41, 72]

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function formatClipTime(seconds) {
  const s = Math.max(0, seconds)
  const whole = Math.floor(s)
  const tenth = Math.floor((s % 1) * 10)
  return `00:${String(whole).padStart(2, '0')}.${tenth}`
}

function layerAt(layer, time) {
  if (!layer) return null
  const keys = [...(layer.keys ?? [])].sort((a, b) => a.t - b.t)
  if (!keys.length) return { x: layer.x, y: layer.y }
  if (time <= keys[0].t) return { x: keys[0].x, y: keys[0].y }
  const last = keys[keys.length - 1]
  if (time >= last.t) return { x: last.x, y: last.y }
  let index = 0
  while (index < keys.length - 1 && keys[index + 1].t < time) index += 1
  const from = keys[index]
  const to = keys[index + 1]
  const p = (time - from.t) / Math.max(0.001, to.t - from.t)
  const ease = p * p * (3 - 2 * p)
  return {
    x: from.x + (to.x - from.x) * ease,
    y: from.y + (to.y - from.y) * ease,
  }
}

function stampKey(layer, time, position) {
  const snapped = Math.round(time * 10) / 10
  const keys = [...(layer.keys ?? [])]
  const next = { t: snapped, x: position.x, y: position.y }
  const index = keys.findIndex((key) => Math.abs(key.t - snapped) < 0.08)
  if (index >= 0) keys[index] = next
  else keys.push(next)
  return { ...layer, x: position.x, y: position.y, keys: keys.sort((a, b) => a.t - b.t) }
}

function clipSpan(layer, fallback) {
  const keys = layer?.keys ?? []
  if (keys.length >= 2) return { start: keys[0].t, end: keys[keys.length - 1].t }
  if (keys.length === 1) return { start: keys[0].t, end: fallback.end }
  return fallback
}

export default function VideoStudio({ onBack }) {
  const previewRef = useRef(null)
  const timelineRef = useRef(null)
  const dragRef = useRef(null)
  const trimRef = useRef({ start: 0, end: CLIP_SECONDS })
  const [tool, setTool] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [trim, setTrim] = useState({ start: 0, end: CLIP_SECONDS })
  const [caption, setCaption] = useState(null)
  const [overlay, setOverlay] = useState(null)
  const [broll, setBroll] = useState(null)

  trimRef.current = trim
  const duration = trim.end - trim.start
  const isTrimmed = trim.start > 0.04 || trim.end < CLIP_SECONDS - 0.04
  const captionPos = layerAt(caption, time)
  const overlayPos = layerAt(overlay, time)
  const showBroll = broll && time >= broll.start && time <= broll.end
  const pan = 12 + ((time - trim.start) / Math.max(0.001, duration)) * 52
  const activeLayer = tool === 'text' ? caption : tool === 'overlay' ? overlay : null

  useEffect(() => {
    if (!playing) return undefined
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      const dt = Math.min(0.08, (now - last) / 1000)
      last = now
      const range = trimRef.current
      setTime((current) => {
        let next = current + dt
        if (next < range.start || next >= range.end) next = range.start
        return next
      })
    }, 32)
    return () => window.clearInterval(id)
  }, [playing])

  const timeFromEvent = (event) => {
    const box = timelineRef.current?.getBoundingClientRect()
    if (!box) return time
    return clamp(((event.clientX - box.left) / box.width) * CLIP_SECONDS, 0, CLIP_SECONDS)
  }

  const chooseTool = (next) => {
    setTool(next)
    if (next === 'text' && !caption) setCaption({ x: 10, y: 72, keys: [] })
    if (next === 'overlay' && !overlay) setOverlay({ x: 58, y: 10, src: STASH[0].src, keys: [] })
    if (next === 'image' && !broll) setBroll({ src: STASH[1].src, start: 0.7, end: 1.9 })
    if (next === 'cut') {
      setTrim((current) => {
        const full = current.start <= 0.04 && current.end >= CLIP_SECONDS - 0.04
        return full ? { start: 0, end: 2 } : current
      })
    }
  }

  const togglePlay = () => {
    setPlaying((current) => {
      if (!current && (time < trim.start || time >= trim.end - 0.02)) setTime(trim.start)
      return !current
    })
  }

  const moveLayer = (kind, event) => {
    const box = previewRef.current?.getBoundingClientRect()
    const origin = dragRef.current
    if (!box || !origin || origin.kind !== kind) return
    const x = ((event.clientX - box.left - origin.dx) / box.width) * 100
    const y = ((event.clientY - box.top - origin.dy) / box.height) * 100
    const next = { x: clamp(x, 4, 70), y: clamp(y, 4, 82) }
    const write = (layer) => (layer.keys?.length ? stampKey(layer, time, next) : { ...layer, ...next })
    if (kind === 'text') setCaption(write)
    else setOverlay(write)
  }

  const startLayerDrag = (kind, position, event) => {
    event.preventDefault()
    event.stopPropagation()
    setPlaying(false)
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
    setPlaying(false)
    setTool('cut')
    dragRef.current = { kind: 'trim', edge }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const startScrub = (event) => {
    if (event.target.closest('button')) return
    event.preventDefault()
    setPlaying(false)
    dragRef.current = { kind: 'scrub' }
    setTime(timeFromEvent(event))
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveBoard = (event) => {
    const origin = dragRef.current
    if (!origin) return
    if (origin.kind === 'scrub') {
      setTime(timeFromEvent(event))
      return
    }
    if (origin.kind !== 'trim') return
    const nextTime = timeFromEvent(event)
    setTrim((current) => {
      if (origin.edge === 'start') return { start: Math.min(nextTime, current.end - MIN_CLIP), end: current.end }
      return { start: current.start, end: Math.max(nextTime, current.start + MIN_CLIP) }
    })
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const markKey = (edge) => {
    const pos = tool === 'text' ? captionPos : overlayPos
    const write = tool === 'text' ? setCaption : setOverlay
    if (!pos) return
    write((layer) => {
      const keys = [...(layer.keys ?? [])].sort((a, b) => a.t - b.t)
      const next = { t: Math.round(time * 10) / 10, x: pos.x, y: pos.y }
      if (edge === 'start') return { ...layer, ...pos, keys: [next, ...keys.slice(1)].sort((a, b) => a.t - b.t) }
      const start = keys[0] ?? { t: trim.start, x: pos.x, y: pos.y }
      const stop = { ...next, t: Math.max(next.t, start.t + 0.1) }
      return { ...layer, ...pos, keys: [start, stop] }
    })
  }

  const pickImage = (src) => {
    if (tool === 'image') setBroll((current) => ({ ...(current ?? { start: 0.7, end: 1.9 }), src }))
    else setOverlay((current) => ({ ...(current ?? { x: 58, y: 10, keys: [] }), src }))
  }

  const captionSpan = clipSpan(caption, trim)
  const overlaySpan = clipSpan(overlay, trim)

  return (
    <div className="x-video">
      <header>
        <button type="button" aria-label="Back" onClick={onBack}><Glyph path={MENU_ICONS.back} size={20} /></button>
        <button type="button" className={isTrimmed || caption || overlay || broll ? 'is-ready' : ''} aria-label="Next">
          <Glyph path={MENU_ICONS.chevron} size={18} />
        </button>
      </header>
      <div className="x-video__preview" ref={previewRef}>
        <img
          src={showBroll ? broll.src : CLIP_SRC}
          alt={showBroll ? 'Added image clip' : 'Lagos street clip'}
          style={{ objectPosition: showBroll ? '50% 50%' : `${pan}% 50%`, transform: showBroll ? 'none' : 'scale(1.08)' }}
        />
        {caption && captionPos ? (
          <button
            type="button"
            className={`x-video__caption${tool === 'text' ? ' is-selected' : ''}`}
            style={{ left: `${captionPos.x}%`, top: `${captionPos.y}%` }}
            onPointerDown={(event) => startLayerDrag('text', captionPos, event)}
            onPointerMove={(event) => moveLayer('text', event)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            Lagos in motion
          </button>
        ) : null}
        {overlay && overlayPos ? (
          <button
            type="button"
            className={`x-video__overlay${tool === 'overlay' ? ' is-selected' : ''}`}
            style={{ left: `${overlayPos.x}%`, top: `${overlayPos.y}%` }}
            aria-label="Move overlay"
            onPointerDown={(event) => startLayerDrag('overlay', overlayPos, event)}
            onPointerMove={(event) => moveLayer('overlay', event)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <img src={overlay.src} alt="" />
          </button>
        ) : null}
      </div>
      <div className="x-video__board">
        <div className="x-video__meter">
          <span>{formatClipTime(time)}/{formatClipTime(duration)}</span>
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} className="x-video__play" onClick={togglePlay}>
            <Glyph path={playing ? MENU_ICONS.pause : MENU_ICONS.play} size={16} />
          </button>
          {activeLayer ? (
            <span className="x-video__keys">
              <button type="button" className={activeLayer.keys?.length ? 'is-on' : ''} onClick={() => markKey('start')}>Start</button>
              <button type="button" className={(activeLayer.keys?.length ?? 0) > 1 ? 'is-on' : ''} onClick={() => markKey('stop')}>Stop</button>
            </span>
          ) : <span />}
        </div>
        <div
          className="x-video__timeline"
          ref={timelineRef}
          onPointerDown={startScrub}
          onPointerMove={moveBoard}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className={`x-video__lane x-video__lane--film${tool === 'cut' ? ' is-active' : ''}`}>
            <div className="x-video__film">
              {[8, 34, 58, 84].map((frame) => (
                <img key={frame} src={CLIP_SRC} alt="" style={{ objectPosition: `${frame}% 50%` }} />
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
              <button type="button" aria-label="Trim start" onPointerDown={(event) => startTrim('start', event)} />
              <button type="button" aria-label="Trim end" onPointerDown={(event) => startTrim('end', event)} />
            </div>
          </div>
          <div className="x-video__lane x-video__lane--audio" aria-hidden="true">
            <div className="x-video__wave">
              {WAVE.map((level, index) => (
                <i
                  key={index}
                  className={index / WAVE.length <= time / CLIP_SECONDS ? 'is-on' : ''}
                  style={{ '--h': level / 100 }}
                />
              ))}
            </div>
          </div>
          {broll ? (
            <div className={`x-video__lane${tool === 'image' ? ' is-active' : ''}`}>
              <div
                className="x-video__clip x-video__clip--image"
                style={{
                  left: `${(broll.start / CLIP_SECONDS) * 100}%`,
                  width: `${((broll.end - broll.start) / CLIP_SECONDS) * 100}%`,
                }}
              >
                <img src={broll.src} alt="" />
              </div>
            </div>
          ) : null}
          {overlay ? (
            <div className={`x-video__lane${tool === 'overlay' ? ' is-active' : ''}`}>
              <div
                className="x-video__clip x-video__clip--overlay"
                style={{
                  left: `${(overlaySpan.start / CLIP_SECONDS) * 100}%`,
                  width: `${((overlaySpan.end - overlaySpan.start) / CLIP_SECONDS) * 100}%`,
                }}
              >
                <img src={overlay.src} alt="" />
              </div>
              {(overlay.keys ?? []).map((key) => (
                <button
                  key={`overlay-${key.t}`}
                  type="button"
                  className="x-video__key"
                  aria-label={`Overlay keyframe at ${formatClipTime(key.t)}`}
                  style={{ left: `${(key.t / CLIP_SECONDS) * 100}%` }}
                  onPointerDown={(event) => { event.stopPropagation(); setPlaying(false); setTime(key.t) }}
                />
              ))}
            </div>
          ) : null}
          {caption ? (
            <div className={`x-video__lane${tool === 'text' ? ' is-active' : ''}`}>
              <div
                className="x-video__clip x-video__clip--text"
                style={{
                  left: `${(captionSpan.start / CLIP_SECONDS) * 100}%`,
                  width: `${((captionSpan.end - captionSpan.start) / CLIP_SECONDS) * 100}%`,
                }}
              >
                Aa
              </div>
              {(caption.keys ?? []).map((key) => (
                <button
                  key={`text-${key.t}`}
                  type="button"
                  className="x-video__key"
                  aria-label={`Text keyframe at ${formatClipTime(key.t)}`}
                  style={{ left: `${(key.t / CLIP_SECONDS) * 100}%` }}
                  onPointerDown={(event) => { event.stopPropagation(); setPlaying(false); setTime(key.t) }}
                />
              ))}
            </div>
          ) : null}
          <i className="x-video__playhead" style={{ left: `${(time / CLIP_SECONDS) * 100}%` }} />
        </div>
        {tool === 'overlay' || tool === 'image' ? (
          <div className="x-video__stash">
            {STASH.map((shot) => (
              <button
                key={shot.id}
                type="button"
                className={(tool === 'image' ? broll?.src : overlay?.src) === shot.src ? 'is-on' : ''}
                aria-label={`Use ${shot.id} image`}
                onClick={() => pickImage(shot.src)}
              >
                <img src={shot.src} alt="" />
              </button>
            ))}
          </div>
        ) : null}
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
        <button type="button" className={tool === 'image' ? 'is-active' : broll ? 'is-used' : ''} onClick={() => chooseTool('image')}>
          <Glyph path={MENU_ICONS.image} size={22} />
          Image
        </button>
        <button type="button" className={tool === 'overlay' ? 'is-active' : overlay ? 'is-used' : ''} onClick={() => chooseTool('overlay')}>
          <Glyph path={MENU_ICONS.overlay} size={22} />
          Overlay
        </button>
      </nav>
    </div>
  )
}
