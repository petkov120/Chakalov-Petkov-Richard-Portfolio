const accentLabel = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

export default function EngineeringStrip({ engineering, accent = 'clinify' }) {
  if (!engineering?.items?.length) return null

  const labelClass = accentLabel[accent] ?? accentLabel.clinify

  return (
    <section className="engineering-strip pt-10 md:pt-12">
      <p className={`dossier-section-kicker mb-6 md:mb-7 ${labelClass}`}>
        {engineering.label ?? 'Engineering decisions'}
      </p>
      <div className="-mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-4 py-8 md:px-8 md:py-10 shadow-evidence text-[#1D1C1D]">
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {engineering.items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-[#e8e8e8] px-4 py-4 md:px-5 md:py-5"
            >
              <p className="text-sm md:text-[0.975rem] leading-relaxed text-pretty text-[#1D1C1D]/90">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
