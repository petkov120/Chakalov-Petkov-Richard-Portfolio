import { Highlight } from '../mind/Marks'

const EMAIL = 'petkovrichard8@gmail.com'

export default function MindFooter() {
  return (
    <footer className="mind-footer">
      <span className="mind-label">Good things start with a conversation.</span>
      <a href={`mailto:${EMAIL}`}>What are you<br /><Highlight>thinking?</Highlight><span aria-hidden="true">↗</span></a>
      <div>
        <span>© 2026 Petkov Chakalov</span><span>Lagos, Nigeria</span>
        <a href={`mailto:${EMAIL}`}>Email ↗</a>
        <a href="https://github.com/petkov120" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={`mailto:${EMAIL}?subject=Resume%20request`}>Resume ↗</a>
      </div>
    </footer>
  )
}
