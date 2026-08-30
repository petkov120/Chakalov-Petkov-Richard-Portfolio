const EMAIL = 'petkovrichard8@gmail.com'
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Inquiry`

const navItems = [
  { label: 'Works', href: '#works' },
  { label: 'Notes', href: '/notes' },
  { label: 'Play', href: '/playground' },
]

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-nav__icon">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.58 5.06.36.32.68.95.68 1.92v2.85c0 .27.18.59.69.49A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-nav__icon">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.75h16v10.5H4V6.75Zm0 0 8 6.5 8-6.5"
      />
    </svg>
  )
}

export default function GalleryNav() {
  return (
    <header className="gallery-nav">
      <nav className="gallery-nav__links" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="gallery-nav__pill">
            {item.label}
          </a>
        ))}
      </nav>

      <a href="/" className="gallery-nav__brand" aria-label="Petkov Chakalov, home">
        <img
          src="/images/weaver-mark.svg"
          width="28"
          height="28"
          alt=""
          aria-hidden="true"
        />
      </a>

      <div className="gallery-nav__social">
        <a
          href="https://github.com/petkov120"
          target="_blank"
          rel="noreferrer"
          className="gallery-nav__icon-link"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
        <a href={MAILTO} className="gallery-nav__icon-link" aria-label={`Email ${EMAIL}`}>
          <MailIcon />
        </a>
      </div>
    </header>
  )
}
