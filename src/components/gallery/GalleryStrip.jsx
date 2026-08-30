import { useRef, useState } from 'react'

const DRAG_THRESHOLD = 10

export default function GalleryStrip({ items, caption, label }) {
  const scrollerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeStates, setActiveStates] = useState({})
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    pointerId: null,
  })

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch' || event.button !== 0) return
    const node = scrollerRef.current
    if (!node) return
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: node.scrollLeft,
      pointerId: event.pointerId,
    }
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    const node = scrollerRef.current
    if (!drag.active || !node) return
    const delta = event.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return
      drag.moved = true
      node.setPointerCapture(drag.pointerId)
      setIsDragging(true)
    }
    node.scrollLeft = drag.startScroll - delta
  }

  const endDrag = () => {
    const drag = dragRef.current
    const node = scrollerRef.current
    if (drag.pointerId != null && node?.hasPointerCapture?.(drag.pointerId)) {
      node.releasePointerCapture(drag.pointerId)
    }
    dragRef.current.active = false
    dragRef.current.pointerId = null
    setIsDragging(false)
  }

  const handleClickCapture = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragRef.current.moved = false
    }
  }

  const advanceScreen = (item) => {
    if (!item.states?.length) return
    setActiveStates((current) => ({
      ...current,
      [item.id]: ((current[item.id] ?? 0) + 1) % item.states.length,
    }))
  }

  return (
    <div className="gallery-strip">
      {label ? (
        <p className="gallery-strip__label font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {label}
        </p>
      ) : null}
      <div
        ref={scrollerRef}
        className={`gallery-strip__row no-scrollbar${isDragging ? ' is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
      >
        {items.map((item) => {
          const screen = item.states?.[activeStates[item.id] ?? 0] ?? item.src
          return (
          <button
            key={item.id}
            type="button"
            className={`gallery-device gallery-device--${item.frame}`}
            aria-label={`${item.alt}. Tap to show the next screen.`}
            onClick={() => advanceScreen(item)}
          >
            <span className="gallery-device__bezel">
              {item.frame === 'phone' ? <span className="gallery-device__island" aria-hidden /> : null}
              {item.frame === 'window' ? (
                <span className="gallery-device__chrome" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
              <span className="gallery-device__screen">
                <img key={screen} src={screen} alt="" loading="eager" decoding="async" />
              </span>
            </span>
          </button>
          )
        })}
      </div>
      {caption ? <p className="gallery-strip__caption">{caption}</p> : null}
    </div>
  )
}
