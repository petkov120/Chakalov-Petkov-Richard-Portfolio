import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildWall, FILTERS } from './wall'
import useStageRail from './useStageRail'
import useOnScreen from './useOnScreen'
import Thumb from './Thumb'
import './stage.css'

// The live prototype runtime is heavy; it loads only once a phone is near the centre.
// After that every phone renders its real (paused) screen, so wide screens never show a blank device.
const Preview = lazy(() => import('../mind/StudioInteractionPreview'))

const modified = event => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

function tilt(event) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const r = el.getBoundingClientRect()
  const x = (event.clientX - r.left) / r.width - .5
  const y = (event.clientY - r.top) / r.height - .5
  el.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`)
  el.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`)
  el.style.setProperty('--shift-x', `${(-x * 22).toFixed(1)}px`)
  el.style.setProperty('--shift-y', `${(-y * 22).toFixed(1)}px`)
}
const untilt = event => ['--tilt-x', '--tilt-y', '--shift-x', '--shift-y'].forEach(name => event.currentTarget.style.removeProperty(name))

export default function Stage({ prototypes, cases, reduced, suspended, masthead, onOpen, onAtmosphere }) {
  const wall = useMemo(() => buildWall(prototypes, cases), [prototypes, cases])
  const [filter, setFilter] = useState('all')
  const shown = useMemo(() => filter === 'all' ? wall : wall.filter(entry => entry.group === filter), [wall, filter])
  const keys = useMemo(() => shown.map(entry => entry.key), [shown])
  const counts = useMemo(() => Object.fromEntries(FILTERS.map(f => [f.id, f.id === 'all' ? wall.length : wall.filter(e => e.group === f.id).length])), [wall])

  const root = useRef(null)
  const rail = useRef(null)
  const { focusKey, edge, centre, step, railProps } = useStageRail(rail, keys, reduced)
  const onScreen = useOnScreen(root)
  const [paused, setPaused] = useState(false)
  const [userPlay, setUserPlay] = useState(false) // reduced-motion visitors opt in to autoplay
  const running = (!reduced || userPlay) && !paused && !suspended && onScreen

  const current = shown.find(entry => entry.key === focusKey) ?? shown[0]
  const currentIndex = Math.max(0, shown.indexOf(current))
  const [previewsReady, setPreviewsReady] = useState(false)
  const phoneNearby = shown.some((entry, index) => entry.type === 'phone' && Math.abs(index - currentIndex) <= 1)
  useEffect(() => { if (phoneNearby) setPreviewsReady(true) }, [phoneNearby])
  // While a prototype is open its gallery demo restarts from the first screen, so the phone
  // flies back onto the start rather than wherever the demo had paused.
  const [resets, setResets] = useState(0)
  useEffect(() => { if (suspended) setResets(count => count + 1) }, [suspended])

  useEffect(() => {
    onAtmosphere?.({ glow: current?.accent ?? '#d6c6aa' })
  }, [current?.accent, onAtmosphere])

  useEffect(() => {
    const node = rail.current
    if (!node || !onAtmosphere || reduced) return undefined
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = Math.max(1, node.scrollWidth - node.clientWidth)
        onAtmosphere({ rail: ((node.scrollLeft / max) - .5).toFixed(3) })
      })
    }
    node.addEventListener('scroll', update, { passive: true })
    update()
    return () => { cancelAnimationFrame(frame); node.removeEventListener('scroll', update) }
  }, [keys, onAtmosphere, reduced])

  useLayoutEffect(() => { rail.current?.scrollTo({ left: 0, behavior: 'instant' }) }, [filter]) // a new list starts at its first piece
  const openCurrent = () => {
    const link = rail.current?.querySelector(`[data-key="${current.key}"] .stage__link`)
    if (link) onOpen(current.data, link)
  }
  const activate = (entry, event) => {
    if (!event.isTrusted) return event.preventDefault() // the demo clicks controls inside previews
    if (entry.key !== focusKey) { event.preventDefault(); centre(entry.key); return }
    if (modified(event)) return
    if (entry.type === 'phone') { event.preventDefault(); onOpen(entry.data, event.currentTarget) }
  }
  const togglePlay = () => {
    if (reduced && !userPlay) { setUserPlay(true); setPaused(false) } else setPaused(value => !value)
  }
  const idle = paused || (reduced && !userPlay)

  return <div ref={root} className="stage" style={{ '--glow': current?.accent ?? '#fff' }}>
    <div className="stage__bar">
      {masthead}
      <div className="stage__filters" role="group" aria-label="Filter work">
        {FILTERS.map(f => <button key={f.id} type="button" aria-pressed={filter === f.id} disabled={!counts[f.id]} onClick={() => setFilter(f.id)}>{f.label}<em>{counts[f.id]}</em></button>)}
      </div>
    </div>
    <p className="stage__guide">Live work first, then prototypes you can use, then side projects. Click a piece to bring it forward, click again to open.</p>

    <div className="stage__rail">
    <ul ref={rail} className="stage__track" aria-label="Selected work. Use the arrow keys to move between pieces." {...railProps}>
      {shown.map((entry, index) => {
        const focused = entry.key === focusKey
        const nearby = Math.abs(index - currentIndex) <= 1
        return entry.type === 'phone'
          ? <li key={entry.key} className="stage__item stage__item--phone" data-key={entry.key} data-study={entry.key} data-focus={focused} style={{ '--i': index }}>
              <a className="stage__link" href={entry.data.href} draggable="false" aria-label={`Open the ${entry.name} prototype`} onClick={event => activate(entry, event)}>
                <span className="stage__phone">
                  <span className="stage__screen">
                    {nearby || previewsReady
                      ? <Suspense fallback={<span className="stage__poster">{entry.name}</span>}><Preview key={resets} item={entry.data} playing={running && focused} replayToken={0} /></Suspense>
                      : <span className="stage__poster">{entry.name}</span>}
                  </span>
                </span>
              </a>
            </li>
          : <li key={entry.key} className="stage__item stage__item--tile" data-key={entry.key} data-focus={focused} style={{ '--i': index }}>
              <a className="stage__link" href={entry.href} draggable="false" aria-label={`Open ${entry.name}: ${entry.line}`} onClick={event => activate(entry, event)} onPointerMove={tilt} onPointerLeave={untilt}>
                <span className="stage__frame"><Thumb thumb={entry.data.thumb} alt={entry.data.alt} accent={entry.data.accent} playing={running && focused} /></span>
              </a>
            </li>
      })}
    </ul>

    <div className="stage__mobile-controls" aria-label="Carousel controls">
      <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous project">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
      </button>
      <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Next project">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>
      </button>
    </div>
    </div>

    {current && <div className="stage__info">
      <div className="stage__text" key={current.key} aria-live="polite">
        <p className="stage__meta"><span>{String(currentIndex + 1).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}</span><span className="stage__group" data-group={current.group}>{current.kind}</span>{current.credit && <span>{current.credit}</span>}</p>
        <h3>{current.name}</h3>
        <p className="stage__line">{current.line}</p>
        <p className="stage__note">{current.note}</p>
      </div>
      <div className="stage__actions">
        {current.href
          ? <a className="stage__cta" href={current.href}>{current.cta} <span aria-hidden="true">↗︎</span></a>
          : <button type="button" className="stage__cta" onClick={openCurrent}>{current.cta} <span aria-hidden="true">↗︎</span></button>}
        <div className="stage__controls">
          <button type="button" className="stage__pause" onClick={togglePlay} aria-pressed={idle}>{idle ? 'Play' : 'Pause'}</button>
          <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous project">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
          </button>
          <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Next project">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>
          </button>
        </div>
      </div>
    </div>}
  </div>
}
