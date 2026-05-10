export default function ProjectIntro() {
  return (
    <section id="work" className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="rule mb-16 md:mb-20" />

      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
            Selected work
          </div>
          <div className="font-mono text-xs text-muted space-y-1">
            <div>2024 to now</div>
            <div>Founding Product Designer</div>
            <div>& Design Engineer</div>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-5">
          <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-8 text-balance">
            A US healthcare<br />
            AI startup.
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-pretty max-w-prose">
            Anonymized for the portfolio. The product is an agentic CRM for
            healthcare, a platform where care managers, payers, and clinical
            teams work alongside AI agents that handle drug to drug interactions,
            population insights, and member outreach via voice and SMS.
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-pretty max-w-prose mt-5">
            I joined at MVP. Below is the story of the eighteen months that
            followed, in six chapters.
          </p>
        </div>
      </div>
    </section>
  )
}
