import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  // Keep content paintable in prerendered HTML; the observer remains for older cached shells.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal-on-scroll ${visible ? 'is-visible' : ''} ${className}`}
      style={visible && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
