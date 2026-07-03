import EvidenceFrame from './EvidenceFrame'

export default function NotBuiltSection({ items = [] }) {
  if (!items.length) return null

  return (
    <section className="pt-8 border-t border-vault-rule">
      <div className="-mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-4 md:px-8 py-10 md:py-12 shadow-evidence not-built-surface text-[#1D1C1D]">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#616061] mb-3">
              Things we didn't build
            </div>
            <p className="text-base md:text-lg leading-relaxed text-[#1D1C1D]/85 text-pretty max-w-prose">
              Great product designers remove more than they add.
            </p>
          </div>
        </div>

        <div className="space-y-10 md:space-y-12">
          {items.map((item, i) => (
            <article
              key={item.title}
              className={`grid gap-6 md:gap-10 items-start ${
                item.evidence ? 'md:grid-cols-12' : 'max-w-prose'
              } ${i > 0 ? 'pt-10 md:pt-12 border-t border-[#e8e8e8]' : ''}`}
            >
              <div className={`space-y-3 ${item.evidence ? 'md:col-span-4' : ''}`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#616061]">
                  Killed
                </div>
                <h3 className="display text-2xl md:text-3xl leading-tight text-balance">
                  {item.title}
                </h3>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#616061] mb-1.5">
                    What we saw
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-[#1D1C1D]/85 text-pretty">
                    {item.reason}
                  </p>
                </div>
                {item.seeAlso && (
                  <p className="font-mono text-[10px] leading-relaxed text-[#616061] border-l-2 border-[#e8e8e8] pl-3">
                    {item.seeAlso}
                  </p>
                )}
              </div>

              {item.evidence && (
                <div className="md:col-span-8">
                  <EvidenceFrame {...item.evidence} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
