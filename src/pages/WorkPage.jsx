import { lazy, Suspense, useMemo, useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import Thumb from '../components/stage/Thumb'
import { buildWall, FILTERS } from '../components/stage/wall'
import { workCases, zoomExplorations } from '../data/mind/projects'
import '../components/mind/home.css'
import '../components/stage/work.css'

// Prototypes show their resting screen in a phone; the runtime loads with the page's first prototype card.
const Preview = lazy(() => import('../components/mind/StudioInteractionPreview'))

export default function WorkPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  // Same list, order and labels as the homepage rail.
  const entries = useMemo(() => buildWall(zoomExplorations, workCases), [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return entries.filter(entry => (filter === 'all' || entry.group === filter)
      && (!needle || [entry.name, entry.kind, entry.line, entry.data.field, entry.data.project].join(' ').toLowerCase().includes(needle)))
  }, [entries, filter, query])

  return (
    <div className="mind-site">
      <div className="mind-interior">
        <SiteNav theme="mind" current="work" />
        <header className="wk-intro">
          <span className="mind-label">Shipped work, prototypes and side projects</span>
          <h1>Work</h1>
        </header>
        <section className="wk-controls" aria-label="Filter work">
          <label className="wk-search">
            <span className="sr-only">Search work</span>
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Clinify, UniversityX, X redesign, Hydra…" />
          </label>
          <div className="wk-filters" role="group" aria-label="Work type">
            {FILTERS.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}
          </div>
        </section>
        <main className="wk-grid" aria-live="polite">
          {visible.map((entry, index) => (
            <a key={entry.key} className="wk-card" href={entry.href ?? entry.data.href} style={{ '--i': index }}>
              <span className={`wk-card__media${entry.type === 'phone' ? ' wk-card__media--phone' : ''}`}>
                {entry.type === 'phone'
                  ? <span className="wk-phone"><Suspense fallback={null}><Preview item={entry.data} playing={false} replayToken={0} /></Suspense></span>
                  : <Thumb thumb={entry.data.thumb} alt={entry.data.alt} accent={entry.data.accent} />}
              </span>
              <span className="wk-card__body">
                <small data-group={entry.group}>{entry.kind}{entry.credit && <> · {entry.credit}</>}</small>
                <strong>{entry.name}</strong>
                <span>{entry.line}</span>
                {entry.note && <em>{entry.note}</em>}
                <b className="wk-card__cta">{entry.cta} <span aria-hidden="true">↗︎</span></b>
              </span>
            </a>
          ))}
          {!visible.length && <p className="wk-empty">Nothing matches that search yet.</p>}
        </main>
        <MindFooter />
      </div>
    </div>
  )
}
