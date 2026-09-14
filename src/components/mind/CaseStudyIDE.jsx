import { useState } from 'react'
import './case-study-ide.css'

const GROUPS = ['Live Work', 'Side Projects']

export default function CaseStudyIDE({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const active = items.find(item => item.id === activeId) ?? items[0]
  const groups = GROUPS.map(label => ({ label, items: items.filter(item => item.origin === label) })).filter(group => group.items.length)

  if (!active) return null

  return (
    <div className="mind-ide">
      <div className="mind-ide__titlebar">
        <div className="mind-ide__dots" aria-hidden="true"><i /><i /><i /></div>
        <p className="mind-ide__title">case-studies.tsx — Petkov Chakalov</p>
        <div className="mind-ide__titlebar-spacer" aria-hidden="true" />
      </div>
      <div className="mind-ide__body">
        <nav className="mind-ide__sidebar" aria-label="Case studies">
          <p className="mind-ide__sidebar-label">Explorer</p>
          {groups.map(group => (
            <div className="mind-ide__group" key={group.label}>
              <p className="mind-ide__group-label"><span aria-hidden="true">▾</span>{group.label}</p>
              <ul>
                {group.items.map(item => (
                  <li key={item.id}>
                    <button type="button" className="mind-ide__file" aria-current={item.id === active.id ? 'true' : undefined} onClick={() => setActiveId(item.id)}>
                      <span className={`mind-ide__dot mind-ide__dot--${item.id}`} aria-hidden="true" />
                      <span>{item.name}.tsx</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mind-ide__main">
          <div className="mind-ide__tabs" role="tablist" aria-label="Open case studies">
            {items.map(item => (
              <button key={item.id} type="button" role="tab" aria-selected={item.id === active.id} className="mind-ide__tab" onClick={() => setActiveId(item.id)}>
                <span className={`mind-ide__dot mind-ide__dot--${item.id}`} aria-hidden="true" />
                <span>{item.name}.tsx</span>
              </button>
            ))}
          </div>
          <div className="mind-ide__pane">
            <a className="mind-ide__preview" href={active.href} aria-label={`Open the ${active.name} case study`}>
              <span className="mind-ide__preview-chrome" aria-hidden="true"><i /><i /><i /><em>petkov.dev/{active.id}</em></span>
              <span className="mind-ide__preview-stage"><img src={active.src} alt={active.alt} loading="lazy" decoding="async" /></span>
            </a>
            <div className="mind-ide__meta">
              <p className="mind-ide__comment">// {active.field}</p>
              <h3>{active.name}</h3>
              <p>{active.blurb}</p>
              <a className="mind-link" href={active.href}>Open case study <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="mind-ide__statusbar">
            <span>{active.origin}</span>
            <span className="mind-ide__statusbar-mid">main</span>
            <span>TSX · UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  )
}
