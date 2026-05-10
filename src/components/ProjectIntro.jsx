export default function ProjectIntro() {
  return (
    <section id="work" className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="rule mb-16 md:mb-20" />

      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
            The work
          </div>
          <div className="font-mono text-xs text-muted space-y-1">
            <div>2024 to now</div>
            <div>Founding designer</div>
            <div>& design engineer</div>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-5">
          <h2 className="display text-4xl md:text-6xl leading-[1] mb-6 text-balance">
            A US healthcare AI platform
            <span className="italic text-muted"> care teams open every morning.</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-pretty max-w-prose mb-3">
            10M member records. Multi-channel outreach including AI voice
            agents. ML tools that translate dense models into decisions
            clinicians make in two minutes.
          </p>
          <p className="font-mono text-xs text-muted">
            Anonymized for the portfolio. Six chapters of decisions below.
          </p>
        </div>
      </div>
    </section>
  )
}
