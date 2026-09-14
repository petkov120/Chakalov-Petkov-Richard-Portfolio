import { useEffect, useState } from 'react'

export const timing = { enter: 1250, lift: 420, cover: 650, turn: 720, close: 650 }
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  return reduced
}

export function useVisible(ref, threshold = 0.35) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold })
    if (ref.current) observer.observe(ref.current)
    const hide = () => { if (document.hidden) setVisible(false); else if (ref.current) { const r = ref.current.getBoundingClientRect(); setVisible(r.top < innerHeight * .75 && r.bottom > innerHeight * .25) } }
    document.addEventListener('visibilitychange', hide)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hide) }
  }, [ref, threshold])
  return visible
}

export function useDialog(ref, onClose) {
  useEffect(() => {
    const element = ref.current
    const previous = document.activeElement
    const scroll = window.scrollY
    const oldOverflow = document.body.style.overflow
    const oldGutter = document.documentElement.style.scrollbarGutter
    document.documentElement.style.scrollbarGutter = 'stable'
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = oldOverflow
      document.documentElement.style.scrollbarGutter = oldGutter
      window.scrollTo({ top: scroll, behavior: 'instant' })
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [ref])
  useEffect(() => {
    const cancel = event => { event.preventDefault(); onClose() }
    const element = ref.current
    element.addEventListener('cancel', cancel)
    return () => element.removeEventListener('cancel', cancel)
  }, [ref, onClose])
}
