export default function Footer() {
  return (
    <footer className="px-6 md:px-12 py-16 max-w-wide mx-auto">
      <div className="rule mb-16" />

      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
        <div className="md:col-span-7">
          <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-6">
            Let's talk.
          </h2>
          <a
            href="mailto:hello@example.com"
            className="display text-3xl md:text-4xl italic text-accent hover:underline underline-offset-4"
          >
            hello@example.com
          </a>
        </div>

        <div className="md:col-span-5 flex flex-col md:items-end gap-2 font-mono text-sm text-muted">
          <a href="#" className="hover:text-ink transition-colors">LinkedIn ↗</a>
          <a
            href="https://github.com/petkov120"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            GitHub ↗
          </a>
          <a href="#" className="hover:text-ink transition-colors">Twitter / X ↗</a>
          <a href="#" className="hover:text-ink transition-colors">Read.cv ↗</a>
        </div>
      </div>

      <div className="rule mt-16 pt-6 flex justify-between font-mono text-xs text-muted">
        <span>© 2026 Petkov Chakalov</span>
        <span>Built in Cursor. Hosted on Vercel.</span>
      </div>
    </footer>
  )
}
