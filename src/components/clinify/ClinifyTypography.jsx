const THESIS_WORD = 'trust'
const STAKES_ACCENT = 'compliance'

export function QuestionWithThesis({ question, className = '' }) {
  const lower = question.toLowerCase()
  const idx = lower.indexOf(THESIS_WORD)

  if (idx === -1) {
    return <span className={className}>{question}</span>
  }

  const before = question.slice(0, idx)
  const word = question.slice(idx, idx + THESIS_WORD.length)
  const after = question.slice(idx + THESIS_WORD.length)

  return (
    <span className={className}>
      {before}
      <span className="hero-thesis-word">
        <span className="hero-thesis-word__ghost" aria-hidden>
          {word}
        </span>
        {word}
      </span>
      {after}
    </span>
  )
}

export function StakesWithAccent({ text, className = '' }) {
  const re = new RegExp(`(${STAKES_ACCENT})`, 'i')
  const parts = text.split(re)

  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === STAKES_ACCENT.toLowerCase() ? (
          <span key={`${part}-${i}`} className="text-constraint-accent">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  )
}
