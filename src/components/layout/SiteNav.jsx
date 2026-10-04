import EmailActions from '../EmailActions'

const accentMap = {
  clinify: 'text-clinify border-clinify',
  universityx: 'text-universityx border-universityx',
  treatmentpath: 'text-treatmentpath border-treatmentpath',
}

const themes = {
  vault: {
    home: 'text-vault-text hover:text-white',
    link: 'text-vault-muted hover:text-vault-text hover:bg-vault-elevated/70',
    active: 'text-vault-text border-vault-rule',
    muted: 'text-vault-muted',
    rule: 'border-vault-rule',
    shell: 'border-vault-rule',
    fixedShell: 'bg-vault/88 backdrop-blur-md border-vault-rule',
  },
  paper: {
    home: 'text-ink hover:text-black',
    link: 'text-muted hover:text-ink hover:bg-black/[0.04]',
    active: 'text-ink border-rule',
    muted: 'text-muted',
    rule: 'border-rule',
    shell: 'border-rule',
    fixedShell: 'bg-paper/92 backdrop-blur-md border-rule',
  },
  mind: {
    home: 'text-[#f3f3f1] hover:text-white',
    link: 'text-[#8e8e96] hover:text-[#f3f3f1] hover:bg-white/5',
    active: 'text-[#f3f3f1] border-white/15',
    muted: 'text-[#8e8e96]',
    rule: 'border-white/15',
    shell: 'border-transparent',
    fixedShell: 'bg-[#0b0b0c]/90 backdrop-blur-md border-white/15',
  },
}

export default function SiteNav({
  theme = 'vault',
  current,
  fixed = false,
}) {
  const palette = themes[theme] ?? themes.vault
  const emailTheme = theme === 'paper' ? 'paper' : 'vault'

  const headerClass = fixed
    ? `site-nav site-nav--${theme} site-nav--fixed fixed top-0 inset-x-0 z-50 px-4 sm:px-6 md:px-12 pt-5 sm:pt-6 md:pt-8 pb-4 md:pb-5 flex items-center justify-between gap-4 ${palette.fixedShell}`
    : `site-nav site-nav--${theme} flex items-center justify-between gap-4 ${theme === 'mind' ? 'mb-0' : 'pb-4 md:pb-5 mb-12 md:mb-16'}`

  const itemShape = theme === 'mind' ? 'shrink-0 px-2.5 sm:px-3 py-1.5' : 'shrink-0 rounded-full px-2.5 sm:px-3 py-1.5'

  const navItems = [
    { label: 'Home', short: 'Home', href: '/#work', key: 'home' },
    { label: 'Work', short: 'Work', href: '/work', key: 'work' },
    { label: 'About', short: 'About', href: '/about', key: 'about' },
  ]

  return (
    <header className={headerClass}>
      <a
        href="/"
        className={`site-nav__brand flex items-center gap-2.5 display text-base md:text-lg leading-none shrink-0 transition-colors ${palette.home}`}
        aria-label="Petkov Chakalov, home"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
          const path = location.pathname.replace(/\/$/, '') || '/'
          if (path !== '/') return
          event.preventDefault()
          if (location.hash) history.pushState(null, '', '/')
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        }}
      >
        {theme === 'mind' ? (
          <span className="site-nav__monogram" aria-hidden="true">P.</span>
        ) : (
          <img
            src="/images/weaver-mark.svg"
            width="32"
            height="32"
            className="size-8 shrink-0"
            alt=""
            aria-hidden="true"
          />
        )}
        <span className="hidden md:inline" aria-hidden="true">Petkov Chakalov</span>
      </a>

      <nav
        className={`site-nav__links flex min-w-0 items-center justify-end gap-1 sm:gap-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] ${palette.muted} ${
          fixed ? '' : 'rise rise-1'
        }`}
      >
        {navItems.map((item) => {
          const href = item.href
          const isActive = current === item.key
          const label = (
            <>
              <span className="lg:hidden">{item.short}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </>
          )

          if (isActive) {
            return (
              <span
                key={item.key}
                aria-current="page"
                className={`site-nav__item site-nav__item--active ${itemShape} ${palette.active}`}
              >
                {label}
              </span>
            )
          }

          return (
            <a
              key={item.key}
              href={href}
              className={`site-nav__item ${itemShape} transition-colors ${palette.link}`}
            >
              {label}
            </a>
          )
        })}
        <span className={`site-nav__contact shrink-0 pl-2 sm:pl-3 ml-0.5 sm:ml-1 border-l ${palette.rule}`}>
          <EmailActions theme={emailTheme} variant="nav" />
        </span>
      </nav>
    </header>
  )
}

export function AccentRule({ accent = 'clinify', className = '' }) {
  const colorClass = {
    clinify: 'bg-clinify',
    universityx: 'bg-universityx',
    treatmentpath: 'bg-treatmentpath',
  }[accent]

  return <div className={`h-px w-full ${colorClass} opacity-60 ${className}`} />
}

export { accentMap }
