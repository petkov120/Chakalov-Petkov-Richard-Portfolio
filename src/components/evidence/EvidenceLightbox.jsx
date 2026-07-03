import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EvidenceAnnotatedView from './EvidenceAnnotatedView'

const LIGHTBOX_CLOSE_MS = 320

export default function EvidenceLightbox({
  open,
  onClose,
  src,
  alt,
  figure,
  caption,
  annotations,
  accent = 'clinify',
  motionOrigin,
}) {
  const titleId = useId()
  const closeRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [presented, setPresented] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const hasAnnotations = Boolean(presented?.annotations?.length)

  useEffect(() => {
    if (!open || !src) return
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setPresented({
      src,
      alt,
      figure,
      caption,
      annotations,
      accent,
      motionOrigin,
    })
    setIsClosing(false)
    setActiveIndex(0)
  }, [open, src, alt, figure, caption, annotations, accent, motionOrigin])

  useEffect(() => {
    if (open || !presented) return
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setPresented(null)
      setIsClosing(false)
      closeTimerRef.current = null
    }, LIGHTBOX_CLOSE_MS)
  }, [open, presented])

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!presented) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!isClosing) {
      closeRef.current?.focus()
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (!hasAnnotations) return

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => Math.min(presented.annotations.length - 1, current + 1))
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => Math.max(0, current - 1))
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [presented, isClosing, onClose, hasAnnotations])

  if (!presented?.src) return null

  return createPortal(
    <div
      className={`evidence-lightbox fixed inset-0 z-[100] flex flex-col bg-vault/95 backdrop-blur-sm ${
        isClosing ? 'is-closing' : 'is-opening'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        '--evidence-origin-x': `${presented.motionOrigin?.x ?? 50}%`,
        '--evidence-origin-y': `${presented.motionOrigin?.y ?? 50}%`,
      }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close expanded image"
        onClick={onClose}
      />

      <div className="relative z-10 flex items-center justify-between gap-4 px-4 pt-4 md:px-6 md:pt-6">
        {(presented.figure || presented.caption) && (
          <p
            id={titleId}
            className="max-w-prose font-mono text-[11px] leading-relaxed text-vault-muted"
          >
            {presented.figure && <>Fig. {presented.figure}</>}
            {presented.caption && (
                <span className="text-vault-text/80">
                  {presented.figure ? '. ' : ''}
                  {presented.caption}
                </span>
            )}
          </p>
        )}

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="ml-auto inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-vault-rule bg-vault/80 px-4 font-mono text-[11px] uppercase tracking-wider text-vault-text transition-colors hover:bg-vault-muted/20"
        >
          Close
        </button>
      </div>

      <div
        className={`evidence-lightbox__stage relative z-10 flex-1 overflow-auto overscroll-contain px-4 pb-6 md:px-6 md:pb-8 ${
          isClosing ? 'is-closing' : 'is-opening'
        }`}
      >
        <div
          className={`mx-auto flex min-h-full w-full flex-col justify-center py-2 ${
            hasAnnotations ? 'max-w-[min(100%,1280px)]' : 'max-w-[min(100%,1100px)] items-center gap-4'
          }`}
        >
          {hasAnnotations ? (
            <EvidenceAnnotatedView
              src={presented.src}
              alt={presented.alt ?? presented.caption ?? `Figure ${presented.figure}`}
              annotations={presented.annotations}
              accent={presented.accent}
              activeIndex={activeIndex}
              onActiveChange={setActiveIndex}
            />
          ) : (
            <>
              <img
                src={presented.src}
                alt={presented.alt ?? presented.caption ?? `Figure ${presented.figure}`}
                className={`evidence-lightbox__image block w-full max-w-full object-contain ${
                  isClosing ? 'is-closing' : 'is-opening'
                }`}
                style={{ maxHeight: 'min(90dvh, 1200px)' }}
                loading="eager"
                decoding="async"
              />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
