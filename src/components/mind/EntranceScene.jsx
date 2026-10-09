import { useEffect, useRef, useState } from 'react'
import './entrance.css'
import IdeaQuest from './IdeaQuest'

const ENTER_DURATION = 1550

function Arrow({ className = '' }) {
  return <svg className={className} viewBox="0 0 64 32" fill="none" aria-hidden="true"><path d="M3 16h55M44 3l14 13-14 13" stroke="currentColor" strokeWidth="2" /></svg>
}

function PointingHand() {
  return (
    <div className="collage-pointer" aria-hidden="true">
      <div className="collage-pointer__drift">
        <p className="collage-pointer__tip">Click the monitor<br />to see the work</p>
        <svg className="collage-pointer__hand" viewBox="0 0 180 110" fill="none">
          <path fill="#171717" d="M6 24h38v62H6z" />
          <path fill="#ffe72d" stroke="#111" strokeWidth="3" d="M36 24h18v62H36z" />
          <rect x="50" y="16" width="54" height="74" rx="14" fill="#f3c7a3" stroke="#111" strokeWidth="3" />
          <path fill="#f3c7a3" stroke="#111" strokeWidth="3" strokeLinejoin="round" d="M64 80c10 20 34 18 42 4 3-6-4-14-14-16H70Z" />
          <rect x="96" y="12" width="78" height="22" rx="11" fill="#f3c7a3" stroke="#111" strokeWidth="3" />
          <rect x="96" y="38" width="50" height="16" rx="8" fill="#f3c7a3" stroke="#111" strokeWidth="3" />
          <rect x="96" y="56" width="40" height="14" rx="7" fill="#f3c7a3" stroke="#111" strokeWidth="3" />
          <rect x="96" y="72" width="28" height="12" rx="6" fill="#f3c7a3" stroke="#111" strokeWidth="3" />
        </svg>
      </div>
    </div>
  )
}

function NigeriaFlag() {
  return (
    <span className="collage-flag" aria-hidden="true">
      <svg viewBox="0 0 36 24" fill="none">
        <g className="collage-flag__bounce">
          <path fill="#171717" d="M2.1 1.1h1.7v21.4H2.1z" />
          <circle fill="#171717" cx="2.95" cy="1.35" r="1.25" />
          <g className="collage-flag__wave">
            <path fill="#008751" d="M4.4 2.1c3.4-.45 5.7.35 8.6 0v12.2c-2.9.5-5.2-.3-8.6 0V2.1Z" />
            <path fill="#fff" d="M13 2.1c2.9-.35 5.4.35 8.3 0v12.2c-2.9.5-5.4-.3-8.3 0V2.1Z" />
            <path fill="#008751" d="M21.3 2.1c3.5-.45 6.5.4 9.6 0v12.2c-3.1.55-6.1-.3-9.6 0V2.1Z" />
          </g>
        </g>
      </svg>
    </span>
  )
}

function FloatingNote({ name, className, children, reduced, paused }) {
  const animation = useRef(null)
  useEffect(() => () => animation.current?.cancel(), [])
  useEffect(() => { if (paused || reduced) animation.current?.cancel() }, [paused, reduced])
  const nudge = event => {
    if (reduced || paused) return
    animation.current?.cancel()
    animation.current = event.currentTarget.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-36px) rotate(9deg)', offset: .35 },
      { transform: 'translateY(9px) rotate(-4deg)', offset: .7 },
      { transform: 'translateY(0) rotate(0deg)' },
    ], { duration: 1000, easing: 'cubic-bezier(.22,.8,.2,1)' })
  }
  return <div className={`collage-piece ${className}`}><div className="collage-piece__drift"><button type="button" onClick={nudge} disabled={paused} aria-label={`Float ${name}`} className="collage-piece__touch">{children}</button></div></div>
}

