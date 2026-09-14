import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { uiProjects } from '../../ui/projectRegistry'
import socialStyles from '../../ui/projects/social/social.css?inline'
import studioStyles from '../../ui/studio.css?inline'

// The maker is consumed as-is. Shadow DOM keeps portfolio typography/resets
// out of the actual UI, and inert prevents preview autofocus stealing focus.
const previewStyles = `
  :host { display: block; width: 100%; height: 100%; }
  *, *::before, *::after { box-sizing: border-box; }
  h1,h2,h3,h4,p,figure { margin: 0; }
  button,input,textarea { font: inherit; }
  button { padding: 0; background: transparent; }
  img,svg { display: block; }
  img { max-width: 100%; }
  .studio-playback { position: relative; width: 390px; height: 844px; overflow: hidden; font: 16px/1.5 Inter, sans-serif; color: #0f1419; background: #fff; transform: scale(var(--preview-scale, 1)); transform-origin: top left; }
  .ui-canvas__blank > small { visibility: hidden; }
  .studio-playback.is-paused *, .studio-playback.is-paused *::before, .studio-playback.is-paused *::after { animation-play-state: paused !important; }
  .studio-playback.is-poster *, .studio-playback.is-poster *::before, .studio-playback.is-poster *::after { animation: none !important; transition: none !important; }
  @media (prefers-reduced-motion: reduce) { .studio-playback *, .studio-playback *::before, .studio-playback *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
`

export default function StudioInteractionPreview({ item, playing, replayToken, initialScreen, screenOverride, onStateChange }) {
  const Preview = uiProjects.find(project => project.id === item.id)?.Component
  const host = useRef(null)
  const [shadow, setShadow] = useState(null)
  const [frame, setFrame] = useState({ step: 0, cycle: 0 })
  const [screen, setScreen] = useState(initialScreen || item.posterScreen)
  const cycleCount = useRef(0)
  const active = useRef(playing)
  active.current = playing

  useEffect(() => {
    const element = host.current
    const root = element.shadowRoot ?? element.attachShadow({ mode: 'open' })
    setShadow(root)
    const observer = new ResizeObserver(() => element.style.setProperty('--preview-scale', String(element.clientWidth / 390)))
    observer.observe(element)
    element.style.setProperty('--preview-scale', String(element.clientWidth / 390))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shadow) return undefined
    if (!playing) return undefined
    let timer
    let cancelled = false
    const show = index => {
      if (cancelled) return
      if (index === 0) cycleCount.current += 1
      setScreen(item.steps[index].screen)
      setFrame({ step: index, cycle: cycleCount.current })
      timer = setTimeout(() => show((index + 1) % item.steps.length), item.steps[index].duration)
    }
    const initialIndex = initialScreen ? item.steps.findIndex(step => step.screen === initialScreen) : 0
    show(Math.max(0, initialIndex))
    return () => {
      cancelled = true
      clearTimeout(timer)
      shadow.querySelector('.x-video__play[aria-label="Pause"]')?.click()
    }
  }, [playing, replayToken, item, shadow, initialScreen])

  useEffect(() => {
    const action = item.steps[frame.step]?.action
    if (!shadow || !playing || !action) return undefined
    const timer = setTimeout(() => {
      if (active.current) shadow.querySelector(action.selector)?.click()
    }, action.after ?? 600)
    return () => clearTimeout(timer)
  }, [frame, playing, item, shadow])

  useEffect(() => { if (screenOverride) setScreen(screenOverride) }, [screenOverride, replayToken])
  useEffect(() => { onStateChange?.(screen) }, [screen, onStateChange])

  return <div ref={host} className="mind-studio-preview" data-screen={screen} data-playing={playing} aria-hidden="true" inert="">
    {shadow && createPortal(<><style>{studioStyles + socialStyles + previewStyles}</style><div className={`studio-playback${playing ? '' : ' is-paused'}${frame.cycle === 0 ? ' is-poster' : ''}`} inert=""><Preview key={`${item.id}-${frame.cycle}`} screen={screen} onScreenChange={next => { if (active.current) setScreen(next) }} /></div></>, shadow)}
  </div>
}
