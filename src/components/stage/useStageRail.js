import { useCallback, useEffect, useRef, useState } from 'react'

const WHEEL_STEP = 24      // px of wheel travel that counts as an intent to move
const WHEEL_COOLDOWN = 420 // ms before the next step
const WHEEL_QUIET = 140    // ms of silence that ends a trackpad swipe's momentum
const DRAG_SLOP = 5

/**
 * Spotlight behaviour for a horizontal rail of `[data-key]` items.
 * - writes `--f` (1 at the centre, falling to 0) on every item so CSS can scale and dim it
 * - reports which item is centred, and whether the rail is at either end
 * - one wheel notch / trackpad swipe moves exactly one item (native scrolling can't, because
 *   snap-to-centre pulls small deltas straight back)
 * - mouse drag, arrow/Home/End keys
 */
export default function useStageRail(rail, keys, reduced) {
  const [focusKey, setFocusKey] = useState(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const keysRef = useRef(keys)
  const focusRef = useRef(null)
  keysRef.current = keys
  focusRef.current = focusKey
  const pending = useRef({ key: null, until: 0 }) // the piece a button press is already travelling to
  const behavior = reduced ? 'instant' : 'smooth'

  const centre = useCallback(key => {
    const node = rail.current
    const item = node?.querySelector(`[data-key="${key}"]`)
    if (!item) return
    // Scroll the rail itself: scrollIntoView on a snap scroller is unreliable in Safari/Firefox and can also move the page.
    const left = item.getBoundingClientRect().left - node.getBoundingClientRect().left + node.scrollLeft - (node.clientWidth - item.offsetWidth) / 2
    const max = node.scrollWidth - node.clientWidth
    pending.current = { key, until: performance.now() + 700 }
    node.scrollTo({ left: Math.max(0, Math.min(max, left)), behavior })
  }, [rail, behavior])

  const step = useCallback(direction => {
    const list = keysRef.current
    const from = pending.current.until > performance.now() ? pending.current.key : focusRef.current
    const at = list.indexOf(from ?? list[0])
    const next = list[Math.max(0, Math.min(list.length - 1, at + direction))]
    if (next) centre(next)
  }, [centre])

  useEffect(() => {
    const node = rail.current
    let frame = 0
    const measure = () => {
      frame = 0
      const bounds = node.getBoundingClientRect()
      const middle = bounds.left + bounds.width / 2
      let best = { key: null, f: -1 }
      node.querySelectorAll('[data-key]').forEach(element => {
        const r = element.getBoundingClientRect()
        const f = Math.max(0, 1 - Math.abs(r.left + r.width / 2 - middle) / (bounds.width * .34))
        element.style.setProperty('--f', f.toFixed(3))
        if (f > best.f) best = { key: element.dataset.key, f }
      })
      setFocusKey(previous => previous === best.key ? previous : best.key)
      const start = node.scrollLeft < 2
      const end = node.scrollLeft + node.clientWidth >= node.scrollWidth - 3
      setEdge(previous => previous.start === start && previous.end === end ? previous : { start, end })
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(measure) }

    let travel = 0
    let lockUntil = 0
    const onWheel = event => {
      if (node.scrollWidth - node.clientWidth <= 2) return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return
      const atStart = node.scrollLeft <= 1
      const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return // let the page scroll past either end
      event.preventDefault()
      const now = performance.now()
      if (now < lockUntil) { lockUntil = Math.max(lockUntil, now + WHEEL_QUIET); travel = 0; return }
      travel += delta
      if (Math.abs(travel) < WHEEL_STEP) return
      step(Math.sign(travel))
      travel = 0
      lockUntil = now + WHEEL_COOLDOWN
    }

    const resize = new ResizeObserver(request)
    resize.observe(node)
    node.addEventListener('scroll', request, { passive: true })
    node.addEventListener('wheel', onWheel, { passive: false })
    measure()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      node.removeEventListener('scroll', request)
      node.removeEventListener('wheel', onWheel)
    }
  }, [rail, keys, step])

  const drag = useRef(null)
  const moved = useRef(false)
  const endDrag = event => {
    if (!drag.current) return
    drag.current = null
    rail.current.classList.remove('is-dragging')
    if (rail.current.hasPointerCapture(event.pointerId)) rail.current.releasePointerCapture(event.pointerId)
  }

  const railProps = {
    tabIndex: 0,
    onDragStart: event => event.preventDefault(), // links are draggable by default and would cancel the gesture
    onKeyDown: event => {
      if (event.target !== rail.current) return
      const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
      if (move) { event.preventDefault(); step(move) }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        const list = keysRef.current
        centre(event.key === 'Home' ? list[0] : list[list.length - 1])
      }
    },
    onPointerDown: event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      moved.current = false
      drag.current = { x: event.clientX, left: rail.current.scrollLeft }
    },
    onPointerMove: event => {
      if (!drag.current) return
      const delta = event.clientX - drag.current.x
      if (Math.abs(delta) <= DRAG_SLOP) return
      moved.current = true
      if (!rail.current.hasPointerCapture(event.pointerId)) rail.current.setPointerCapture(event.pointerId)
      rail.current.classList.add('is-dragging')
      rail.current.scrollLeft = drag.current.left - delta
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onLostPointerCapture: () => { drag.current = null; rail.current?.classList.remove('is-dragging') },
    // a drag must not count as a click on whatever is under the pointer
    onClickCapture: event => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false } },
  }

  return { focusKey, edge, centre, step, railProps }
}
