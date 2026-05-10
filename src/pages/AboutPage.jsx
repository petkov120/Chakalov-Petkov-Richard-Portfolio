import EmailActions from '../components/EmailActions'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
        <div className="flex items-center justify-between mb-16 md:mb-24 text-sm">
          <a
            href="/"
            className="font-mono text-muted rise rise-1 shrink-0 hover:text-ink transition-colors"
            aria-label="Petkov Chakalov — home"
          >
            <span className="md:hidden" aria-hidden="true">P.C.</span>
            <span className="hidden md:inline" aria-hidden="true">Petkov Chakalov</span>
          </a>
          <nav className="flex items-center gap-4 md:gap-8 font-mono text-muted rise rise-1">
            <a href="/#work" className="hover:text-ink transition-colors">Work</a>
            <span
              aria-current="page"
              className="text-ink border-b border-ink pb-0.5"
            >
              About
            </span>
            <EmailActions />
          </nav>
        </div>

        <h1 className="display text-5xl md:text-7xl leading-[0.95] mb-12 md:mb-16 text-balance rise rise-2">
          A product designer
          <br />
          <span className="italic text-muted">who ships.</span>
        </h1>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              The short version
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5 space-y-4 text-base md:text-xl leading-relaxed text-pretty">
            <p>
              I joined a healthcare AI startup at MVP as lead product designer
              and wore multiple hats to take it from zero to paying customers.
            </p>
            <p>
              I designed the brand, the system, and the workflows. Then I
              learned React inside the live codebase so I could ship UI
              directly. Working alongside full stack engineers and AI
              researchers shaped me into a product developer who connects
              product thinking, design, and implementation.
            </p>
          </div>
        </div>

        <div className="rule my-14 md:my-16" />

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              What I want next
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5 space-y-4 text-base md:text-xl leading-relaxed text-pretty">
            <p>
              I love building SaaS, especially the boring but critical parts
              teams avoid until they get painful. Messy workflows, operational
              edge cases, high trust interfaces, dense data that still has to
              feel clear.
            </p>
            <p className="text-muted">
              Lagos. Open globally. Founding designer or design engineer roles.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
