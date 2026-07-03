const accentLabel = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

export default function ResultsStrip({ results, accent = 'clinify' }) {
  if (!results?.items?.length) return null

  const labelClass = accentLabel[accent] ?? accentLabel.clinify

  return (
    <section className="results-strip pt-10 md:pt-12">
      <p className={`dossier-section-kicker mb-8 md:mb-10 ${labelClass}`}>
        {results.label ?? 'Outcomes'}
      </p>
      <ul className="results-strip__grid grid gap-5 sm:grid-cols-3">
        {results.items.map((item) => (
          <li
            key={item.detail}
            className="results-strip__item rounded-lg border border-vault-rule bg-vault/35 px-5 py-6 md:px-6 md:py-7"
          >
            <p className="dossier-statement display text-3xl md:text-4xl leading-none mb-3">
              {item.value}
            </p>
            <p className="dossier-body-muted text-pretty text-base md:text-[1.0625rem]">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
