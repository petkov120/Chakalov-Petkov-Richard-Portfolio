import { useEffect, useRef } from 'react'

const ZOOM = 1.08
const restingCamera = () => ({ scale: 1, x: 0, y: 0, emphasis: 0 })

export default function PhonePreview({ children, zoomEnabled }) {
  const phoneRef = useRef(null)
  const cameraRef = useRef(null)
  const fingerRef = useRef(null)

  useEffect(() => {
    const phone = phoneRef.current
    const camera = cameraRef.current
    const finger = fingerRef.current
    const pointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    let current = restingCamera()
    let target = restingCamera()
    let frame = null
    let lastTime = 0
    let pressing = false
    let hovering = false

    const paint = () => {
      camera.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${current.scale})`
      phone.style.setProperty('--camera-emphasis', current.emphasis)
    }

    const animate = (time) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 48) : 16
      lastTime = time
      const ease = 1 - Math.exp(-elapsed / (hovering ? 150 : 110))
      let settled = true

      for (const key of Object.keys(current)) {
        current[key] += (target[key] - current[key]) * ease
        if (Math.abs(target[key] - current[key]) > 0.0001) settled = false
      }

      if (settled) current = { ...target }
      paint()
      frame = settled ? null : window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (frame !== null || pressing) return
      lastTime = 0
      frame = window.requestAnimationFrame(animate)
    }

    const reset = (immediate = false) => {
      pressing = false
      hovering = false
      target = restingCamera()
      finger.classList.remove('is-visible', 'is-pressing')
      if (immediate) {
        window.cancelAnimationFrame(frame)
        frame = null
        current = restingCamera()
        paint()
      } else {
        start()
      }
    }

    const track = (event) => {
      if (event.pointerType === 'touch' || !pointerMedia.matches) return
      hovering = true

      // Measure the stationary frame, never the moving content. Account for
      // the studio's smaller CSS-scaled phone at narrow viewport widths.
      const rect = phone.getBoundingClientRect()
      const localX = (event.clientX - rect.left) * phone.offsetWidth / rect.width - phone.clientLeft
      const localY = (event.clientY - rect.top) * phone.offsetHeight / rect.height - phone.clientTop
      finger.style.left = `${localX}px`
      finger.style.top = `${localY}px`
      finger.classList.add('is-visible')

      if (!zoomEnabled || motionMedia.matches || pressing) return
      const x = Math.max(0.15, Math.min(0.85, (event.clientX - rect.left) / rect.width))
      const y = Math.max(0.15, Math.min(0.85, (event.clientY - rect.top) / rect.height))

      target = {
        scale: ZOOM,
        x: (0.5 - x) * (ZOOM - 1) * camera.offsetWidth,
        y: (0.5 - y) * (ZOOM - 1) * camera.offsetHeight,
        emphasis: 1,
      }
      start()
    }

    const press = (event) => {
      if (event.pointerType === 'touch' || !pointerMedia.matches) return
      track(event)
      pressing = true
      finger.classList.add('is-pressing')
      // Keep the pressed target stationary until release, including drags.
      window.cancelAnimationFrame(frame)
      frame = null
    }

    const release = (event) => {
      if (!pressing) return
      pressing = false
      finger.classList.remove('is-pressing')
      if (hovering) track(event)
    }

    const leave = () => reset()
    const preferenceChanged = () => reset(true)
    const visibilityChanged = () => {
      if (document.hidden) reset(true)
    }

    phone.addEventListener('pointerenter', track)
    phone.addEventListener('pointermove', track)
    phone.addEventListener('pointerdown', press)
    phone.addEventListener('pointerleave', leave)
    phone.addEventListener('pointercancel', leave)
    window.addEventListener('pointerup', release)
    window.addEventListener('blur', leave)
    pointerMedia.addEventListener('change', preferenceChanged)
    motionMedia.addEventListener('change', preferenceChanged)
    document.addEventListener('visibilitychange', visibilityChanged)

    return () => {
      phone.removeEventListener('pointerenter', track)
      phone.removeEventListener('pointermove', track)
      phone.removeEventListener('pointerdown', press)
      phone.removeEventListener('pointerleave', leave)
      phone.removeEventListener('pointercancel', leave)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('blur', leave)
      pointerMedia.removeEventListener('change', preferenceChanged)
      motionMedia.removeEventListener('change', preferenceChanged)
      document.removeEventListener('visibilitychange', visibilityChanged)
      reset(true)
    }
  }, [zoomEnabled])

  return (
    <div ref={phoneRef} className="ui-studio__phone-anchor">
      <div ref={cameraRef} className="ui-studio__camera">
        <div className="ui-studio__phone">
          <div className="ui-studio__phone-screen">{children}</div>
        </div>
      </div>
      <span ref={fingerRef} className="ui-studio__finger" aria-hidden="true" />
    </div>
  )
}
