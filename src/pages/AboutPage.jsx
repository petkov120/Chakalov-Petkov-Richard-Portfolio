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

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              What I bring
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-5 space-y-5 text-lg md:text-xl leading-relaxed text-pretty">
            <p>
              I bridge design and engineering in early-stage teams where speed,
              clarity, and ownership matter.
            </p>
            <p>
              I am strongest on products that are operationally complex: dense
              data, high trust requirements, and workflows that need to feel
              simple to non-technical users.
            </p>
            <p className="text-muted">
              Lagos. Open to founding designer and design engineer roles
              globally.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
