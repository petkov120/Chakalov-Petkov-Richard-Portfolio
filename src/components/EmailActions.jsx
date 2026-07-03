import { useState } from 'react'

const EMAIL = 'petkovrichard8@gmail.com'
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Inquiry`

export default function EmailActions({ theme = 'vault', variant = 'default' }) {
  const isVault = theme === 'vault'
  const isNav = variant === 'nav'
  const linkHover = isVault ? 'hover:text-vault-text' : 'hover:text-ink'
  const btnHover = isVault
    ? 'text-vault-muted/80 hover:text-vault-text'
    : 'text-muted/80 hover:text-ink'
  const navLinkClass = isVault
    ? 'text-vault-muted hover:text-vault-text hover:bg-vault-elevated/70'
    : 'text-muted hover:text-ink hover:bg-black/[0.04]'
  const navBtnClass = isVault
    ? 'text-vault-muted/90 hover:text-vault-text border-vault-rule hover:bg-vault-elevated/70'
    : 'text-muted hover:text-ink border-rule hover:bg-black/[0.04]'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = EMAIL
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <span className={`inline-flex shrink-0 items-center ${isNav ? 'gap-1' : 'gap-1.5 sm:gap-2'}`}>
      <a
        href={MAILTO}
        className={`transition-colors ${
          isNav
            ? `rounded-full px-2.5 sm:px-3 py-1.5 ${navLinkClass}`
            : linkHover
        }`}
      >
        <span className="lg:hidden">Mail</span>
        <span className="hidden lg:inline">Email</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={`hidden lg:inline-block uppercase tracking-[0.14em] transition-colors ${
          isNav
            ? `rounded-full border px-2.5 py-1.5 text-[10px] ${navBtnClass}`
            : `text-[11px] tracking-wide ${btnHover}`
        }`}
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}
