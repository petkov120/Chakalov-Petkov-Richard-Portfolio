// Case and project pages: step back to wherever the visitor came from on this site (keeping their place in the
// gallery), otherwise link to the work gallery.
function goBack(event) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  let sameSite = false
  try { sameSite = new URL(document.referrer).origin === location.origin } catch { /* no referrer */ }
  if (!sameSite || history.length < 2) return
  event.preventDefault()
  history.back()
}

export default function BackToWork() {
  return (
    <div className="hp-back-row">
      <a className="hp-back" href="/#work" onClick={goBack}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
        <span>All work</span>
      </a>
    </div>
  )
}
