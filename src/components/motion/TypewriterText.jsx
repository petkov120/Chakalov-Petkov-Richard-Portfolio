import { useEffect, useRef, useState } from 'react'

export default function TypewriterText({
  text = 'Thanks for reading.',
  speed = 68,
  className = '',
}) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setDisplayed(text)
      return undefined
    }

    let index = 0
    setDisplayed('')

    const timer = window.setInterval(() => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index >= text.length) window.clearInterval(timer)
    }, speed)

    return () => window.clearInterval(timer)
  }, [started, text, speed])

  const done = displayed.length >= text.length

  return (
    <div className={`typewriter-wrap ${className}`}>
      <p
        ref={ref}
        className="typewriter-text typewriter-text--editorial"
        aria-label={text}
      >
        <span className="typewriter-text__line" aria-hidden="true">
          {displayed}
          {started && !done && (
            <span className="typewriter-cursor" aria-hidden="true">
              |
            </span>
          )}
        </span>
      </p>
    </div>
  )
}
