const EMAIL = 'petkovrichard8@gmail.com'
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Inquiry`

export default function GlobalContactCTA() {
  return (
    <a
      href={MAILTO}
      className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full border border-vault-rule bg-vault px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-vault-text shadow-[0_16px_36px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-vault-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-text/70 focus-visible:ring-offset-2 focus-visible:ring-offset-vault sm:bottom-6 sm:right-6 sm:px-5 sm:py-3"
      aria-label={`Contact me now via email: ${EMAIL}`}
    >
      <span>Contact me now</span>
      <span aria-hidden>↗</span>
    </a>
  )
}
