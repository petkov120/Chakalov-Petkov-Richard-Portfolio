import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import MindPhone from './MindPhone'

const StudioInteractionPreview = lazy(() => import('./StudioInteractionPreview'))

function PlayingPhone({ item, playing, replayToken, onOpen, onFocusItem, focused, index, order }) {
  const root = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '160px' })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  return <li ref={root} className="mind-rail__item" data-wall data-key={item.id} data-study={item.id} data-playing={playing} data-focus={focused} style={{ '--i': order }} aria-label={`${index + 1}. ${item.title}`}>
    <a className="mind-rail__open" href={item.href} draggable="false" aria-label={`Open the ${item.name} prototype`} onClick={event => {
      // The scripted demo clicks controls inside the preview; those must never open the project.
      if (!event.isTrusted) { event.preventDefault(); return }
      if (!focused) { event.preventDefault(); onFocusItem(); return }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (onOpen) { event.preventDefault(); onOpen(item, event.currentTarget) }
    }}>
    <MindPhone className="mind-phone--zoom mind-phone--live" screenClassName="mind-phone__screen--live">
      {near && <Suspense fallback={<div className="mind-rail__placeholder">{item.title}</div>}><StudioInteractionPreview item={item} playing={playing} replayToken={replayToken} /></Suspense>}
      {!near && <div className="mind-rail__placeholder">{item.title}</div>}
    </MindPhone>
    </a>
  </li>
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live work' },
  { id: 'prototype', label: 'Prototypes' },
  { id: 'side', label: 'Side projects' },
]
const kindOf = entry => entry.item ? 'prototype' : entry.tile.origin === 'Live Work' ? 'live' : 'side'

const keyOf = entry => entry.item ? entry.item.id : entry.tile.id
const metaOf = entry => entry.item
  ? { kind: 'Prototype', name: entry.item.name, line: entry.item.summary, note: `${entry.item.status} · ${entry.item.year}`, accent: entry.item.accent, cta: 'Open prototype' }
  : { kind: entry.tile.origin === 'Live Work' ? 'Live work' : 'Side project', name: entry.tile.name, line: entry.tile.blurb, note: entry.tile.proof, accent: entry.tile.accent, cta: 'View case study', href: entry.tile.href }

function WorkTile({ tile, onOpen, onFocusItem, focused, order }) {
  const move = event => {
    if (event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - r.left) / r.width - .5
    const y = (event.clientY - r.top) / r.height - .5
    event.currentTarget.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--shift-x', `${(-x * 22).toFixed(1)}px`)
    event.currentTarget.style.setProperty('--shift-y', `${(-y * 22).toFixed(1)}px`)
  }
  const leave = event => ['--tilt-x', '--tilt-y', '--shift-x', '--shift-y'].forEach(name => event.currentTarget.style.removeProperty(name))
  return <li className="mind-rail__tile" data-tile={tile.id} data-key={tile.id} data-wall data-focus={focused} style={{ '--i': order }}>
    <a className="mind-tile" href={tile.href} draggable="false" aria-label={`Open ${tile.name}: ${tile.field}`} onPointerMove={move} onPointerLeave={leave}
      onClick={event => { if (!focused) { event.preventDefault(); onFocusItem(); return } if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; if (onOpen?.(tile)) event.preventDefault() }}>
      <span className="mind-tile__frame"><img src={tile.src} alt={tile.alt} loading="lazy" decoding="async" draggable="false" /></span>
    </a>
  </li>
}

