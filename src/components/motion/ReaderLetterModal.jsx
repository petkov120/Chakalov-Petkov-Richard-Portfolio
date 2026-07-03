import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { readerLetter as defaultReaderLetter } from '../../data/readerLetter'

export default function ReaderLetterModal({
  open,
  onClose,
  accent = 'clinify',
  letter = defaultReaderLetter,
}) {
  const titleId = useId()
  const closeRef = useRef(null)
  const readerLetter = letter ?? defaultReaderLetter

  useEffect(() => {
    if (!open) return undefined

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="reader-letter-modal fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-vault/80 backdrop-blur-sm reader-letter-modal__backdrop"
        aria-label="Close letter"
        onClick={onClose}
      />

      <div
        className={`reader-letter-modal__panel reader-letter-modal__panel--${accent} relative z-10 w-full md:max-w-lg max-h-[min(88dvh,720px)] overflow-auto rounded-t-2xl md:rounded-xl bg-[#f7f4ef] px-6 py-8 md:px-10 md:py-10 shadow-evidence`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 md:right-4 md:top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#cfcbc4] bg-white/70 font-mono text-[10px] uppercase tracking-wider text-[#6b6966] transition-colors hover:bg-white/90 hover:text-[#6b6966] hover:border-[#bdb7ad]"
        >
          Close
        </button>

        <p
          id={titleId}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6b6966] mb-6 pr-12"
        >
          {readerLetter.kicker}
        </p>

        <p className="display text-2xl md:text-3xl text-[#1a1a1a] mb-6 italic">
          {readerLetter.greeting}
        </p>

        <div className="space-y-4 text-base md:text-lg leading-relaxed text-[#3d3b38] text-pretty">
          {readerLetter.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#cfcbc4]">
          <p className="display text-xl md:text-2xl text-[#1a1a1a] italic">
            {readerLetter.signOff}
          </p>
          <a
            href={`mailto:${readerLetter.email}`}
            className="mt-3 inline-block font-mono text-sm text-[#6b6966] transition-colors hover:text-[#1a1a1a]"
          >
            {readerLetter.email}
          </a>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b6966]">
            {readerLetter.meta}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
