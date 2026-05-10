export default function Hero() {
  return (
    <section className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
      <div className="flex items-center justify-between mb-16 md:mb-24 text-sm">
        <span className="font-mono text-muted rise rise-1">Petkov Chakalov</span>
        <nav className="flex gap-6 md:gap-8 font-mono text-muted rise rise-1">
          <a
            href="#work"
            aria-current="page"
            className="text-ink border-b border-ink pb-0.5"
          >
            Work
          </a>
          <a href="/about" className="hover:text-ink transition-colors">About</a>
          <a href="mailto:petkovrichard8@gmail.com" className="hover:text-ink transition-colors">Email</a>
        </nav>
      </div>

      <h1 className="display text-[14vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.95] mb-12 md:mb-20 text-balance rise rise-2">
        Founding Product Designer<br />
        <span className="italic text-muted">& Design Engineer.</span>
      </h1>

      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-7 md:col-start-2 space-y-6 text-lg md:text-xl leading-relaxed text-pretty rise rise-3">
          <p>
            I joined a US healthcare AI startup at MVP. Eighteen months later,
            two companies pay to use what we built and care managers open it
            every morning.
          </p>
          <p>
            I built the brand, the design system, and the workflows from zero.
            I learned React because the work asked for it. Now I design and
            build features end-to-end.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-10 flex md:flex-col gap-6 md:gap-2 text-sm font-mono text-muted rise rise-4">
          <div>
            <div className="text-ink">Lagos</div>
            <div>Open globally</div>
            <a
              href="https://github.com/petkov120"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              github.com/petkov120 ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
