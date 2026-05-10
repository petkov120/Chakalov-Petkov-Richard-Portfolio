export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
        <div className="flex items-center justify-between mb-16 md:mb-24 text-sm">
          <span className="font-mono text-muted rise rise-1">Petkov Chakalov</span>
          <nav className="flex gap-6 md:gap-8 font-mono text-muted rise rise-1">
            <a href="/" className="hover:text-ink transition-colors">Work</a>
            <a href="mailto:petkovrichard8@gmail.com" className="hover:text-ink transition-colors">Email</a>
          </nav>
        </div>

        <h1 className="display text-5xl md:text-7xl leading-[0.95] mb-12 md:mb-16 text-balance rise rise-2">
          About me.
        </h1>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              Background
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5 space-y-5 text-lg md:text-xl leading-relaxed text-pretty">
            <p>
              I joined a healthcare AI startup at MVP stage and helped shape the
              product from zero to active usage with paying customers.
            </p>
            <p>
              My work started in brand and product design, then expanded into
              implementation. I learned React inside a live codebase so I could
              reduce bottlenecks and ship UI directly.
            </p>
            <p>
              While backend engineers focused on API structure and data systems,
              I focused on the product face and flow: design system, user
              journeys, and production-ready front-end features.
            </p>
          </div>
        </div>

        <div className="rule my-16" />

        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              Hackathon
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5 space-y-4">
            <figure className="rounded-md overflow-hidden border border-rule bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
              <img
                src="/images/hackathon.jpg?v=2"
                alt="Petkov and team holding Hackaholics 5.0 3rd Runner Up award"
                className="w-full h-auto"
              />
              <figcaption className="text-xs font-mono text-muted px-4 py-3 border-t border-rule">
                Hackaholics 5.0 — 3rd Runner Up (University Track)
              </figcaption>
            </figure>
            <p className="text-lg md:text-xl leading-relaxed text-pretty">
              This was where I learned to build practical education solutions
              under pressure, before I later transitioned into health tech and
              applied the same product mindset to higher-stakes workflows.
            </p>
          </div>
        </div>

        <div className="rule my-16" />

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              What I bring
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5 space-y-5 text-lg md:text-xl leading-relaxed text-pretty">
            <p>
              I love building SaaS products, especially the boring but critical
              parts that teams often avoid until they become painful.
            </p>
            <p>
              Give me messy workflows, operational edge cases, trust-heavy
              interfaces, and dense data that still needs to feel clear for
              everyday users. That is where I do my best work.
            </p>
            <p className="text-muted">
              Lagos. Open to founding designer and design engineer roles
              globally.
            </p>
            <p className="text-muted">
              Outside work: reading manga and drinking green tea.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
