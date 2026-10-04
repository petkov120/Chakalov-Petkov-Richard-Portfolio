import { useMemo, useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import { workCases } from '../data/mind/projects'
import '../components/gallery/work-grid.css'

const FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'live', label: 'Live', match: (item) => item.origin === 'Live Work' },
  { id: 'side', label: 'Side project', match: (item) => item.origin === 'Side Projects' },
]

const searchText = (item) => [
  item.name,
  item.field,
  item.blurb,
  item.origin,
].join(' ').toLowerCase()

export default function WorkPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const activeFilter = FILTERS.find(item => item.id === filter) ?? FILTERS[0]

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return workCases.filter(item => {
      if (!activeFilter.match(item)) return false
      if (!needle) return true
      return searchText(item).includes(needle)
    })
  }, [activeFilter, query])

  return (
    <main className="theme-work work-index min-h-screen">
      <div className="work-index__shell">
        <SiteNav theme="paper" current="work" />

        <header className="work-index__hero">
          <p className="work-index__eyebrow">Selected case studies and experiments</p>
          <h1>Works</h1>
        </header>

        <section className="work-index__controls" aria-label="Filter works">
          <label className="work-index__search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
            </svg>
            <span className="sr-only">Search works</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Clinify, UniversityX, Ledger"
            />
          </label>

          <div className="work-index__filters" role="tablist" aria-label="Work type">
            {FILTERS.map(item => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="work-index__grid" aria-live="polite" aria-label="Works">
          {visibleItems.map((item, index) => (
            <a
              key={item.id}
              className={`work-index-card work-index-card--${item.id}`}
              href={item.href}
              style={{ '--card-index': index }}
            >
              <figure>
                <span className="work-index-card__media">
                  <img src={item.src} alt={item.alt} loading="eager" decoding="async" />
                </span>
                <figcaption>
                  <span>{item.origin === 'Live Work' ? 'Live' : 'Side project'}</span>
                  <strong>{item.name}</strong>
                  <em>{item.field}</em>
                </figcaption>
              </figure>
            </a>
          ))}

          {!visibleItems.length && (
            <p className="work-index__empty">No works match that search yet.</p>
          )}
        </section>
      </div>
    </main>
  )
}
