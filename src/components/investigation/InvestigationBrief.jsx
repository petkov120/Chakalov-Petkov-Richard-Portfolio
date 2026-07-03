export default function InvestigationBrief({ overview, problem }) {
  if (!overview && !problem) return null

  return (
    <section className="investigation-case-brief pb-12 md:pb-16 mb-10 md:mb-14 border-b border-vault-rule">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-2 pt-1">
          <p className="dossier-section-kicker">Case brief</p>
        </div>

        <div className="md:col-span-10 space-y-10 max-w-prose">
          {overview && (
            <div>
              <p className="dossier-label">What it is</p>
              <p className="dossier-body text-pretty">{overview}</p>
            </div>
          )}

          {problem && (
            <div>
              <p className="dossier-label">The problem</p>
              <p className="dossier-body-muted text-pretty">{problem}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
