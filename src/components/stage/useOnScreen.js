import { useEffect, useState } from 'react'

/** True while the element is in view and the tab is visible, so previews don't animate off-screen. */
export default function useOnScreen(ref) {
  const [inView, setInView] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .12 })
    observer.observe(ref.current)
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [ref])
  return inView && tabVisible
}
