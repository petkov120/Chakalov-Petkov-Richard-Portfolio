import { useEffect, useRef, useState } from 'react'
import PrototypeCase from '../prototype/PrototypeCase'
import { useDialog } from './motion'

const OPEN_MS = 900
const CLOSE_MS = 460
const ease = 'cubic-bezier(.22,.8,.2,1)'

// The prototype page, opened over the homepage. The phone flies out of its gallery piece while
// the dark wash spreads from the same point, and flies back into it on close.
export default function InteractionShowcase({ item, projects, origin, reduced, closing, onClose, onExited, onProjectChange, getReturnRect }) {
  const dialog = useRef(null)
  const device = useRef(null)
  const wash = useRef(null)
  const animations = useRef([])
  const entryTimer = useRef(null)
  const [phase, setPhase] = useState('entering')
  useDialog(dialog, onClose)
  // focus the page itself, so opening doesn't ring the first button; Tab still starts at the top bar
  useEffect(() => { dialog.current.focus({ preventScroll: true }) }, [])

  useEffect(() => { dialog.current.scrollTo({ top: 0, behavior: 'instant' }) }, [item.id])

  const stop = () => { animations.current.forEach(animation => animation.cancel()); animations.current = [] }

  useEffect(() => {
    const phone = device.current
    const target = phone.getBoundingClientRect()
    const x = origin ? origin.left + origin.width / 2 : innerWidth / 2
    const y = origin ? origin.top + origin.height / 2 : innerHeight / 2
    if (!reduced && phone.animate) {
      const radius = Math.hypot(innerWidth, innerHeight)
      const tint = `color-mix(in srgb, ${item.accent} 30%, #0b0b0c)`
      animations.current.push(wash.current.animate([
        { clipPath: `circle(0px at ${x}px ${y}px)`, backgroundColor: tint },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)`, backgroundColor: '#0b0b0c' },
      ], { duration: OPEN_MS, easing: ease, fill: 'both' }))
      const from = origin
        ? `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${origin.width / target.width}, ${origin.height / target.height})`
        : 'translate(0, 45px) scale(.92)'
      animations.current.push(phone.animate([
        { transformOrigin: 'top left', transform: from, opacity: origin ? 1 : 0 },
        { transformOrigin: 'top left', offset: .78, transform: 'translate(0, -5px) scale(1.02, .985)', opacity: 1 },
        { transformOrigin: 'top left', transform: 'none', opacity: 1 },
      ], { duration: OPEN_MS, easing: ease, fill: 'both' }))
    }
    entryTimer.current = setTimeout(() => { stop(); setPhase('ready') }, reduced ? 80 : OPEN_MS)
    return () => { clearTimeout(entryTimer.current); stop() }
    // The opening geometry is captured once; switching projects stays inside the overlay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  useEffect(() => {
    if (!closing) return undefined
    clearTimeout(entryTimer.current)
    stop()
    setPhase('closing')
    dialog.current.scrollTo({ top: 0, behavior: 'instant' })
    const phone = device.current
    const target = getReturnRect?.()
    const current = phone.getBoundingClientRect()
    if (!reduced && phone.animate) {
      const to = target
        ? `translate(${target.left - current.left}px, ${target.top - current.top}px) scale(${target.width / current.width}, ${target.height / current.height})`
        : 'translate(0, 28px) scale(.95)'
      animations.current.push(phone.animate([
        { transformOrigin: 'top left', transform: 'none', opacity: 1 },
        { transformOrigin: 'top left', transform: to, opacity: target ? 1 : 0 },
      ], { duration: CLOSE_MS, easing: ease, fill: 'forwards' }))
      // the wash fades rather than shrinking: a closing dark circle would sit on the phone as it lands
      animations.current.push(wash.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS * .8, easing: 'ease-out', fill: 'forwards' }))
    }
    const timer = setTimeout(onExited, reduced ? 80 : CLOSE_MS)
    return () => clearTimeout(timer)
  }, [closing, reduced, onExited, getReturnRect])

  return <dialog ref={dialog} className="mind-dialog mind-showcase" tabIndex={-1} data-phase={phase} data-project={item.id} aria-labelledby="pcase-title">
    <div ref={wash} className="mind-showcase__wash" aria-hidden="true" />
    <PrototypeCase key={item.id} item={item} projects={projects} deviceRef={device}
      interactive={phase === 'ready' && !closing} onClose={onClose} onProjectChange={onProjectChange} />
  </dialog>
}
