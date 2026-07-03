import { useEffect, useMemo, useRef, useState } from 'react'
import EvidenceLightbox from '../components/evidence/EvidenceLightbox'
import { playgroundItems } from '../data/investigations'

const WORLD_WIDTH = 4400
const WORLD_HEIGHT = 2800
const CARD_REFERENCE_WIDTH = 1500
const CARD_REFERENCE_HEIGHT = 920
const INITIAL_OFFSET = { x: -720, y: -420 }

const playgroundGuideSections = [
  {
    title: 'Move around',
    items: [
      { keys: ['Middle mouse', 'drag'], action: 'Pan the canvas' },
      { keys: ['Space', 'drag'], action: 'Hand tool' },
      { keys: ['Scroll'], action: 'Glide around' },
      { keys: ['WASD'], action: 'Nudge the view' },
    ],
  },
  {
    title: 'Interact',
    items: [
      { keys: ['Click', 'drag'], action: 'Reposition a card' },
      { keys: ['Click'], action: 'Open a design' },
    ],
  },
  {
    title: 'Reset',
    items: [
      { keys: ['Double-click'], action: 'Back to start' },
      { keys: ['R'], action: 'Reset view' },
      { keys: ['?'], action: 'Hide this guide' },
    ],
  },
]

function handleCardHover(event) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const ratioX = (event.clientX - rect.left) / rect.width - 0.5
  const ratioY = (event.clientY - rect.top) / rect.height - 0.5
  const tiltY = ratioX * 8
  const tiltX = -ratioY * 8

  card.style.setProperty('--plg-tilt-x', `${tiltX.toFixed(2)}deg`)
  card.style.setProperty('--plg-tilt-y', `${tiltY.toFixed(2)}deg`)
  card.style.setProperty('--plg-shift-x', `${(ratioX * 7).toFixed(2)}px`)
  card.style.setProperty('--plg-shift-y', `${(ratioY * 7).toFixed(2)}px`)
}

function resetCardHover(event) {
  const card = event.currentTarget
  card.style.setProperty('--plg-tilt-x', '0deg')
  card.style.setProperty('--plg-tilt-y', '0deg')
  card.style.setProperty('--plg-shift-x', '0px')
  card.style.setProperty('--plg-shift-y', '0px')
}

function mapPlaygroundItemToCard(item) {
  return {
    ...item,
    px: 720 + (item.x / 100) * 2100,
    py: 320 + (item.y / 100) * 1650,
    pw: (item.w / 100) * CARD_REFERENCE_WIDTH,
    ph: (item.h / 100) * CARD_REFERENCE_HEIGHT,
  }
}

