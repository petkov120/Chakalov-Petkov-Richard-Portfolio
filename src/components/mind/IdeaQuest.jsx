import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './idea-quest.css'

const ideas = [
  { x: '39%', y: '17%', word: 'What if?' },
  { x: '87%', y: '36%', word: 'Try it.' },
  { x: '17%', y: '69%', word: 'Make it.' },
]

function Spark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 2h8v10h4v4h10v8H28v4h-4v10h-8V28h-4v-4H2v-8h10v-4h4Z" fill="currentColor" stroke="#111" strokeWidth="2" /><path d="M17 12h6v5h5v6h-5v5h-6v-5h-5v-6h5Z" fill="#fff8b3" /></svg>
}

function Gamepad() {
  return <svg viewBox="0 0 48 36" fill="none" aria-hidden="true"><path d="M12 5h24v4h5v5h3v17H32v-6H16v6H4V14h3V9h5Z" fill="currentColor" /><path d="M14 12v11m-5-5h11" stroke="#fafaf8" strokeWidth="3" /><path d="M31 12h4v4h-4zm5 6h4v4h-4z" fill="#ffe72d" /></svg>
}

export default function IdeaQuest({ controlsTarget, still, reduced, entering }) {
  const [playing, setPlaying] = useState(false)
  const [caught, setCaught] = useState([])
  const targets = useRef([])
  const control = useRef(null)
  const moveFocus = useRef(false)
  const won = caught.length === ideas.length

  useEffect(() => {
    if (!moveFocus.current || entering) return
    moveFocus.current = false
    const next = won ? control.current : targets.current.find(Boolean)
    next?.focus({ preventScroll: true })
    if (next) {
      const rect = next.getBoundingClientRect()
      if (rect.top < 0 || rect.bottom > innerHeight) next.scrollIntoView({ block: 'center', behavior: reduced ? 'instant' : 'smooth' })
    }
  }, [caught, playing, won, reduced, entering])

  const start = () => {
    if (entering) return
    moveFocus.current = true
    setCaught([])
    setPlaying(true)
  }
  const catchIdea = (event, index) => {
    event.stopPropagation()
    if (!playing || entering) return
    moveFocus.current = event.detail === 0
    setCaught(previous => previous.includes(index) ? previous : [...previous, index])
  }
  const message = won ? 'All 3 ideas caught. Curiosity unlocked! Play again or enter the portfolio.' : playing ? `${caught.length} of 3 ideas caught. Catch the ${3 - caught.length} remaining sparks.` : 'Optional side quest: catch three ideas.'

  return <>
    {controlsTarget && createPortal(<div className="idea-quest-control" data-won={won}>
      <button ref={control} type="button" className="idea-quest-control__button" onClick={start} disabled={entering} aria-label={won ? 'Play Catch the ideas again' : playing ? 'Restart Catch the ideas' : 'Play Catch the ideas'} aria-describedby="idea-quest-status">
        <Gamepad />
        <span><small>{won ? 'Quest complete' : playing ? 'Side quest in progress' : 'A little side quest'}</small><strong>{won ? 'Play again?' : playing ? 'Catch the sparks!' : 'Catch the ideas'}</strong></span>
        <span className="idea-quest-control__score" aria-hidden="true">{caught.length}<span>/ 3</span></span>
      </button>
      <span id="idea-quest-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</span>
    </div>, controlsTarget)}
    {playing && <div className="idea-quest" data-still={still} data-reduced={reduced} data-won={won}>
      {ideas.map((idea, index) => <div key={index} className="idea-quest__position" style={{ '--idea-x': idea.x, '--idea-y': idea.y, '--idea-delay': `${index * -.8}s` }}>
        {caught.includes(index) ? <span className="idea-quest__point" aria-hidden="true">+1 idea</span> : <button ref={element => { targets.current[index] = element }} className="idea-quest__spark" type="button" onClick={event => catchIdea(event, index)} disabled={entering} aria-label={`Catch idea ${index + 1}: ${idea.word}`}><span className="idea-quest__spark-art"><Spark /></span><span className="idea-quest__spark-word" aria-hidden="true">{idea.word}</span></button>}
      </div>)}
      {won && <div className="idea-quest__celebration" aria-hidden="true">
        <div className="idea-quest__reward"><Spark /><span>Level up!</span><strong>Curious<br />mind.</strong><small>+100 curiosity</small></div>
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--angle': `${index * 30}deg`, '--confetti-color': ['#ffe72d', '#ff4a9a', '#0669ff'][index % 3], '--travel': `${90 + index % 3 * 30}px` }} />)}
      </div>}
    </div>}
  </>
}