export default function ZoomExplorations({ items, tiles = [], reduced, suspended, standalone = false, masthead, onOpen, onOpenTile }) {
  const root = useRef(null)
  const rail = useRef(null)
  const drag = useRef(null)
  const moved = useRef(false)
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden)
  const [paused, setPaused] = useState(false)
  const [focusKey, setFocusKey] = useState(null)
  const [userPlay, setUserPlay] = useState(false)
  const replayToken = 0
  const stepRef = useRef(() => {})
  const [position, setPosition] = useState({ start: true, end: false })
  // Prototypes and case-study tiles alternate so the wall never reads as one list.
  const wall = []
  items.forEach((item, index) => { wall.push({ item, index }); if (tiles[index]) wall.push({ tile: tiles[index] }) })
  tiles.slice(items.length).forEach(tile => wall.push({ tile }))
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? wall : wall.filter(entry => kindOf(entry) === filter)
  const counts = Object.fromEntries(FILTERS.map(f => [f.id, f.id === 'all' ? wall.length : wall.filter(entry => kindOf(entry) === f.id).length]))
  const choose = id => {
    setFilter(id)
    rail.current?.scrollTo({ left: 0, behavior: 'instant' })
  }
  const focusEntry = shown.find(entry => keyOf(entry) === focusKey) ?? shown[0]
  const focusMeta = focusEntry ? metaOf(focusEntry) : null
  const centre = key => rail.current?.querySelector(`[data-key="${key}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'instant' : 'smooth' })
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
      const pad = parseFloat(getComputedStyle(node).paddingTop) + parseFloat(getComputedStyle(node).paddingBottom)
      node.style.setProperty('--device-height', `${Math.max(260, node.clientHeight - pad - 24)}px`)
      const bounds = node.getBoundingClientRect()
      const middle = (bounds.left + bounds.right) / 2
      let best = { key: null, f: -1 }
      node.querySelectorAll('[data-wall]').forEach(element => {
        const r = element.getBoundingClientRect()
        const f = Math.max(0, 1 - Math.abs((r.left + r.right) / 2 - middle) / (bounds.width * .34))
        element.style.setProperty('--f', f.toFixed(3))
        if (f > best.f) best = { key: element.dataset.key, f }
      })
      setFocusKey(previous => previous === best.key ? previous : best.key)
      setPosition({ start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 3 })
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(request)
    observer.observe(node)
    node.addEventListener('scroll', request, { passive: true })
    // One wheel notch or trackpad swipe moves exactly one piece. Native scrolling can't, because
    // snap-to-centre pulls small deltas straight back to the current piece.
    let acc = 0
    let lockUntil = 0
    const onWheel = event => {
      const max = node.scrollWidth - node.clientWidth
      if (max <= 2) return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return
      const atStart = node.scrollLeft <= 1
      const atEnd = node.scrollLeft >= max - 1
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return
      event.preventDefault()
      const now = performance.now()
      if (now < lockUntil) { lockUntil = Math.max(lockUntil, now + 140); acc = 0; return }
      acc += delta
      if (Math.abs(acc) < 24) return
      stepRef.current(Math.sign(acc))
      acc = 0
      lockUntil = now + 420
    }
    measure()
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => { cancelAnimationFrame(frame); observer.disconnect(); node.removeEventListener('scroll', request); node.removeEventListener('wheel', onWheel) }
  }, [items, filter])

  const move = direction => {
    const node = rail.current
    const keys = shown.map(keyOf)
    const next = keys[Math.max(0, Math.min(keys.length - 1, keys.indexOf(focusEntry ? keyOf(focusEntry) : keys[0]) + direction))]
    if (next) { centre(next); return }
    const amount = node.clientWidth * .7
    node.scrollBy({ left: direction * amount, behavior: reduced ? 'instant' : 'smooth' })
  }
  stepRef.current = move
  const endDrag = event => {
    if (!drag.current) return
    drag.current = null
    rail.current.classList.remove('is-dragging')
    if (rail.current.hasPointerCapture(event.pointerId)) rail.current.releasePointerCapture(event.pointerId)
  }

  return <div ref={root} className={`mind-zoom__explorations mind-rail${standalone ? ' mind-rail--standalone' : ''}`} data-paused={stopped} style={{ '--glow': focusMeta?.accent || '#ffffff' }}>
    {(masthead || tiles.length > 0) && <div className="mind-stage__bar">
      {masthead}
      {tiles.length > 0 && <div className="mind-rail__filters" role="group" aria-label="Filter work">
        {FILTERS.map(f => <button key={f.id} type="button" className="mind-rail__filter" aria-pressed={filter === f.id} disabled={!counts[f.id]} onClick={() => choose(f.id)}>{f.label}<em>{counts[f.id]}</em></button>)}
      </div>}
    </div>}
    <ul ref={rail} className="mind-zoom__phones mind-rail__track" aria-label="UI interaction studies — use left and right arrow keys to explore" tabIndex={0} onDragStart={event => event.preventDefault()}
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
        }
      }} onClickCapture={event => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false } }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; rail.current?.classList.remove('is-dragging') }}>
      {shown.map((entry, order) => entry.tile
        ? <WorkTile key={entry.tile.id} tile={entry.tile} order={order} focused={focusKey === entry.tile.id} onFocusItem={() => centre(entry.tile.id)} onOpen={onOpenTile} />
        : <PlayingPhone key={entry.item.id} item={entry.item} index={entry.index} order={order} onOpen={onOpen} focused={focusKey === entry.item.id} onFocusItem={() => centre(entry.item.id)}
          playing={!stopped && (!reduced || userPlay) && focusKey === entry.item.id} replayToken={replayToken} />)}
    </ul>
    {focusMeta && <div className="mind-stage__info">
      <div className="mind-stage__text" key={focusKey} aria-live="polite">
        <p className="mind-label"><span>{String(shown.indexOf(focusEntry) + 1).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}</span><span>{focusMeta.kind}</span></p>
        <h3>{focusMeta.name}</h3>
        <p className="mind-stage__line">{focusMeta.line}</p>
        {focusMeta.note && <p className="mind-stage__note">{focusMeta.note}</p>}
      </div>
      <div className="mind-stage__actions">
        {focusMeta.href
          ? <a className="mind-stage__open" href={focusMeta.href}>{focusMeta.cta} <span aria-hidden="true">↗</span></a>
          : <button type="button" className="mind-stage__open" onClick={() => { const trigger = rail.current.querySelector(`[data-study="${focusKey}"] .mind-rail__open`); if (trigger) onOpen?.(focusEntry.item, trigger) }}>{focusMeta.cta} <span aria-hidden="true">↗</span></button>}
        <div className="mind-rail__controls">
          <button type="button" className="mind-rail__pause" onClick={() => { if (reduced && !userPlay) { setUserPlay(true); setPaused(false) } else setPaused(value => !value) }} aria-pressed={paused} aria-label="Pause interaction previews">{paused || (reduced && !userPlay) ? 'Play' : 'Pause'} <span aria-hidden="true">{paused || (reduced && !userPlay) ? '▷' : 'Ⅱ'}</span></button>
          <button type="button" onClick={() => move(-1)} disabled={position.start} aria-label="Previous">←</button><button type="button" onClick={() => move(1)} disabled={position.end} aria-label="Next">→</button>
        </div>
      </div>
    </div>}
  </div>
}
