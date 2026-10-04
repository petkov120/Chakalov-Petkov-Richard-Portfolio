import { useCallback, useEffect, useRef, useState } from 'react'

const readId = projects => projects.find(project => project.href === location.pathname)?.id ?? null
const rectOf = element => {
  const { left, top, width, height } = element.getBoundingClientRect()
  return { left, top, width, height }
}

/**
 * Each prototype has its own URL (/interactions/social ...) but opens as an overlay on the homepage.
 * Handles deep links, the back button, and animating the overlay back into the piece it came from.
 */
export default function useShowcaseRoute(projects) {
  const [id, setId] = useState(() => readId(projects))
  const [closing, setClosing] = useState(false)
  const [entry, setEntry] = useState(null) // where the overlay opens from
  const current = useRef(id)
  const returnTo = useRef(null)
  current.current = id

  const open = useCallback((project, trigger) => {
    if (current.current) return
    returnTo.current = trigger
    const screen = trigger.querySelector('.mind-studio-preview')?.dataset.screen || project.posterScreen
    setEntry({ id: project.id, screen, rect: rectOf(trigger.querySelector('.stage__phone')) })
    history.pushState({ showcase: true }, '', project.href)
    setClosing(false)
    setId(project.id)
  }, [])

  const change = useCallback(next => {
    const project = projects.find(item => item.id === next)
    if (!project) return
    history.replaceState(history.state, '', project.href)
    setId(next)
  }, [projects])

  const requestClose = useCallback(() => setClosing(true), [])

  const finishClose = useCallback(() => {
    const was = current.current
    setId(null)
    setClosing(false)
    requestAnimationFrame(() => (document.querySelector(`[data-study="${was}"] .stage__link`) ?? returnTo.current)?.focus({ preventScroll: true }))
    if (readId(projects)) {
      if (history.state?.showcase) history.back()
      else history.replaceState(null, '', '/#work')
    }
  }, [projects])

  // The piece's current on-screen frame, so the overlay can fly back into it (null when it's off screen).
  const getReturnRect = useCallback(() => {
    const item = document.querySelector(`[data-study="${current.current}"]`)
    if (!item) return null
    item.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' })
    const rect = rectOf(item.querySelector('.stage__phone'))
    return rect.bottom > 0 && rect.top < innerHeight ? rect : null
  }, [])

  useEffect(() => {
    const onPop = () => {
      const next = readId(projects)
      if (current.current && !next) setClosing(true)
      else { setClosing(false); setId(next) }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [projects])

  return { id, closing, entry, open, change, requestClose, finishClose, getReturnRect }
}
