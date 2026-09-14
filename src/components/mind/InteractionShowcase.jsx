import { useCallback, useEffect, useRef, useState } from 'react'
import MindPhone from './MindPhone'
import StudioInteractionPreview from './StudioInteractionPreview'
import ShowcaseStory from './ShowcaseStory'
import { Annotation } from './Marks'
import { useDialog, useVisible } from './motion'
import './interaction-showcase.css'

const OPEN_MS = 900
const CLOSE_MS = 620
const ease = 'cubic-bezier(.22,.8,.2,1)'

export default function InteractionShowcase({ item, projects, origin, initialScreen, reduced, closing, onClose, onExited, onProjectChange, getReturnRect }) {
  const dialog = useRef(null)
  const phone = useRef(null)
  const wash = useRef(null)
  const animations = useRef([])
  const entryTimer = useRef(null)
  const [phase, setPhase] = useState('entering')
  const [paused, setPaused] = useState(false)
  const [manualPlay, setManualPlay] = useState(false)
  const [replay, setReplay] = useState(0)
  const [selectedScreen, setSelectedScreen] = useState(null)
  const [currentScreen, setCurrentScreen] = useState(initialScreen || item.posterScreen)
  const [corridorScreen, setCorridorScreen] = useState(item.story[0]?.screen || item.posterScreen)
  const [corridorReplay, setCorridorReplay] = useState(0)
  const visible = useVisible(phone, .15)
  const setCorridorScreenStable = useCallback(screen => setCorridorScreen(screen), [])
  const index = projects.findIndex(project => project.id === item.id)
  const screen = item.screens.find(state => state.id === currentScreen) || item.screens[0]
  useDialog(dialog, onClose)

  useEffect(() => {
    setPaused(false)
    setManualPlay(false)
    setSelectedScreen(null)
    setCurrentScreen(item.posterScreen)
    setCorridorScreen(item.story[0]?.screen || item.posterScreen)
    dialog.current.scrollTo({ top: 0, behavior: 'instant' })
  }, [item.id, item.posterScreen, item.story])

  useEffect(() => {
    const target = phone.current.getBoundingClientRect()
    const x = origin ? origin.left + origin.width / 2 : innerWidth * .65
    const y = origin ? origin.top + origin.height / 2 : innerHeight * .45
    dialog.current.style.setProperty('--liquid-x', `${x}px`)
    dialog.current.style.setProperty('--liquid-y', `${y}px`)
    if (!reduced && phone.current.animate) {
      const radius = Math.hypot(innerWidth, innerHeight)
      animations.current.push(wash.current.animate([
        { clipPath: `ellipse(0px 0px at ${x}px ${y}px)`, backgroundColor: '#eef3ff' },
        { offset: .65, clipPath: `ellipse(${radius * .8}px ${radius * .62}px at ${x}px ${y}px)`, backgroundColor: '#fafbff' },
        { clipPath: `ellipse(${radius}px ${radius}px at ${x}px ${y}px)`, backgroundColor: '#ffffff' },
      ], { duration: OPEN_MS, easing: ease, fill: 'both' }))
      const from = origin ? `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${origin.width / target.width}, ${origin.height / target.height})` : 'translate(0, 45px) scale(.9, 1.06)'
      animations.current.push(phone.current.animate([
        { transform: from, opacity: origin ? 1 : 0, filter: 'blur(0px)' },
        { offset: .78, transform: 'translate(0, -5px) scale(1.025, .98)', opacity: 1, filter: 'blur(0px)' },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' },
      ], { duration: OPEN_MS, easing: ease, fill: 'both' }))
    }
    entryTimer.current = setTimeout(() => {
      animations.current.forEach(animation => animation.cancel())
      animations.current = []
      setPhase('ready')
    }, reduced ? 80 : OPEN_MS)
    return () => { clearTimeout(entryTimer.current); animations.current.forEach(animation => animation.cancel()); animations.current = [] }
    // The opening geometry is captured once; switching projects stays inside the reader.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  useEffect(() => {
    if (!closing) return undefined
    clearTimeout(entryTimer.current)
    animations.current.forEach(animation => animation.cancel())
    animations.current = []
    setPhase('closing')
    dialog.current.scrollTo({ top: 0, behavior: 'instant' })
    const target = getReturnRect?.()
    const current = phone.current.getBoundingClientRect()
    if (!reduced && phone.current.animate) {
      const to = target ? `translate(${target.left - current.left}px, ${target.top - current.top}px) scale(${target.width / current.width}, ${target.height / current.height})` : 'translate(0, 28px) scale(.95)'
      animations.current.push(phone.current.animate([
        { transform: 'none', opacity: 1 },
        { offset: .25, transform: 'translate(0, 4px) scale(.985, 1.025)', opacity: 1 },
        { transform: to, opacity: target ? 1 : 0 },
      ], { duration: CLOSE_MS, easing: ease, fill: 'forwards' }))
      const x = target ? target.left + target.width / 2 : innerWidth * .65
      const y = target ? target.top + target.height / 2 : innerHeight * .45
      const radius = Math.hypot(innerWidth, innerHeight)
      animations.current.push(wash.current.animate([
        { clipPath: `ellipse(${radius}px ${radius}px at ${x}px ${y}px)` },
        { clipPath: `ellipse(0px 0px at ${x}px ${y}px)` },
      ], { duration: CLOSE_MS, easing: ease, fill: 'forwards' }))
    }
    const timer = setTimeout(onExited, reduced ? 80 : CLOSE_MS)
    return () => clearTimeout(timer)
  }, [closing, reduced, onExited, getReturnRect])

  const selectScreen = state => {
    setSelectedScreen(state.id)
    setCurrentScreen(state.id)
    setCorridorScreen(state.id)
    setPaused(true)
    setReplay(value => value + 1)
    setCorridorReplay(value => value + 1)
    document.getElementById('showcase-story')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }
  const play = () => {
    setSelectedScreen(null)
    setPaused(false)
    setManualPlay(true)
    setReplay(value => value + 1)
  }

  return <dialog ref={dialog} className="mind-dialog mind-showcase" data-phase={phase} data-project={item.id} aria-labelledby="mind-showcase-title">
    <div ref={wash} className="mind-showcase__wash" aria-hidden="true" />
    <header className="mind-showcase__header"><button className="mind-showcase__close" type="button" onClick={onClose} disabled={closing} aria-label="Close project showcase" autoFocus>×</button><span className="mind-mark">P.</span><span className="mind-label">An interaction study / {String(index + 1).padStart(2, '0')}</span></header>
    <nav className="mind-showcase__project-nav" aria-label="Browse projects"><button type="button" aria-label="Previous project" disabled={index === 0 || closing || phase === 'entering'} onClick={() => onProjectChange(projects[index - 1].id)}>←</button><button type="button" aria-label="Next project" disabled={index === projects.length - 1 || closing || phase === 'entering'} onClick={() => onProjectChange(projects[index + 1].id)}>→</button></nav>
    <div className="mind-showcase__hero">
      <div key={item.id} className="mind-showcase__intro"><span className="mind-label">{item.category}</span><div className="mind-showcase__identity"><span className="mind-showcase__icon" aria-hidden="true">{item.mark}</span><h1 id="mind-showcase-title">{item.name}<span>.</span></h1></div><p className="mind-showcase__summary">{item.summary}</p><div className="mind-showcase__facts"><span>{item.year}</span><span>{item.status}</span><span>Design + code</span></div><a className="mind-showcase__read" href="#showcase-story" onClick={event => { event.preventDefault(); dialog.current.querySelector('#showcase-story').scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }) }}>Behind the interaction <span aria-hidden="true">↓</span></a><Annotation>{item.note}</Annotation></div>
      <div className="mind-showcase__object"><div ref={phone} className="mind-showcase__phone-motion"><MindPhone className="mind-phone--showcase" screenClassName="mind-phone__screen--live"><StudioInteractionPreview key={item.id} item={item} initialScreen={initialScreen} screenOverride={selectedScreen} playing={phase === 'ready' && !closing && !paused && (!reduced || manualPlay) && visible} replayToken={replay} onStateChange={setCurrentScreen} /></MindPhone></div><div className="mind-showcase__playback"><span className="mind-label">{screen.label}</span><button type="button" onClick={() => paused || (reduced && !manualPlay) ? play() : setPaused(true)} aria-label={paused || (reduced && !manualPlay) ? 'Play project sequence' : 'Pause project sequence'}>{paused || (reduced && !manualPlay) ? 'Play ▷' : 'Pause Ⅱ'}</button><button type="button" onClick={play} aria-label="Replay project sequence">↻</button></div></div>
    </div>
    <ShowcaseStory item={item} scrollRoot={dialog} reduced={reduced} closing={closing} phase={phase} replay={corridorReplay} onReplay={() => setCorridorReplay(value => value + 1)} screen={corridorScreen} onScreenChange={setCorridorScreenStable} />
    <section className="mind-showcase__states"><div><span className="mind-label">Explore the sequence</span><h2>Every state<br />has a <em>reason.</em></h2><p>Choose a moment to see it in the preview.</p></div><ol>{item.screens.map((state, i) => <li key={state.id}><button type="button" onClick={() => selectScreen(state)} aria-pressed={currentScreen === state.id}><span className="mind-label">{String(i + 1).padStart(2, '0')}</span><div><strong>{state.label}</strong><p>{state.purpose}</p></div><span aria-hidden="true">↗</span></button></li>)}</ol></section>
    <footer className="mind-showcase__footer"><span className="mind-label">Still exploring. Still making.</span><button className="mind-link" type="button" onClick={onClose}>Back to the collection ↗</button></footer>
  </dialog>
}
