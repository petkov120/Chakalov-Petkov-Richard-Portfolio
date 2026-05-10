import { useRef, useState, useEffect } from 'react'

export default function Showcase({ items = [] }) {
  const scrollerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })
  const [lightboxItem, setLightboxItem] = useState(null)

  const onMouseDown = (e) => {
    const el = scrollerRef.current
    if (!el) return
    setIsDragging(true)
    setHasDragged(false)
    dragState.current = {
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    }
  }

  const onMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const el = scrollerRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - dragState.current.startX) * 1.2
    if (Math.abs(walk) > 4) setHasDragged(true)
    el.scrollLeft = dragState.current.scrollLeft - walk
  }

  const stopDragging = () => setIsDragging(false)

  const onWheel = (e) => {
    const el = scrollerRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY
    }
  }

  useEffect(() => {
    if (!lightboxItem) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxItem(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxItem])

  const handleTileClick = (item) => {
    if (hasDragged) return
    if (isPlaceholder(item)) return
    setLightboxItem(item)
  }

  return (
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-12 max-w-wide mx-auto">
        <div className="rule mb-16" />
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              Showcase
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5">
            <h2 className="display text-4xl md:text-5xl leading-[1.05] mb-4 text-balance">
              Loose pieces, components, and screens that didn't make the case study.
            </h2>
            <p className="font-mono text-xs text-muted">
              Drag to explore <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onWheel={onWheel}
        className={`overflow-x-auto overflow-y-hidden no-scrollbar select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        <div className="flex gap-4 md:gap-6 px-6 md:px-12 pb-2">
          <div className="hidden md:block shrink-0 w-0" />
          {items.map((item, i) => (
            <Tile key={i} item={item} onClick={() => handleTileClick(item)} />
          ))}
          <div className="shrink-0 w-12 md:w-32" aria-hidden="true" />
        </div>
      </div>

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </section>
  )
}

function Tile({ item, onClick }) {
  const placeholder = isPlaceholder(item)
  return (
    <figure
      onClick={onClick}
      className="shrink-0 w-[86vw] md:w-[620px] group"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className={`rounded-md overflow-hidden border ${
          placeholder
            ? 'aspect-[4/3] border-dashed border-muted/40 bg-white/40 flex items-center justify-center'
            : 'border-rule shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] cursor-zoom-in'
        }`}
      >
        {placeholder ? (
          <PlaceholderContents item={item} />
        ) : (
          <img
            src={item.src}
            alt={item.alt || item.label}
            className="w-full h-auto transition-transform duration-200 ease-out group-hover:scale-[1.005] pointer-events-none"
            loading="lazy"
            draggable={false}
          />
        )}
      </div>
      {item.caption && (
        <figcaption className="mt-3 text-xs font-mono text-muted leading-relaxed">
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}

function PlaceholderContents({ item }) {
  return (
    <div className="px-6 text-center flex flex-col items-center gap-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Put image here
      </div>
      {item.label && (
        <div className="font-serif italic text-xl text-ink/60 leading-tight max-w-xs text-balance">
          {item.label}
        </div>
      )}
      {item.hint && (
        <div className="font-mono text-xs text-muted/80 mt-1">
          {item.hint}
        </div>
      )}
    </div>
  )
}

function Lightbox({ item, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6 md:p-12 cursor-zoom-out animate-[fadeIn_0.2s_ease-out]"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 font-mono text-xs uppercase tracking-widest text-paper/70 hover:text-paper transition-colors"
      >
        Close (Esc) ✕
      </button>
      <figure
        onClick={(e) => e.stopPropagation()}
        className="max-w-6xl max-h-full flex flex-col items-center gap-4 cursor-default"
      >
        <img
          src={item.src}
          alt={item.alt || item.label}
          className="max-w-full max-h-[80vh] object-contain rounded-md border border-paper/10"
        />
        {item.caption && (
          <figcaption className="font-mono text-xs text-paper/70 max-w-xl text-center">
            {item.caption}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

function isPlaceholder(item) {
  return !item.src || item.src.startsWith('PLACEHOLDER')
}
