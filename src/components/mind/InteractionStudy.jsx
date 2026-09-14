import { useEffect, useRef, useState } from 'react'
import { Annotation } from './Marks'
import { useDialog, useVisible } from './motion'
import { cardStudy } from '../../data/mind/projects'
import MindPhone from './MindPhone'
import SocialUI from '../../ui/projects/social/SocialUI'

export function CardDemo({ reduced, suspended = false, interactive = false }) {
  const ref = useRef(null)
  const visible = useVisible(ref)
  const [phase, setPhase] = useState('ready')
  const [automatic, setAutomatic] = useState(!interactive)
  const running = automatic && visible && !reduced && !suspended
  useEffect(() => {
    if (!running) return undefined
    let removeTimer, restoreTimer
    const cycle = () => {
      setPhase('ready')
      removeTimer = setTimeout(() => setPhase('removed'), 2600)
      restoreTimer = setTimeout(() => setPhase('ready'), 5700)
    }
    cycle()
    const loop = setInterval(cycle, 7800)
    return () => { clearTimeout(removeTimer); clearTimeout(restoreTimer); clearInterval(loop) }
  }, [running])
  const remove = () => { setAutomatic(false); setPhase('removed') }
  const undo = () => { setAutomatic(false); setPhase('ready') }
  return <div ref={ref} className="mind-demo-wrap">
    <div className="mind-demo" data-phase={phase}>
      <div className="mind-demo__header"><span className="mind-demo__brand">folio<span>®</span></span><span className="mind-demo__avatar" aria-hidden="true">P</span></div>
      <div className="mind-demo__heading"><span>Your cards</span><span className="mind-demo__count">{phase === 'ready' ? '01' : '00'}</span></div>
      <p className="mind-demo__sub">A little less to carry.</p>
      <div className="mind-demo__space">
        <div className="mind-demo__empty" aria-hidden={phase !== 'removed'}><span>＋</span><p>A little more space.</p><small>Your card has been removed.</small></div>
        <div className="mind-demo__card" aria-hidden={phase === 'removed'}>
          <div><span>Everyday</span><span>↗</span></div><span className="mind-demo__chip" />
          <strong>Good things<br /><em>ahead.</em></strong><footer><span>•••• 2048</span><span className="mind-demo__card-mark">◎</span></footer>
        </div>
      </div>
      <div className="mind-demo__action">
        {phase === 'ready' ? <button className="mind-demo__remove" onClick={remove}><span aria-hidden="true">−</span> Remove card</button> : <div className="mind-demo__confirmation"><span>✓ Card removed</span><button onClick={undo}>Undo ↶</button></div>}
      </div>
      <p className="mind-demo__hint">{phase === 'ready' ? 'Only what you need. Nothing you don’t.' : 'Changed your mind? There’s always undo.'}</p>
      <span className="sr-only" role={automatic ? undefined : 'status'}>{phase === 'removed' ? 'Card removed. Undo is available.' : 'One card available.'}</span>
    </div>
    <div className="mind-demo__controls"><span className="mind-label"><i className={running ? 'is-playing' : ''} />{running ? 'Demonstrating' : 'Try the interaction'}</span>{!reduced && <button onClick={() => setAutomatic(value => !value)} aria-pressed={automatic} aria-label="Automatic demonstration">{automatic ? 'Pause demo Ⅱ' : 'Auto demo ▷'}</button>}</div>
  </div>
}

export function InteractionSection({ reduced, suspended, onOpen, archive = false }) {
  const [screen, setScreen] = useState('feed')
  return <section id="interactions" className="mind-interaction mind-section" aria-labelledby="mind-interaction-title">
    <div className="mind-section__meta"><span className="mind-label">02 / Interactions</span><span className="mind-label">Studies in the hand</span></div>
    <div className="mind-interaction__layout mind-interaction__layout--phones">
      <div className="mind-interaction__copy"><p className="mind-label">Interface, meet feeling.</p><h2 id="mind-interaction-title">Use them,<br /><em>don’t just look.</em></h2><p>A feed you can scroll. A card you can release.<br />Several phones, standing. Not one product shot.</p><button className="mind-link" onClick={onOpen}>Watch & explore <span aria-hidden="true">↗</span></button><Annotation>tap around.<br />they are live.</Annotation></div>
      <div className="mind-phones" aria-label="Interaction phones">
        <MindPhone className="mind-phone--one" label="X redesign">
          <SocialUI screen={screen} onScreenChange={setScreen} />
        </MindPhone>
        <MindPhone className="mind-phone--two" label="Card removal" screenClassName="mind-phone__screen--demo">
          <CardDemo reduced={reduced} suspended={suspended} />
        </MindPhone>
        <MindPhone className="mind-phone--three" label="QuickHand">
          <img src="/images/playground/quickhand-mobile-onboarding.webp" alt="QuickHand mobile onboarding interaction" />
        </MindPhone>
      </div>
    </div>
    {archive && <p className="mind-archive-link">More from the laboratory: <a href="/playground">interface experiments ↗</a></p>}
  </section>
}

export function InteractionReview({ reduced, onClose }) {
  const dialog = useRef(null)
  useDialog(dialog, onClose)
  return <dialog ref={dialog} className="mind-dialog mind-review" aria-labelledby="mind-review-title">
    <header className="mind-dialog__header"><span className="mind-label">Interaction / 001</span><button className="mind-text-button" onClick={onClose} autoFocus>Close <span aria-hidden="true">×</span></button></header>
    <div className="mind-review__body"><div><p className="mind-label">{cardStudy.label}</p><h2 id="mind-review-title">{cardStudy.title}</h2><p className="mind-review__summary">{cardStudy.summary}</p><CardDemo reduced={reduced} interactive /></div><div className="mind-review__notes">{cardStudy.notes.map(note => <section key={note.title}><h3 className="mind-label">{note.title}</h3><p>{note.body}</p></section>)}<Annotation>motion should explain,<br />not decorate.</Annotation></div></div>
  </dialog>
}
