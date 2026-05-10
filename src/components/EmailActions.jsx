import { useState } from 'react'

const EMAIL = 'petkovrichard8@gmail.com'
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Inquiry`

export default function EmailActions() {
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
    <span className="inline-flex items-center gap-2">
      <a href={MAILTO} className="hover:text-ink transition-colors">
        Email
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="hidden md:inline-block text-[11px] uppercase tracking-wide text-muted/80 hover:text-ink transition-colors"
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}
