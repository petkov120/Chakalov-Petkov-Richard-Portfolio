import { EMAIL, GITHUB, LINKEDIN } from '../../data/mind/profile'

export default function MindFooter() {
  return (
    <footer className="mind-footer">
      <div className="mind-footer__contact">
        <span className="mind-label">Have something ambitious in mind?</span>
        <a href={`mailto:${EMAIL}`}>Tell me about it <span aria-hidden="true">↗︎</span></a>
      </div>
      <div className="mind-footer__base">
        <p>Built with curiosity and unreasonable attention to detail.</p>
        <div className="mind-footer__links" aria-label="Professional links">
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗︎</a>
          {LINKEDIN && <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗︎</a>}
          <a href={`mailto:${EMAIL}`}>Email ↗︎</a>
        </div>
        <span>© 2026 Petkov Chakalov · Lagos</span>
      </div>
    </footer>
  )
}
