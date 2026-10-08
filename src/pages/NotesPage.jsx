import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import { Annotation, Highlight } from '../components/mind/Marks'
import { notesChapters, notesFinale, notesIntro } from '../data/notes'
import '../components/mind/home.css'
import '../components/hydra/hydra.css'
import './manga.css'

// The sound effect that opens each chapter when it has no photograph of its own.
const sfx = { '01': 'Why?!', '02': 'Who for?', '03': 'Fuse!', '04': 'Not the goal', '05': 'Rep. Rep. Rep.', '06': 'AI ≠ story', Final: 'Still writing' }

function Panels({ chapter, panel, paragraphs, extra }) {
  const art = panel?.src
    ? <div className={`mg-panel mg-art${panel.treatment === 'ink' ? ' mg-art--ink' : ''}`}>
        <img src={panel.src} alt={panel.alt ?? ''} loading="lazy" decoding="async" />
        {panel.caption && <p className="mg-narration">{panel.caption}</p>}
      </div>
    : <div className="mg-panel mg-sfx mg-speed"><span>{sfx[chapter]}</span></div>
  const items = [art, ...paragraphs.map(block => block.type === 'beat'
    ? <div className="mg-panel mg-bubble mg-tone" key={block.text}><p>{block.text}</p></div>
    : <div className={`mg-panel mg-text${block.text.length < 90 ? ' mg-text--short' : ''}`} key={block.text}><p>{block.text}</p></div>), ...(extra ?? [])]
  return <div className="mg-page" data-count={Math.min(7, Math.max(4, items.length))}>{items.map((node, i) => <PanelKey key={i}>{node}</PanelKey>)}</div>
}
const PanelKey = ({ children }) => children

export default function NotesPage() {
  return (
    <div className="mind-site">
      <div className="mind-interior manga-shell" style={{ '--accent': '#e5383b' }}>
        <SiteNav theme="mind" current="about" />
        <header className="mind-about mind-about--manga mind-section manga-about-hero">
          <div>
            <p className="mind-label">About</p>
            <h1>Still<br /><Highlight>curious.</Highlight></h1>
            <Annotation tone="pink">A builder, before anything.</Annotation>
          </div>
          <div className="mind-about__story">
            <img src="/images/notes/nigeria-childhood.png" alt="Petkov as a child, smiling on a lawn in Nigeria" width="240" height="280" />
            <p>{notesIntro.sublead}</p>
            <p>I grew up around systems that fail and people who find a way through anyway. This is the longer story behind how that shaped the builder I am becoming.</p>
            <div className="manga-about-hero__chapter-note">
              <span>Origin story</span>
              <strong>Six chapters about curiosity, culture, design and engineering.</strong>
            </div>
            <a className="mind-link" href="#chapter-01">Start the story ↓</a>
          </div>
        </header>
        <main className="manga-page">
          <div className="mg-wrap">
        {notesChapters.map(ch => (
          <section className="mg-chapter" id={`chapter-${ch.chapter}`} key={ch.chapter} aria-labelledby={`ch-${ch.chapter}`}>
            <div className="mg-head"><b>Ch. {ch.chapter}</b><h2 id={`ch-${ch.chapter}`}>{ch.title}</h2></div>
            <Panels chapter={ch.chapter} panel={ch.panel} paragraphs={ch.paragraphs} />
          </section>
        ))}

        <section className="mg-chapter mg-final" aria-labelledby="ch-final">
          <div className="mg-head"><b>{notesFinale.chapter}</b><h2 id="ch-final">{notesFinale.title}</h2></div>
          <Panels chapter="Final" panel={notesFinale.panel} paragraphs={notesFinale.paragraphs}
            extra={[<blockquote className="mg-panel mg-quote" key="quote" style={{ margin: 0 }}>{notesFinale.quote.lines.map(line => <p key={line}>{line}</p>)}</blockquote>]} />
          <p className="mg-continued">To be continued</p>
        </section>
          </div>
        </main>
        <MindFooter />
      </div>
    </div>
  )
}