export default function EntranceScene({ onEnter, onPrepare, reduced }) {
  const [entering, setEntering] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [questControls, setQuestControls] = useState(null)
  const root = useRef(null)
  const paper = useRef(null)
  const screen = useRef(null)
  const started = useRef(false)
  const pointerFrame = useRef(0)
  const still = reduced || paused || hidden || entering

  useEffect(() => {
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const visibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('visibilitychange', visibility)
      cancelAnimationFrame(pointerFrame.current)
    }
  }, [])
  useEffect(() => {
    if (!entering) return undefined
    const timer = setTimeout(onEnter, reduced ? 180 : ENTER_DURATION)
    return () => clearTimeout(timer)
  }, [entering, onEnter, reduced])

  const enter = () => {
    if (started.current) return
    started.current = true
    cancelAnimationFrame(pointerFrame.current)
    const target = screen.current.getBoundingClientRect()
    const plane = paper.current.getBoundingClientRect()
    const x = target.left + target.width / 2
    const y = target.top + target.height / 2
    const style = root.current.style
    style.setProperty('--portal-x', `${x - plane.left}px`)
    style.setProperty('--portal-y', `${y - plane.top}px`)
    style.setProperty('--portal-dx', `${innerWidth / 2 - x}px`)
    style.setProperty('--portal-dy', `${innerHeight / 2 - y}px`)
    style.setProperty('--portal-scale', Math.max(innerWidth / target.width, innerHeight / target.height) * 1.8)
    onPrepare()
    setEntering(true)
  }
  const move = event => {
    if (still || event.pointerType !== 'mouse') return
    const x = (event.clientX / innerWidth - .5) * 14
    const y = (event.clientY / innerHeight - .5) * 12
    cancelAnimationFrame(pointerFrame.current)
    pointerFrame.current = requestAnimationFrame(() => {
      root.current?.style.setProperty('--float-x', `${x}px`)
      root.current?.style.setProperty('--float-y', `${y}px`)
    })
  }
  const reset = () => {
    if (entering) return
    cancelAnimationFrame(pointerFrame.current)
    root.current.style.setProperty('--float-x', '0px')
    root.current.style.setProperty('--float-y', '0px')
  }
  const noteProps = { reduced, paused: still }

  return <section ref={root} className={`collage-entrance${entering ? ' is-entering' : ''}`} data-still={still} data-reduced={reduced} style={{ '--enter-duration': `${ENTER_DURATION}ms` }} aria-labelledby="entrance-title" aria-busy={entering} onPointerMove={move} onPointerLeave={reset}>
    <div ref={paper} className="collage-paper">
      <header className="collage-header">
        <div className="collage-identity"><span className="collage-monogram">P.</span><p className="collage-identity__name">Petkov Chakalov<span>Design Engineer</span></p></div>
        <div className="collage-location"><a className="collage-skip" href="/#work" onClick={event => { event.preventDefault(); onEnter() }}>Skip intro →</a><span className="collage-location__place"><NigeriaFlag />Lagos, Nigeria</span><i /><span>2026</span></div>
      </header>
      <div className="collage-layout">
        <div className="collage-copy">
          <div className="collage-copy__stage">
            <FloatingNote {...noteProps} name="ideas note" className="collage-ideas"><span className="collage-note collage-note--yellow">Ideas<br />experiments<br />thoughts<br />in progress…<span className="collage-underline" /></span></FloatingNote>
            <svg className="collage-loop" viewBox="0 0 150 140" fill="none" aria-hidden="true"><path d="M8 25C45-2 102 22 86 61S49 51 86 44s51 51 36 77m-9-19 9 21 17-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <h1 id="entrance-title">Welcome<br />to my<br /><span className="collage-mind"><em>mind</em><svg viewBox="0 0 400 46" aria-hidden="true"><path d="M12 24Q180 2 378 9Q210 16 160 34Q310 17 376 29" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></span></h1>
            <span className="collage-stamp">Built<br />by<br />curiosity.</span>
          </div>
          <div className="collage-invitation"><p>I design and build AI products for<br />healthcare and education, <mark>shipped</mark><br />to paying customers and 3 universities.</p><button type="button" className="collage-enter" onClick={enter} disabled={entering}>See the work <span aria-hidden="true">→</span></button><div className="collage-quest-slot" ref={setQuestControls} /></div>
        </div>
        <div className="collage-art">
          <IdeaQuest controlsTarget={questControls} still={still} reduced={reduced} entering={entering} />
          <span className="collage-tape collage-tape--blue" aria-hidden="true" />
          <div className="collage-computer-position"><div className="collage-computer-drift"><button type="button" className="collage-computer" onClick={enter} disabled={entering} aria-label="Click the monitor to see the work">
            <img src="/images/entrance/mind-computer.webp" alt="" width="1254" height="1254" fetchpriority="high" decoding="async" draggable="false" />
            <span ref={screen} className="collage-screen" aria-hidden="true"><svg className="collage-tunnel" viewBox="0 0 300 260" preserveAspectRatio="none"><defs><radialGradient id="portal-light"><stop stopColor="#ffe85a" /><stop offset=".44" stopColor="#ffdb00" /><stop offset=".78" stopColor="#ffff35" /><stop offset="1" stopColor="#d3b900" /></radialGradient></defs><path fill="url(#portal-light)" d="M0 0h300v260H0z" /><g fill="none" stroke="#fffab4" strokeWidth="1.1"><path d="M0 0 120 105M300 0 180 105M300 260 180 155M0 260 120 155M100 0l40 105M200 0l-40 105M0 87l120 34M0 173l120-34M300 87l-120 34M300 173l-120-34M100 260l40-105M200 260l-40-105" /><path d="M24 21h252v218H24zM49 43h202v174H49zM75 65h150v130H75zM99 86h102v88H99zM120 105h60v50h-60z" /></g></svg><span className="collage-screen__glow" /><Arrow className="collage-screen__arrow" /><span className="collage-screen__hint">Come on in</span></span>
          </button></div></div>
          <PointingHand />
          {[
            { id: 'figma', name: 'Figma', image: 'figma.svg' },
            { id: 'cursor', name: 'Cursor', image: 'cursor.png' },
            { id: 'vscode', name: 'VS Code', image: 'vscode.png' },
          ].map(tool => <FloatingNote key={tool.id} {...noteProps} name={`${tool.name} logo`} className={`collage-tool collage-tool--${tool.id}`}><span className="collage-tool__tile"><img src={`/images/entrance/${tool.image}`} alt="" width="100" height="100" draggable="false" /><span className="collage-tool__label">{tool.name}</span></span></FloatingNote>)}
          <FloatingNote {...noteProps} name="same mind note" className="collage-same"><span className="collage-note collage-note--pink">Same mind.<br />Different day.<span className="collage-underline" /></span></FloatingNote>
          <FloatingNote {...noteProps} name="creative problem solver note" className="collage-solver"><span className="collage-note collage-note--white">Creative<br />problem<br />solver<br /><small>( still )</small><span className="collage-note__smile">☺</span></span></FloatingNote>
          <FloatingNote {...noteProps} name="loading ideas note" className="collage-loading"><span className="collage-note collage-note--pink">Loading ideas…<span className="collage-underline" /></span></FloatingNote>
        </div>
      </div>
      <footer className="collage-footer"><span className="collage-mantra">Explore <b>\</b> Create <b>\</b> Learn <b>\</b> Repeat <i /></span><button className="collage-motion" type="button" onClick={() => { reset(); setPaused(value => !value) }} aria-pressed={paused} disabled={reduced || entering}>{reduced ? 'Reduced motion' : paused ? 'Resume motion ↗︎' : 'Pause motion Ⅱ'}</button><span className="collage-signature">Petkov Chakalov <i /></span></footer>
    </div>
    <span className="sr-only" role="status">{entering ? 'Entering the portfolio…' : ''}</span>
  </section>
}
