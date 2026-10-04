import { useLayoutEffect, useRef, useState } from 'react'

/** A 1920×1080 design that scales to whatever width it is given, so every screen reads as the real artboard. */
export default function Artboard({ label, children }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.5)
  useLayoutEffect(() => {
    const fit = () => setScale(box.current.clientWidth / 1920)
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={box} className="hgd-artboard" role="img" aria-label={label}>
      <div className="hgd-board" style={{ transform: `scale(${scale})` }} inert="">{children}</div>
    </div>
  )
}
