import { useMemo, useState } from 'react'
import './case-study-ide.css'

const FILTERS = [
  { id: 'live', label: 'Live', origin: 'Live Work' },
  { id: 'side', label: 'Side project', origin: 'Side Projects' },
]

export default function CaseStudyIDE({ items, onOpenItem }) {
  const [activeFilter, setActiveFilter] = useState('live')
  const active = FILTERS.find(filter => filter.id === activeFilter) ?? FILTERS[0]
  const visibleItems = useMemo(() => items.filter(item => item.origin === active.origin), [items, active.origin])

  return (
    <div className="mind-work-gallery">
      <div className="mind-work-gallery__filters" role="tablist" aria-label="Filter work">
        {FILTERS.map(filter => {
          const count = items.filter(item => item.origin === filter.origin).length
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.id}
              className="mind-work-gallery__filter"
              onClick={() => setActiveFilter(filter.id)}
            >
              <span>{filter.label}</span>
              <em>{count}</em>
            </button>
          )
        })}
      </div>

      <div className="mind-work-gallery__grid">
        {visibleItems.map(item => (
          <a key={item.id} className={'mind-work-card mind-work-card--' + item.id} href={item.href} aria-label={'Open the ' + item.name + ' case study'} onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; if (onOpenItem?.(item)) event.preventDefault() }}>
            <span className="mind-work-card__image">
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
            </span>
            <span className="mind-work-card__body">
              <span className="mind-work-card__kicker">{item.origin === 'Live Work' ? 'Live' : 'Side project'} · {item.field}</span>
              <strong>{item.name}</strong>
              <span>{item.blurb}</span>
              {item.proof ? <span className="mind-work-card__proof">{item.proof}</span> : null}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
