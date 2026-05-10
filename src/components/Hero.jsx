import EmailActions from './EmailActions'

export default function Hero() {
  return (
    <section className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
      <div className="flex items-center justify-between mb-16 md:mb-24 text-sm">
        <span
          className="font-mono text-muted rise rise-1 shrink-0"
          aria-label="Petkov Chakalov"
        >
          <span className="md:hidden" aria-hidden="true">P.C.</span>
          <span className="hidden md:inline" aria-hidden="true">Petkov Chakalov</span>
        </span>
        <nav className="flex items-center gap-4 md:gap-8 font-mono text-muted rise rise-1">
          <a
            href="#work"
            aria-current="page"
            className="text-ink border-b border-ink pb-0.5"
          >
            Work
          </a>
          <a href="/about" className="hover:text-ink transition-colors">About</a>
          <EmailActions />
        </nav>
      </div>

      <h1 className="display text-[12vw] md:text-[8vw] lg:text-[6.5vw] leading-[1] mb-8 md:mb-10 text-balance rise rise-2">
        I took an AI product
        <br />
        <span className="italic text-muted">from MVP to paying companies.</span>
      </h1>

      <div className="grid md:grid-cols-12 gap-6 md:gap-12 mb-10 md:mb-14 rise rise-3">
        <div className="md:col-span-7 md:col-start-2">
          <p className="text-base md:text-xl leading-relaxed text-pretty max-w-prose">
            Founding product designer and design engineer. I designed the
            brand, the system, and the workflows from zero, then learned to
            ship UI directly to production alongside the engineers.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 md:gap-12 rise rise-4">
        <div className="md:col-span-7 md:col-start-2 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 font-mono text-xs text-muted">
          <div>
            <div className="text-ink text-base md:text-lg font-sans">10M</div>
            <div>user records</div>
          </div>
          <div>
            <div className="text-ink text-base md:text-lg font-sans">2</div>
            <div>paying B2B companies</div>
          </div>
          <div>
            <div className="text-ink text-base md:text-lg font-sans">18 mo</div>
            <div>MVP to production</div>
          </div>
          <div>
            <div className="text-ink text-base md:text-lg font-sans">1</div>
            <div>design + code owner</div>
          </div>
        </div>
        <div className="md:col-span-3 md:col-start-10 flex flex-col gap-5 text-sm font-mono text-muted">
          <div className="space-y-1">
            <div className="text-ink">Lagos · open globally</div>
            <div>Founding designer / design engineer</div>
          </div>
          <div className="flex flex-col gap-1">
            <a
              href="https://github.com/petkov120"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-ink transition-colors"
              aria-label="GitHub profile (opens in new tab)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 opacity-85"
                aria-hidden
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="inline-flex items-center gap-1">
                GitHub
                <span aria-hidden>↗</span>
              </span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-ink transition-colors"
              aria-label="Download resume (PDF opens in new tab)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 opacity-85"
                aria-hidden
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h8" />
                <path d="M8 9h2" />
              </svg>
              <span className="inline-flex items-center gap-1">
                Resume
                <span aria-hidden>↓</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
