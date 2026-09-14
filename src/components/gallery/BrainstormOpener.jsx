import { useEffect, useRef, useState } from 'react'
import './brainstorm-opener.css'

const threads = Array.from({ length: 18 }, (_, index) => index)
const projects = [
  { name: 'Clinify', field: 'Care, connected.', href: '/clinify', image: '/images/clinify/member-communications.png', className: 'care' },
  { name: 'UniversityX', field: 'A different way to learn.', href: '/universityx', image: '/images/universityx/new-ai-tutor-interface.webp', className: 'learn' },
  { name: 'Ledger', field: 'Room for clarity.', href: '/playground', image: '/images/playground/ledger-dashboard-empty-state.webp', className: 'play' },
]

export default function BrainstormOpener() {
  const root = useRef(null)
  const stage = useRef(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(root.current)
    return () => {
      media.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const element = stage.current
    if (paused || reducedMotion || !visible) {
      element.style.setProperty('--pointer-x', '0deg')
      element.style.setProperty('--pointer-y', '0deg')
      return undefined
    }
    let frame = 0
    const move = (event) => {
      if (event.pointerType === 'touch') return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--pointer-x', `${x * 12}deg`)
        element.style.setProperty('--pointer-y', `${-y * 10}deg`)
      })
    }
    const reset = () => {
      cancelAnimationFrame(frame)
      element.style.setProperty('--pointer-x', '0deg')
      element.style.setProperty('--pointer-y', '0deg')
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
    }
  }, [paused, reducedMotion, visible])

  return (
    <section ref={root} className="brainstorm" aria-labelledby="gallery-name" data-paused={paused || reducedMotion || !visible}>
      <div className="brainstorm__masthead">
        <span><i aria-hidden="true" /> Design engineer · Lagos</span>
        <span className="brainstorm__edition">Selected work / 2026</span>
      </div>
      <div className="brainstorm__layout">
        <div className="brainstorm__copy">
          <p className="brainstorm__eyebrow">A little curiosity. A lot of making.</p>
          <h1 id="gallery-name" className="brainstorm__name display">Petkov<em>Chakalov</em></h1>
          <p className="brainstorm__description">I turn tangled questions into software people can trust.</p>
          <a className="brainstorm__cta" href="#works">Explore my work <span aria-hidden="true">↗</span></a>
          <p className="brainstorm__footnote">From the first what-if to the thing that works.</p>
        </div>
        <div ref={stage} className="brainstorm__stage">
          <div className="brainstorm__halo" aria-hidden="true" />
          <div className="brainstorm__floor" aria-hidden="true" />
          <div className="brainstorm__scene">
            <div className="brainstorm__sculpture" aria-hidden="true">
              <div className="brainstorm__weave">
                {threads.map((thread) => <span key={thread} className="brainstorm__thread" style={{ '--thread': thread }} />)}
              </div>
            </div>
            <span className="brainstorm__thought brainstorm__thought--one" aria-hidden="true">what if?</span>
            <span className="brainstorm__thought brainstorm__thought--two" aria-hidden="true">make it matter.</span>
            {projects.map((project, index) => (
              <div key={project.name} className={`brainstorm__project-position brainstorm__project-position--${project.className}`}>
                <a className="brainstorm__project" href={project.href} style={{ '--project': index }}>
                  <div className="brainstorm__project-bar"><span className="brainstorm__project-dot" />{project.name}<span aria-hidden="true">↗</span></div>
                  <img src={project.image} alt={`${project.name} interface preview`} width="480" height="300" decoding="async" />
                  <div className="brainstorm__project-caption">{project.field}</div>
                </a>
              </div>
            ))}
            <span className="brainstorm__spark brainstorm__spark--one" aria-hidden="true">✳</span>
            <span className="brainstorm__spark brainstorm__spark--two" aria-hidden="true">+</span>
          </div>
          <div className="brainstorm__art-caption"><span className="brainstorm__caption-rule" /> Ideas taking shape <span className="brainstorm__caption-index">Fig. 01</span></div>
        </div>
      </div>
      <div className="brainstorm__bottom">
        <a href="#works"><span aria-hidden="true">↓</span> Follow the thread</a>
        <span className="brainstorm__bottom-note">Curiosity → clarity → craft</span>
        {!reducedMotion && <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label="Pause opener animation"><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span> {paused ? 'Resume motion' : 'Pause motion'}</button>}
      </div>
    </section>
  )
}
