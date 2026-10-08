import { useEffect, useState } from 'react'

// A pulsing marker on the next thing worth tapping, with a few words beside it. It reads the
// project's `guide`, skips steps whose destination the visitor has already reached, and lets
// every tap straight through to the prototype underneath.
export default function TapGuide({ guide, screen, visited, deviceRef, active }) {
  const [completed, setCompleted] = useState(() => new Set())
  const step = active ? (guide?.[screen] ?? []).find(item => {
    const key = `${screen}:${item.target}`
    return !completed.has(key) && (!item.opens || !visited.has(item.opens))
  }) : undefined
  const [spot, setSpot] = useState(null)

  useEffect(() => {
    setSpot(null)
    const device = deviceRef.current
    const root = device?.querySelector('.mind-studio-preview')?.shadowRoot
    if (!step || !root) return undefined
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = root.querySelector(step.target)?.getBoundingClientRect()
        const frameBox = device.getBoundingClientRect()
        const screenBox = device.querySelector('.pcase__screen')?.getBoundingClientRect()
        if (!box || !screenBox) { setSpot(null); return }
        const x = box && box.left + box.width / 2
        const y = box && box.top + box.height / 2
        const visible = box?.width && x > screenBox.left && x < screenBox.right && y > screenBox.top + 24 && y < screenBox.bottom - 24
        setSpot(visible ? { x: x - frameBox.left, y: y - frameBox.top, low: y > screenBox.top + screenBox.height * .7 } : null)
      })
    }
    measure() // stable screens get their indicator on the very next frame
    const settleFast = setTimeout(measure, 120)
    const settle = setTimeout(measure, 450) // measure again after the screen's own transition
    root.addEventListener('scroll', measure, true)
    const use = event => {
      if (!event.target.closest?.(step.target)) return
      const key = `${screen}:${step.target}`
      setCompleted(done => done.has(key) ? done : new Set(done).add(key))
    }
    root.addEventListener('click', use, true)
    const observer = new ResizeObserver(measure)
    observer.observe(device)
    const screenNode = device.querySelector('.pcase__screen')
    if (screenNode) observer.observe(screenNode)
    const mutations = new MutationObserver(measure)
    mutations.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-label', 'disabled'] })
    return () => { clearTimeout(settleFast); clearTimeout(settle); cancelAnimationFrame(frame); root.removeEventListener('scroll', measure, true); root.removeEventListener('click', use, true); observer.disconnect(); mutations.disconnect() }
  }, [step, screen, deviceRef])

  if (!step || !spot) return null
  return <div className="tap-guide" data-low={spot.low} style={{ '--x': `${spot.x}px`, '--y': `${spot.y}px` }}>
    <span className="tap-guide__dot" aria-hidden="true" />
    <span className="tap-guide__line" aria-hidden="true" />
    <span className="tap-guide__label" role="status">{step.label}</span>
  </div>
}
