const accentHover = {
  clinify: 'hover:text-clinify',
  universityx: 'hover:text-universityx',
  treatmentpath: 'hover:text-treatmentpath',
}

export default function InvestigationBackLink({ slug, accent = 'clinify', theme = 'vault', href }) {
  const backHref = href ?? `/#inv-${slug}`
  const baseClass =
    theme === 'vault'
      ? 'text-vault-muted hover:text-vault-text'
      : 'text-muted hover:text-ink'

  return (
    <a
      href={backHref}
      className={`group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${baseClass} ${accentHover[accent] ?? ''}`}
    >
      <span className="group-hover:-translate-x-0.5 transition-transform" aria-hidden>
        ←
      </span>
      Investigations
    </a>
  )
}
