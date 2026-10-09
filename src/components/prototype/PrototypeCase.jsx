import { useCallback, useEffect, useRef, useState } from 'react'
import StudioInteractionPreview from '../mind/StudioInteractionPreview'
import TapGuide from './TapGuide'
import './prototype-case.css'

// One page per prototype: the live phone stays put while the reasoning scrolls beside it.
// Every section on the right names a screen (data-screen); on wide screens the one crossing
// the middle of the window drives the phone, so reading the story also plays it.
// Everything comes from the project's data, so a prototype that gains real screens later
// (Notepad) needs no layout work.

const WIDE = '(min-width: 1000px)'
const pad = n => String(n).padStart(2, '0')

export default function PrototypeCase({ item, projects, interactive, deviceRef, onClose, onProjectChange }) {
  const index = projects.findIndex(project => project.id === item.id)
  const next = projects[(index + 1) % projects.length]
  const flowStudy = item.status === 'Flow study'
  const first = item.posterScreen // always the start, whatever the gallery demo was showing: the intro describes this screen

  const [override, setOverride] = useState({ screen: first, token: 0 })
  const [screen, setScreen] = useState(first)
  const [visited, setVisited] = useState(() => new Set([first])) // screens the visitor reached by tapping
  const [storyInView, setStoryInView] = useState(false)
  const column = useRef(null)
  const stage = useRef(null)
  const story = useRef(null)
  const jumped = useRef(null) // a screen the page moved the phone to, which doesn't count as the visitor's progress
  const previousScreen = useRef(first)

  const show = useCallback(id => { jumped.current = id; setOverride(current => ({ screen: id, token: current.token + 1 })) }, [])
  const handleState = useCallback(id => {
    const changed = previousScreen.current !== id
    previousScreen.current = id
    setScreen(id)
    const wasJump = id === jumped.current
    jumped.current = null
    if (wasJump) return
    setVisited(seen => seen.has(id) ? seen : new Set(seen).add(id))
    // Story scrolling already drives the phone. Mirror that relationship when someone
    // operates the phone so both halves of the case study stay on the same moment.
    if (changed && matchMedia(WIDE).matches) {
      const section = column.current?.querySelector(`[data-screen="${id}"]`)
      section?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  // wide screens: the section crossing the middle of the window sets the phone's screen
  useEffect(() => {
    if (!matchMedia(WIDE).matches) return undefined
    let last = item.posterScreen // the phone already shows the intro's screen
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.dataset.screen
        if (entry.isIntersecting && id !== last) { last = id; show(id) }
      })
    }, { rootMargin: '-50% 0px -50% 0px' })
    column.current.querySelectorAll('[data-screen]').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [item.posterScreen, show])

  // narrow screens: the "how I designed this" button steps aside once the story is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setStoryInView(entry.isIntersecting || entry.boundingClientRect.top < 0))
    observer.observe(story.current)
    return () => observer.disconnect()
  }, [])

  const showOnPhone = id => {
    show(id)
    if (!matchMedia(WIDE).matches) stage.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const meta = item.screens.find(state => state.id === screen) ?? item.screens[0]

  return <div className="pcase" style={{ '--accent-c': item.accent }}>
    <img className="pcase__artifact" src="/images/prototype/reaching-hands-marble.webp" alt="" aria-hidden="true" decoding="async" />
    <header className="pcase__bar">
      <button type="button" className="pcase__back" onClick={onClose} aria-label="Close prototype and return to all work">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
        <span className="pcase__back-label">All work</span>
      </button>
      <nav className="pcase__switch" aria-label="Prototypes">
        {projects.map(project => <button key={project.id} type="button" aria-current={project.id === item.id ? 'page' : undefined} onClick={() => project.id !== item.id && onProjectChange(project.id)}>{project.name}</button>)}
      </nav>
    </header>

    <div className="pcase__layout">
      <div ref={stage} className="pcase__stage">
        <div ref={deviceRef} className="pcase__device">
          <div className="pcase__screen">
            <StudioInteractionPreview item={item} initialScreen={first} screenOverride={override.screen} replayToken={override.token} onStateChange={handleState} live interactive={interactive} playing={false} />
          </div>
          <TapGuide guide={item.guide} screen={screen} visited={visited} deviceRef={deviceRef} active={interactive} />
        </div>
        <p className="pcase__caption" aria-live="polite">
          <span className="pcase__live">{flowStudy ? 'Flow study' : 'Live, tap anything'}</span>
          <strong>{meta.label}</strong>
          <span className="pcase__purpose">{meta.purpose}</span>
        </p>
      </div>

      <article ref={column} className="pcase__column">
        <section className="pcase__intro" data-screen={item.posterScreen}>
          <p className="pcase__eyebrow">{item.name} <span>·</span> {flowStudy ? 'Early flow study' : item.status} <span>·</span> {item.year}</p>
          <h1 id="pcase-title">{item.title}</h1>
          <p className="pcase__summary">{item.summary}</p>
          {item.progress && <p className="pcase__progress">{item.progress}</p>}
          <p className="pcase__cue">Scroll for the thinking behind it. The phone follows along. <span aria-hidden="true">↓</span></p>
        </section>

        <section ref={story} className="pcase__story" aria-label="Design decisions">
          {item.story.map((part, i) => <div key={part.title} className="pcase__beat" data-screen={part.screen}>
            <p className="pcase__count">{pad(i + 1)} / {pad(item.story.length)} <span>{part.focal}</span></p>
            <h2>{part.title}</h2>
            <p>{part.body}</p>
            <button type="button" className="pcase__see" onClick={() => showOnPhone(part.screen)}>See it on the phone <span aria-hidden="true">↑</span></button>
          </div>)}
        </section>

        <section className="pcase__states">
          <h2>Every state</h2>
          <p>Choose one to jump the phone there.</p>
          <ol>{item.screens.map((state, i) => <li key={state.id}>
            <button type="button" onClick={() => showOnPhone(state.id)} aria-pressed={screen === state.id}>
              <span className="pcase__num">{pad(i + 1)}</span>
              <span><strong>{state.label}</strong><span>{state.purpose}</span></span>
            </button>
          </li>)}</ol>
        </section>

        <section className="pcase__principles">
          <h2>What mattered</h2>
          <ol>{item.principles.map(principle => <li key={principle}>{principle}</li>)}</ol>
        </section>

        {next && next.id !== item.id && <button type="button" className="pcase__next" onClick={() => onProjectChange(next.id)} style={{ '--next-c': next.accent }}>
          <span>Next prototype</span>
          <strong>{next.name} <span aria-hidden="true">→</span></strong>
          <span className="pcase__purpose">{next.summary}</span>
        </button>}
      </article>
    </div>

    <button type="button" className="pcase__mobile-cta" data-hidden={storyInView} onClick={() => story.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>How I designed this <span aria-hidden="true">↓</span></button>
    <button type="button" className="pcase__mobile-back" data-visible={storyInView} onClick={onClose}>
      <span aria-hidden="true">←</span> All work
    </button>
  </div>
}
