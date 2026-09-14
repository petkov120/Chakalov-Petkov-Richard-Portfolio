import { useEffect, useRef } from 'react'
import { clamp } from './motion'

function BodyWithFocal({ body, focal, focalRef }) {
  if (!focal || !body.includes(focal)) return <p className="mind-showcase-beat__body">{body}</p>
  const [before, after] = body.split(focal)
  return <p className="mind-showcase-beat__body">{before}<em ref={focalRef}>{focal}</em>{after}</p>
}

export default function ScrollZoomBeat({
  part,
  index,
  total,
  scrollRoot,
  reduced,
  suspended,
  stickyTop = 78,
  onTravel,
}) {
  const section = useRef(null)
  const plane = useRef(null)
  const focal = useRef(null)
  const progress = useRef(null)

  useEffect(() => {
    const container = section.current
    const layer = plane.current
    const root = scrollRoot?.current
    if (!container || !layer || !focal.current) return undefined

    if (reduced) {
      layer.style.transform = ''
      layer.style.opacity = ''
      onTravel?.(index, 0, 0)
      return undefined
    }

    let frame = 0
    let focalX = 0
    let focalY = 0

    const render = () => {
      frame = 0
      if (suspended) return

      const sticky = container.querySelector('.mind-showcase-beat__sticky')
      const rect = container.getBoundingClientRect()
      const vh = sticky.clientHeight
      const p = clamp(-rect.top / Math.max(1, rect.height - vh))
      const approach = clamp((p - .16) / .66)
      const travel = approach * approach * (3 - 2 * approach)
      const mobile = container.clientWidth <= 760
      const scale = 1 + travel ** 2 * (mobile ? 8 : 12)
      const tx = (container.clientWidth / 2 - focalX) * travel
      const ty = (vh / 2 - focalY) * travel

      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`
      layer.style.opacity = String(1 - clamp((p - .82) / .15))
      if (progress.current) progress.current.style.transform = `scaleX(${p})`
      onTravel?.(index, travel, p)
    }

    const request = () => { if (!frame) frame = requestAnimationFrame(render) }
    const measure = () => {
      const before = layer.style.transform
      layer.style.transform = 'none'
      const target = focal.current.getBoundingClientRect()
      const base = layer.getBoundingClientRect()
      focalX = target.left - base.left + target.width / 2
      focalY = target.top - base.top + target.height / 2
      layer.style.transformOrigin = `${focalX}px ${focalY}px`
      layer.style.transform = before
      request()
    }

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(focal.current)
    root?.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', measure)
    measure()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      root?.removeEventListener('scroll', request)
      window.removeEventListener('resize', measure)
    }
  }, [reduced, suspended, scrollRoot, index, onTravel])

  return (
    <article
      ref={section}
      className="mind-showcase-beat"
      aria-label={part.title}
      style={{ '--showcase-sticky-top': `${stickyTop}px` }}
    >
      <div className="mind-showcase-beat__sticky">
        <div className="mind-showcase-beat__meta mind-label">
          <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span>Scroll to map ↓</span>
        </div>
        <div ref={plane} className="mind-showcase-beat__plane">
          <h3 className="mind-showcase-beat__title">{part.title}</h3>
          <BodyWithFocal body={part.body} focal={part.focal} focalRef={focal} />
        </div>
        <div className="mind-showcase-beat__footer">
          <span className="mind-label">{part.screen ? 'Mapped to the preview →' : 'Keep scrolling ↓'}</span>
          <span className="mind-showcase-beat__track"><i ref={progress} /></span>
        </div>
      </div>
    </article>
  )
}
