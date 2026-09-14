import { useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import WorkGrid from '../components/gallery/WorkGrid'
import ZoomExplorations from '../components/mind/ZoomExplorations'
import { useReducedMotion } from '../components/mind/motion'
import { workCases, zoomExplorations } from '../data/mind/projects'
import '../components/mind/mind.css'
import '../components/mind/interaction-rail.css'

const liveWork = workCases.filter((item) => item.origin === 'Live Work')
const sideProjects = workCases.filter((item) => item.origin === 'Side Projects')

const filters = {
  'Live Work': { items: liveWork, title: 'Shipped, in production.' },
  'Side Projects': { items: sideProjects, title: 'Explored on the side.' },
}

export default function WorkPage() {
  const reduced = useReducedMotion()
  const [filter, setFilter] = useState('Live Work')
  const active = filters[filter]

  return (
    <main className="theme-work min-h-screen work-page">
      <div className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
        <SiteNav theme="paper" current="work" />

        <header className="work-page__intro mb-16 md:mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
            Selected work
          </p>
          <h1 className="display text-4xl md:text-6xl leading-[1.05] text-balance">
            Everything,
            <span className="italic text-muted"> in one place.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted max-w-prose text-pretty">
            Shipped products, side experiments, and interfaces you can actually click through.
          </p>
        </header>

        <section className="work-grid" aria-labelledby="interactive-work">
          <header className="work-grid__header">
            <p className="work-grid__kicker">Interactive Work</p>
            <h2 id="interactive-work">Don&apos;t just look. Play with it.</h2>
            <p className="work-grid__note">Live prototypes you can click through, right here.</p>
          </header>
          <ZoomExplorations items={zoomExplorations} reduced={reduced} standalone />
        </section>

        <section className="work-grid" aria-labelledby="selected-work">
          <header className="work-grid__header work-grid__header--with-filter">
            <div>
              <p className="work-grid__kicker">Selected Work</p>
              <h2 id="selected-work">{active.title}</h2>
            </div>
            <div className="work-grid__filter" role="tablist" aria-label="Filter selected work">
              {Object.keys(filters).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={filter === option}
                  className="work-grid__filter-btn"
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </header>
          <WorkGrid items={active.items} />
        </section>
      </div>
    </main>
  )
}