export default function PlaygroundPage() {
  const [cards, setCards] = useState(() => playgroundItems.map(mapPlaygroundItemToCard))
  const [targetOffset, setTargetOffset] = useState(INITIAL_OFFSET)
  const [renderOffset, setRenderOffset] = useState(INITIAL_OFFSET)
  const [activeItem, setActiveItem] = useState(null)
  const [lightboxOrigin, setLightboxOrigin] = useState({ x: 50, y: 50 })
  const [draggingId, setDraggingId] = useState(null)
  const [isPanning, setIsPanning] = useState(false)
  const [isHandTool, setIsHandTool] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showGuide, setShowGuide] = useState(true)
  const [stackOrder, setStackOrder] = useState(() => playgroundItems.map((item) => item.id))
  const viewportRef = useRef(null)
  const targetOffsetRef = useRef(INITIAL_OFFSET)
  const spaceHeldRef = useRef(false)
  const suppressClickIdRef = useRef(null)
  const interactionRef = useRef({
    mode: null,
    pointerId: null,
    cardId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  })

  const stackedCards = useMemo(() => {
    const zMap = new Map(stackOrder.map((id, i) => [id, i + 1]))
    return cards.map((card) => ({ ...card, z: zMap.get(card.id) ?? 1 }))
  }, [cards, stackOrder])

  function bringCardToFront(id) {
    setStackOrder((prev) => [...prev.filter((entry) => entry !== id), id])
  }

  function clampOffset(next) {
    const viewport = viewportRef.current
    if (!viewport) return next

    const rect = viewport.getBoundingClientRect()
    const bleed = 240
    const minX = rect.width - WORLD_WIDTH - bleed
    const maxX = bleed
    const minY = rect.height - WORLD_HEIGHT - bleed
    const maxY = bleed

    return {
      x: Math.min(maxX, Math.max(minX, next.x)),
      y: Math.min(maxY, Math.max(minY, next.y)),
    }
  }

  function setCanvasOffset(next, immediate = false) {
    const clamped = clampOffset(next)
    targetOffsetRef.current = clamped
    setTargetOffset(clamped)
    if (immediate) {
      setRenderOffset(clamped)
    }
  }

  function canStartPan(event) {
    if (event.button === 1) return true
    if (event.button === 0 && spaceHeldRef.current) return true
    return false
  }

  function beginPan(event) {
    if (!canStartPan(event)) return false
    if (event.target.closest('[data-playground-ui="true"]')) return false
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    interactionRef.current = {
      mode: 'pan',
      pointerId: event.pointerId,
      cardId: null,
      startX: event.clientX,
      startY: event.clientY,
      originX: targetOffsetRef.current.x,
      originY: targetOffsetRef.current.y,
      moved: false,
    }
    setIsPanning(true)
    return true
  }

  function handleViewportPointerDown(event) {
    beginPan(event)
  }

  function handleViewportPointerMove(event) {
    const viewport = viewportRef.current
    if (viewport && event.pointerType !== 'touch') {
      const rect = viewport.getBoundingClientRect()
      setCursorPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }

    const interaction = interactionRef.current
    if (interaction.mode !== 'pan' || interaction.pointerId !== event.pointerId) return
    const dx = event.clientX - interaction.startX
    const dy = event.clientY - interaction.startY
    if (Math.abs(dx) + Math.abs(dy) > 3) {
      interaction.moved = true
    }
    setCanvasOffset(
      {
        x: interaction.originX + dx,
        y: interaction.originY + dy,
      },
      true,
    )
  }

  function clearViewportInteraction(event) {
    const interaction = interactionRef.current
    if (interaction.mode !== 'pan' || interaction.pointerId !== event.pointerId) return
    interactionRef.current = {
      mode: null,
      pointerId: null,
      cardId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
    }
    setIsPanning(false)
  }

  function handleCardPointerDown(event, card) {
    if (event.button !== 0) return
    if (spaceHeldRef.current) return
    event.stopPropagation()
    bringCardToFront(card.id)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.style.setProperty('--plg-press', '1')
    interactionRef.current = {
      mode: 'card',
      pointerId: event.pointerId,
      cardId: card.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: card.px,
      originY: card.py,
      moved: false,
    }
    setDraggingId(card.id)
  }

  function handleCardPointerMove(event, card) {
    handleCardHover(event)
    const interaction = interactionRef.current
    if (
      interaction.mode !== 'card' ||
      interaction.pointerId !== event.pointerId ||
      interaction.cardId !== card.id
    ) {
      return
    }

    const dx = event.clientX - interaction.startX
    const dy = event.clientY - interaction.startY
    if (Math.abs(dx) + Math.abs(dy) > 3) {
      interaction.moved = true
    }

    setCards((prev) =>
      prev.map((entry) =>
        entry.id === card.id
          ? { ...entry, px: interaction.originX + dx, py: interaction.originY + dy }
          : entry,
      ),
    )
  }

  function clearCardInteraction(event, card) {
    const interaction = interactionRef.current
    if (
      interaction.mode !== 'card' ||
      interaction.pointerId !== event.pointerId ||
      interaction.cardId !== card.id
    ) {
      return
    }
    event.currentTarget.style.setProperty('--plg-press', '0')
    event.currentTarget.style.setProperty('--plg-tilt-x', '0deg')
    event.currentTarget.style.setProperty('--plg-tilt-y', '0deg')
    event.currentTarget.style.setProperty('--plg-shift-x', '0px')
    event.currentTarget.style.setProperty('--plg-shift-y', '0px')
    if (interaction.moved) {
      suppressClickIdRef.current = card.id
    }
    interactionRef.current = {
      mode: null,
      pointerId: null,
      cardId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
    }
    setDraggingId(null)
  }

  function handleCardClick(card, event) {
    if (suppressClickIdRef.current === card.id) {
      suppressClickIdRef.current = null
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setLightboxOrigin({
      x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
      y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
    })
    setActiveItem(card)
  }

  function handleViewportWheel(event) {
    event.preventDefault()

    const deltaX = event.shiftKey ? event.deltaY : event.deltaX
    const deltaY = event.deltaY
    const movementBoost = event.deltaMode === 1 ? 14 : 1

    setTargetOffset((current) =>
      clampOffset({
        x: current.x - deltaX * movementBoost * 1.55,
        y: current.y - deltaY * movementBoost * 1.55,
      }),
    )
  }

  function handleResetCanvas() {
    setTargetOffset(INITIAL_OFFSET)
  }

  function nudgeCanvas(dx, dy) {
    setTargetOffset((current) =>
      clampOffset({
        x: current.x + dx,
        y: current.y + dy,
      }),
    )
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (activeItem) return
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault()
        spaceHeldRef.current = true
        setIsHandTool(true)
        return
      }
      if (event.key === '?') {
        event.preventDefault()
        setShowGuide((prev) => !prev)
        return
      }
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        handleResetCanvas()
        return
      }

      const step = event.shiftKey ? 120 : 56
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault()
        nudgeCanvas(0, step)
      } else if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        event.preventDefault()
        nudgeCanvas(0, -step)
      } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        event.preventDefault()
        nudgeCanvas(step, 0)
      } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        event.preventDefault()
        nudgeCanvas(-step, 0)
      }
    }

    const onKeyUp = (event) => {
      if (event.code === 'Space') {
        spaceHeldRef.current = false
        setIsHandTool(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [activeItem])

  useEffect(() => {
    targetOffsetRef.current = targetOffset
  }, [targetOffset])

  useEffect(() => {
    let frameId
    const tick = () => {
      if (interactionRef.current.mode !== 'pan') {
        setRenderOffset((current) => {
          const target = targetOffsetRef.current
          const nextX = current.x + (target.x - current.x) * 0.22
          const nextY = current.y + (target.y - current.y) * 0.22
          const done = Math.abs(target.x - nextX) < 0.35 && Math.abs(target.y - nextY) < 0.35
          if (done) return target
          return { x: nextX, y: nextY }
        })
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <main className="theme-vault min-h-screen playground-shell">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div className="absolute left-0 top-0 z-50 px-6 md:px-12 pt-8 md:pt-10">
          <a
            href="/"
            className="playground-backlink inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900"
          >
            <span aria-hidden>←</span>
            Back to investigations
          </a>
        </div>

        <section
          ref={viewportRef}
          className={`playground-viewport playground-viewport--fullscreen rise rise-3 ${
            isPanning ? 'is-panning' : ''
          } ${isHandTool ? 'is-hand-tool' : ''}`}
          aria-label="Playground infinite canvas"
          onPointerDown={handleViewportPointerDown}
          onPointerMove={handleViewportPointerMove}
          onPointerUp={clearViewportInteraction}
          onPointerCancel={clearViewportInteraction}
          onPointerEnter={() => setShowCursor(true)}
          onPointerLeave={() => setShowCursor(false)}
          onDoubleClick={handleResetCanvas}
          onContextMenu={(event) => event.preventDefault()}
          onAuxClick={(event) => {
            if (event.button === 1) event.preventDefault()
          }}
          onWheel={handleViewportWheel}
        >
          {showGuide && (
            <div className="playground-guide" data-playground-ui="true">
              <div className="playground-guide__header">
                <p className="playground-guide__title">How to use this board</p>
                <p className="playground-guide__intro">
                  Drag to explore. Click a card to inspect a design.
                </p>
              </div>
              {playgroundGuideSections.map((section) => (
                <div key={section.title} className="playground-guide__section">
                  <p className="playground-guide__section-title">{section.title}</p>
                  <ul className="playground-guide__list">
                    {section.items.map((item) => (
                      <li key={`${section.title}-${item.action}`} className="playground-guide__row">
                        <span className="playground-guide__keys">
                          {item.keys.map((key) => (
                            <kbd key={key} className="playground-guide__key">
                              {key}
                            </kbd>
                          ))}
                        </span>
                        <span className="playground-guide__action">{item.action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div
            className={`playground-liquid-cursor ${showCursor && !isHandTool && !isPanning ? 'is-visible' : ''} ${
              isPanning ? 'is-panning' : ''
            }`}
            style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
            aria-hidden
          />
          <div className="playground-heading rise rise-2" aria-hidden>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-vault-muted mb-3">
              Playground
            </p>
            <h1 className="display text-2xl md:text-4xl leading-tight italic text-vault-muted mb-1">
              Beautiful designs, in motion.
            </h1>
            <p className="font-mono text-[11px] text-vault-muted/70">
              Drag to roam. Drag cards to remix.
            </p>
          </div>
          <div
            className="playground-canvas"
            style={{
              width: `${WORLD_WIDTH}px`,
              height: `${WORLD_HEIGHT}px`,
              transform: `translate3d(${renderOffset.x}px, ${renderOffset.y}px, 0)`,
            }}
          >
            <div className="playground-ambient playground-ambient--one" />
            <div className="playground-ambient playground-ambient--two" />
            <div className="playground-ambient playground-ambient--three" />
            <div className="playground-grid" />
            {stackedCards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                data-playground-card="true"
                className={`playground-card playground-card--${i % 3} rise ${
                  i % 2 === 0 ? 'rise-4' : 'rise-5'
                } ${draggingId === card.id ? 'is-dragging' : ''}`}
                style={{
                  left: `${card.px}px`,
                  top: `${card.py}px`,
                  width: `${card.pw}px`,
                  height: `${card.ph}px`,
                  zIndex: card.z,
                  '--plg-rotate': `${card.rotate}deg`,
                }}
                onPointerDown={(event) => handleCardPointerDown(event, card)}
                onPointerMove={(event) => handleCardPointerMove(event, card)}
                onPointerLeave={resetCardHover}
                onPointerUp={(event) => clearCardInteraction(event, card)}
                onPointerCancel={(event) => clearCardInteraction(event, card)}
                onClick={(event) => handleCardClick(card, event)}
                aria-label={`Open ${card.title}`}
              >
                <span className="playground-card__frame">
                  <img
                    src={card.src}
                    alt={card.title}
                    className="playground-card__image"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="playground-card__meta">
                  <span>{card.id}</span>
                  <span>{card.tag}</span>
                </span>
                <span className="playground-card__title">{card.title}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <EvidenceLightbox
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        src={activeItem?.src}
        alt={activeItem?.title}
        figure={activeItem?.id}
        caption={activeItem?.caption}
        motionOrigin={lightboxOrigin}
      />
    </main>
  )
}
