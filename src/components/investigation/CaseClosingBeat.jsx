import { useState } from 'react'
import CaseStoicFigure from '../cinematic/CaseStoicFigure'
import TypewriterText from '../motion/TypewriterText'
import ReaderLetterModal from '../motion/ReaderLetterModal'

const EMAIL = 'petkovrichard8@gmail.com'

export default function CaseClosingBeat({
  accent,
  showFigure = false,
  closingText = 'Thanks for reading.',
  closingFigure,
  noteButtonLabel = 'A note from the author',
  note,
}) {
  const [letterOpen, setLetterOpen] = useState(false)

  const openLetter = () => setLetterOpen(true)
  const closeLetter = () => setLetterOpen(false)

  return (
    <>
      {showFigure && (
        <CaseStoicFigure
          src={closingFigure?.src}
          accent={accent}
          onOpen={openLetter}
          letterOpen={letterOpen}
        />
      )}

      <TypewriterText
        text={closingText}
        className={showFigure ? 'mt-6 md:mt-8' : 'mt-8 md:mt-12'}
      />

      <div className="case-closing-cta mt-8 md:mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <a
          href={`mailto:${EMAIL}`}
          className="case-closing-cta__primary inline-flex items-center gap-2 font-mono text-sm border border-vault-rule rounded-full px-6 py-3 text-vault-text transition-colors hover:border-vault-muted hover:bg-vault/40"
        >
          Let&apos;s talk
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="/"
          className="font-mono text-xs uppercase tracking-[0.12em] text-vault-muted transition-colors hover:text-vault-text"
        >
          Back to investigations
        </a>
      </div>

      {!showFigure && (
        <div className="author-note-link-wrap">
          <button
            type="button"
            className="author-note-link"
            onClick={openLetter}
            aria-expanded={letterOpen}
            aria-haspopup="dialog"
          >
            {noteButtonLabel}
            <span aria-hidden="true"> →</span>
          </button>
        </div>
      )}

      <ReaderLetterModal open={letterOpen} onClose={closeLetter} accent={accent} letter={note} />
    </>
  )
}
