import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import MindPhone from './MindPhone'

const StudioInteractionPreview = lazy(() => import('./StudioInteractionPreview'))

function PlayingPhone({ item, playing, replayToken, onReplay, onOpen, index }) {
  const root = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '160px' })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  return <li ref={root} className="mind-rail__item" data-study={item.id} data-playing={playing} aria-label={`${index + 1}. ${item.title}`}>
    <a className="mind-rail__open" href={item.href} aria-label={`Open the ${item.name} prototype`} onClick={event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (onOpen) { event.preventDefault(); onOpen(item, event.currentTarget) }
    }}>
    <MindPhone className="mind-phone--zoom mind-phone--live" screenClassName="mind-phone__screen--live">
      {near && <Suspense fallback={<div className="mind-rail__placeholder">{item.title}</div>}><StudioInteractionPreview item={item} playing={playing} replayToken={replayToken} /></Suspense>}
      {!near && <div className="mind-rail__placeholder">{item.title}</div>}
    </MindPhone>
    <span className="mind-rail__open-hint" aria-hidden="true">Open prototype ↗</span></a>
    <div className="mind-rail__caption"><div><span className="mind-label">{String(index + 1).padStart(2, '0')} / {item.project}</span><h3>{item.name}</h3></div><button type="button" onClick={onReplay} aria-label={`Replay ${item.title}`} title={`Replay ${item.title}`}><span aria-hidden="true">↻</span></button></div>
  </li>
}

export default function ZoomExplorations({ items, reduced, suspended, standalone = false, onOpen }) {
  const root = useRef(null)
  const rail = useRef(null)
  const drag = useRef(null)
  const moved = useRef(false)
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden)
  const [paused, setPaused] = useState(false)
  const [activeIds, setActiveIds] = useState([])
  const [selected, setSelected] = useState(null)
  const [replayToken, setReplayToken] = useState(0)
  const [position, setPosition] = useState({ start: true, end: false, first: 1 })
  const stopped = paused || suspended || !visible || !documentVisible

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 })
    observer.observe(root.current)
    const visibility = () => setDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  useEffect(() => {
    const node = rail.current
    let frame = 0
    const measure = () => {
      frame = 0
      node.style.setProperty('--device-height', `${Math.max(260, node.clientHeight - 58)}px`)
      const bounds = node.getBoundingClientRect()
      const candidates = [...node.querySelectorAll('.mind-rail__item')].map((element, index) => {
        const r = element.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(r.right, bounds.right) - Math.max(r.left, bounds.left)) / r.width
        return { id: element.dataset.study, index, ratio, distance: Math.abs((r.left + r.right) / 2 - (bounds.left + bounds.right) / 2) }
      }).filter(item => item.ratio > .55)
      const limit = matchMedia('(max-width: 760px)').matches ? 1 : 3
      const active = [...candidates].sort((a, b) => a.distance - b.distance).slice(0, limit).map(item => item.id)
      setActiveIds(previous => previous.join() === active.join() ? previous : active)
      setPosition({ start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 3, first: candidates[0]?.index + 1 || 1 })
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(request)
    observer.observe(node)
    node.addEventListener('scroll', request, { passive: true })
    measure()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); node.removeEventListener('scroll', request) }
  }, [items])

  const move = direction => {
    const node = rail.current
    const card = node.querySelector('.mind-rail__item')
    const amount = card ? card.offsetWidth + parseFloat(getComputedStyle(node).columnGap) : node.clientWidth * .8
    node.scrollBy({ left: direction * amount, behavior: reduced ? 'instant' : 'smooth' })
    setSelected(null)
  }
  const endDrag = event => {
    if (!drag.current) return
    drag.current = null
    rail.current.classList.remove('is-dragging')
    if (rail.current.hasPointerCapture(event.pointerId)) rail.current.releasePointerCapture(event.pointerId)
  }

  return <div ref={root} className={`mind-zoom__explorations mind-rail${standalone ? ' mind-rail--standalone' : ''}`} data-paused={stopped}>
    <ul ref={rail} className="mind-zoom__phones mind-rail__track" aria-label="UI interaction studies — use left and right arrow keys to explore" tabIndex={0}
      onKeyDown={event => {
        if (event.target !== rail.current) return
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
        if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); rail.current.scrollTo({ left: event.key === 'Home' ? 0 : rail.current.scrollWidth, behavior: reduced ? 'instant' : 'smooth' }) }
      }}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button')) return
        moved.current = false
        drag.current = { x: event.clientX, left: rail.current.scrollLeft }
      }}
      onPointerMove={event => {
        if (!drag.current) return
        const delta = event.clientX - drag.current.x
        if (Math.abs(delta) > 5) {
          moved.current = true
          if (!rail.current.hasPointerCapture(event.pointerId)) rail.current.setPointerCapture(event.pointerId)
          rail.current.classList.add('is-dragging')
          rail.current.scrollLeft = drag.current.left - delta
          setSelected(null)
        }
      }} onClickCapture={event => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false } }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; rail.current?.classList.remove('is-dragging') }}>
      {items.map((item, index) => <PlayingPhone key={item.id} item={item} index={index} onOpen={onOpen}
        playing={!stopped && selected === item.id && activeIds.includes(item.id)}
        replayToken={replayToken} onReplay={() => { setSelected(item.id); setPaused(false); setReplayToken(value => value + 1); rail.current.querySelector(`[data-study="${item.id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'instant' : 'smooth' }) }} />)}
    </ul>
    <div className="mind-rail__toolbar"><span className="mind-label mind-rail__hint">Swipe or drag to explore <span aria-hidden="true">↔</span></span><div className="mind-rail__controls">
      <button type="button" className="mind-rail__pause" onClick={() => { if (reduced && !selected) { setSelected(activeIds[0]); setPaused(false) } else setPaused(value => !value) }} aria-pressed={paused} aria-label="Pause interaction previews">{paused ? 'Play' : reduced && !selected ? 'Play' : 'Pause'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
      <span className="mind-label mind-rail__count" aria-live="polite">{String(position.first).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => move(-1)} disabled={position.start} aria-label="Previous interactions">←</button><button type="button" onClick={() => move(1)} disabled={position.end} aria-label="Next interactions">→</button>
    </div></div>
  </div>
}
