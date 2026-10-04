import { useMemo, useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import Thumb from '../components/stage/Thumb'
import { workCases } from '../data/mind/projects'
import '../components/mind/home.css'
import '../components/stage/work.css'

const FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'live', label: 'Live work', match: item => item.origin === 'Live Work' },
  { id: 'side', label: 'Side projects', match: item => item.origin !== 'Live Work' },
]

export default function WorkPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const active = FILTERS.find(item => item.id === filter)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return workCases.filter(item => active.match(item) && (!needle || [item.name, item.field, item.blurb, item.origin].join(' ').toLowerCase().includes(needle)))
  }, [active, query])

  return (
    <div className="mind-site">
      <div className="mind-interior">
        <SiteNav theme="mind" current="work" />
        <header className="wk-intro">
          <span className="mind-label">Selected case studies and experiments</span>
          <h1>Work</h1>
        </header>
        <section className="wk-controls" aria-label="Filter work">
          <label className="wk-search">
            <span className="sr-only">Search work</span>
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Clinify, UniversityX, Hydra" />
          </label>
          <div className="wk-filters" role="group" aria-label="Work type">
            {FILTERS.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}
          </div>
        </section>
        <main className="wk-grid" aria-live="polite">
          {visible.map((item, index) => (
            <a key={item.id} className="wk-card" href={item.href} style={{ '--i': index }}>
              <span className="wk-card__media"><Thumb thumb={item.thumb} alt={item.alt} accent={item.accent} /></span>
              <span className="wk-card__body">
                <small>{item.origin === 'Live Work' ? 'Live work' : 'Side project'}</small>
                <strong>{item.name}</strong>
                <span>{item.blurb}</span>
                {item.proof && <em>{item.proof}</em>}
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
