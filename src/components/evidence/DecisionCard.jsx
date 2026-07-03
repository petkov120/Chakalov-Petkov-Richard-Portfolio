function figHref(ref) {
  const match = ref.match(/Fig\.?\s*([\d.]+)/i)
  if (!match) return null
  return `#fig-${match[1].replace(/\./g, '-')}`
}

function FieldCell({ label, children, className = '' }) {
  return (
    <div className={`px-5 py-5 md:px-6 md:py-6 ${className}`}>
      <p className="font-mono text-[11px] text-[#616061] mb-2.5">{label}</p>
      <p className="text-sm md:text-[15px] leading-relaxed text-[#1D1C1D]/85 text-pretty">
        {children}
      </p>
    </div>
  )
}

export default function DecisionCard({
  decision,
  why,
  tradeoff,
  outcome,
  refs = [],
  index,
  className = '',
  accent = 'clinify',
}) {
  const isUniversityX = accent === 'universityx'
  const cardShell = isUniversityX
    ? 'py-9 md:py-10 -mx-4 md:-mx-8 rounded-xl border px-4 md:px-8 decision-card-surface decision-card--universityx text-[#2f2924]'
    : 'py-10 md:py-12 -mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-4 md:px-8 shadow-evidence decision-card-surface text-[#1D1C1D]'
  const indexLabel = index != null ? String(index).padStart(2, '0') : null
  const evidenceGrid = isUniversityX
    ? `grid border ${why && tradeoff ? 'md:grid-cols-2 md:divide-x divide-y' : 'grid-cols-1'} decision-card--universityx-grid`
    : `grid border border-[#e8e8e8] divide-[#e8e8e8] ${
        why && tradeoff
          ? 'md:grid-cols-2 md:divide-x divide-y'
          : 'grid-cols-1'
      }`
  const outcomeShell = isUniversityX
    ? 'border border-t-0 px-5 py-6 md:px-6 md:py-7 decision-card--universityx-grid'
    : 'border border-t-0 border-[#e8e8e8] px-5 py-6 md:px-6 md:py-7'

  return (
    <article
      className={`${cardShell} ${className}`}
    >
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          {indexLabel && (
            <span
              className={`font-mono text-xs block mb-4 ${
                isUniversityX
                  ? 'decision-card--universityx-index'
                  : 'text-[#616061]'
              }`}
            >
              {isUniversityX ? `Case ${indexLabel}` : indexLabel}
            </span>
          )}
          <h3 className="display text-2xl md:text-3xl leading-tight text-balance">
            {decision}
          </h3>
          {refs.length > 0 && (
            <p
              className={`mt-5 font-mono text-[10px] leading-relaxed ${
                isUniversityX
                  ? 'text-[#775f4e]'
                  : 'text-[#616061]'
              }`}
            >
              {refs.map((ref, i) => {
                const href = figHref(ref)
                return (
                  <span key={ref}>
                    {i > 0 && ' · '}
                    {href ? (
                      <a
                        href={href}
                        className="text-[#1264A3] underline decoration-[#e8e8e8] underline-offset-[3px] hover:text-[#1D1C1D] transition-colors"
                      >
                        {ref}
                      </a>
                    ) : (
                      ref
                    )}
                  </span>
                )
              })}
            </p>
          )}
        </div>

        <div className="md:col-span-8">
          {(why || tradeoff) && (
            <div className={evidenceGrid}>
              {why && (
                <FieldCell label={isUniversityX ? 'Evidence' : 'What we saw'}>
                  {why}
                </FieldCell>
              )}
              {tradeoff && (
                <FieldCell label={isUniversityX ? 'Constraint' : 'Gave up'}>
                  {tradeoff}
                </FieldCell>
              )}
            </div>
          )}

          {outcome && (
            <div className={outcomeShell}>
              <p className="font-mono text-[11px] text-[#616061] mb-3">Outcome</p>
              <p className="font-serif text-xl md:text-2xl leading-snug text-[#1D1C1D] text-pretty">
                {outcome}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
