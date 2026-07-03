import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

const accentColors = {
  clinify: '#3b82f6',
  universityx: '#e07a5f',
  treatmentpath: '#5c7a6b',
}

const AnnotationCard = forwardRef(function AnnotationCard(
  { annotation, index, active, onSelect, id },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      id={id}
      onClick={() => onSelect(index)}
      className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
        active
          ? 'border-clinify/60 bg-clinify/10'
          : 'border-vault-rule bg-vault/60 hover:border-vault-muted/40 hover:bg-vault-muted/10'
      }`}
      aria-current={active ? 'true' : undefined}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium ${
            active ? 'bg-clinify text-white' : 'bg-vault-muted/20 text-vault-muted'
          }`}
        >
          {index + 1}
        </span>
        <div className="min-w-0 space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-vault-text">
            {annotation.label}
          </p>
          <p className="text-[12px] leading-relaxed text-vault-muted">{annotation.body}</p>
        </div>
      </div>
    </button>
  )
})

export default function EvidenceAnnotatedView({
  src,
  alt,
  annotations = [],
  accent = 'clinify',
  activeIndex,
  onActiveChange,
}) {
  const listId = useId()
  const imageWrapRef = useRef(null)
  const cardRefs = useRef([])
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [connector, setConnector] = useState(null)
  const dotColor = accentColors[accent] ?? accentColors.clinify

  const measure = useCallback(() => {
    const wrap = imageWrapRef.current
    const img = wrap?.querySelector('img')
    if (!wrap || !img) return

    setImageSize({
      width: img.clientWidth,
      height: img.clientHeight,
    })

    const activeCard = cardRefs.current[activeIndex]
    if (!activeCard || !annotations[activeIndex]) {
      setConnector(null)
      return
    }

    const wrapRect = wrap.getBoundingClientRect()
    const cardRect = activeCard.getBoundingClientRect()
    const annotation = annotations[activeIndex]

    const dotX = annotation.x * img.clientWidth
    const dotY = annotation.y * img.clientHeight
    const cardCenterY = cardRect.top + cardRect.height / 2 - wrapRect.top
    const cardEdgeX = cardRect.left - wrapRect.left

    setConnector({
      x1: dotX,
      y1: dotY,
      x2: Math.max(dotX + 20, Math.min(cardEdgeX - 4, wrapRect.width + 120)),
      y2: cardCenterY,
    })
  }, [activeIndex, annotations])

  useLayoutEffect(() => {
    measure()
  }, [measure, activeIndex, annotations.length])

  useEffect(() => {
    const wrap = imageWrapRef.current
    const img = wrap?.querySelector('img')
    if (!img) return

    const observer = new ResizeObserver(measure)
    observer.observe(img)
    if (wrap) observer.observe(wrap)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const activeAnnotation = annotations[activeIndex]

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted">
          Guided exhibit · {activeIndex + 1} of {annotations.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onActiveChange(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="inline-flex min-h-9 items-center justify-center rounded border border-vault-rule px-3 font-mono text-[10px] uppercase tracking-wider text-vault-text disabled:opacity-30"
            aria-label="Previous annotation"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() =>
              onActiveChange(Math.min(annotations.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === annotations.length - 1}
            className="inline-flex min-h-9 items-center justify-center rounded border border-vault-rule px-3 font-mono text-[10px] uppercase tracking-wider text-vault-text disabled:opacity-30"
            aria-label="Next annotation"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_252px] lg:items-start lg:gap-5">
        <div ref={imageWrapRef} className="relative w-full">
          <img
            src={src}
            alt={alt}
            className="block w-full max-w-full object-contain"
            style={{ maxHeight: 'min(72dvh, 1100px)' }}
            loading="eager"
            decoding="async"
            onLoad={measure}
          />

          {imageSize.width > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              {annotations.map((annotation, index) => {
                const cx = annotation.x * imageSize.width
                const cy = annotation.y * imageSize.height
                const isActive = index === activeIndex

                if (!isActive) return null

                return (
                  <g key={annotation.id ?? index}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={14}
                      fill={dotColor}
                      fillOpacity={0.18}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={dotColor}
                      stroke="white"
                      strokeWidth={2}
                    />
                  </g>
                )
              })}

              {connector && (
                <line
                  x1={connector.x1}
                  y1={connector.y1}
                  x2={connector.x2}
                  y2={connector.y2}
                  stroke={dotColor}
                  strokeWidth={1.5}
                  strokeOpacity={0.9}
                  strokeDasharray="5 4"
                />
              )}
            </svg>
          )}

          {annotations.map((annotation, index) => (
            <button
              key={`pin-${annotation.id ?? index}`}
              type="button"
              onClick={() => onActiveChange(index)}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform ${
                index === activeIndex ? 'h-7 w-7' : 'h-6 w-6'
              }`}
              style={{
                left: `${annotation.x * 100}%`,
                top: `${annotation.y * 100}%`,
              }}
              aria-label={`${index + 1}. ${annotation.label}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <span
                className={`flex items-center justify-center rounded-full font-mono text-[9px] font-medium text-white ${
                  index === activeIndex ? 'h-5 w-5 bg-clinify' : 'h-4 w-4 bg-clinify/70'
                }`}
              >
                {index + 1}
              </span>
            </button>
          ))}
        </div>

        <aside id={listId} className="space-y-2 lg:sticky lg:top-2" aria-label="UI explanations">
          <div className="space-y-2 md:hidden">
            <AnnotationCard
              annotation={activeAnnotation}
              index={activeIndex}
              active
              onSelect={onActiveChange}
              id={`${listId}-active`}
            />
            <p className="font-mono text-[10px] text-vault-muted/80">
              Tap a numbered pin or use Prev / Next
            </p>
          </div>

          <div className="hidden space-y-2 md:block">
            {annotations.map((annotation, index) => (
              <AnnotationCard
                key={annotation.id ?? index}
                ref={(node) => {
                  cardRefs.current[index] = node
                }}
                annotation={annotation}
                index={index}
                active={index === activeIndex}
                onSelect={onActiveChange}
                id={`${listId}-${index}`}
              />
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-3 space-y-2 md:hidden">
        {annotations.map((annotation, index) =>
          index !== activeIndex ? (
            <AnnotationCard
              key={`mobile-${annotation.id ?? index}`}
              annotation={annotation}
              index={index}
              active={false}
              onSelect={onActiveChange}
            />
          ) : null,
        )}
      </div>
    </div>
  )
}
