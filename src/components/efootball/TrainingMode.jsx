import { useEffect, useRef, useState } from 'react'
import { Camera, Gamepad2, LoaderCircle, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import './training.css'

const movementKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
const initialHud = { goals: 0, shots: 0, message: 'Ready', charge: 0, view: 'follow' }

export default function TrainingMode() {
  const stageRef = useRef(null), mountRef = useRef(null), apiRef = useRef(null)
  const keysRef = useRef(new Set()), pointerRef = useRef(null)
  const inputRef = useRef({ x: 0, z: 0, cancel: false, space: false, fire: false })
  const [hud, setHud] = useState(initialHud)
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [stick, setStick] = useState({ x: 0, y: 0, active: false })

  function clearMovement() {
    keysRef.current.clear(); pointerRef.current = null
    inputRef.current.x = 0; inputRef.current.z = 0; inputRef.current.cancel = true; inputRef.current.space = false
    setStick({ x: 0, y: 0, active: false })
  }

  useEffect(() => {
    const abort = new AbortController()
    let api
    setStatus('loading')
    import('./training-scene').then(async ({ createTrainingScene }) => {
      if (abort.signal.aborted) return
      api = await createTrainingScene(mountRef.current, inputRef.current, {
        onHud: value => { if (!abort.signal.aborted) setHud(value) },
        onReady: () => { if (!abort.signal.aborted) setStatus('ready') },
      }, abort.signal)
      if (abort.signal.aborted) api?.dispose()
      else apiRef.current = api
    }).catch(error => {
      if (!abort.signal.aborted) { console.error('Football scene failed to load', error); setStatus('error') }
    })
    const fsChange = () => setFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', fsChange)
    window.addEventListener('blur', clearMovement)
    const visibility = () => { if (document.hidden) clearMovement() }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      abort.abort(); api?.dispose(); apiRef.current = null
      window.removeEventListener('blur', clearMovement); document.removeEventListener('visibilitychange', visibility); document.removeEventListener('fullscreenchange', fsChange)
    }
  }, [attempt])

  function toggleFullscreen() {
    const stage = stageRef.current
    if (document.fullscreenElement) document.exitFullscreen?.()
    else stage?.requestFullscreen?.().catch(() => {})
    stage?.focus({ preventScroll: true })
  }

  function key(event, pressed) {
    if (event.target.closest('button')) return
    if (event.code === 'Space') {
      event.preventDefault()
      if (event.repeat || status !== 'ready') return
      if (pressed) { inputRef.current.cancel = false; inputRef.current.space = true }
      else if (inputRef.current.space) { inputRef.current.space = false; inputRef.current.fire = true }
      return
    }
    if (event.code === 'KeyF' && pressed && !event.repeat) { event.preventDefault(); toggleFullscreen(); return }
    if (!movementKeys.has(event.code)) return
    event.preventDefault()
    if (pressed) keysRef.current.add(event.code)
    else keysRef.current.delete(event.code)
    const keys = keysRef.current
    if (pressed) inputRef.current.cancel = false
    inputRef.current.x = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'))
    inputRef.current.z = Number(keys.has('KeyS') || keys.has('ArrowDown')) - Number(keys.has('KeyW') || keys.has('ArrowUp'))
  }

  function pointerDown(event) {
    if (event.target.closest('button') || status !== 'ready' || pointerRef.current || hud.view === 'player') return
    event.preventDefault(); stageRef.current.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
    inputRef.current.cancel = false
    setStick({ x: 0, y: 0, active: true })
  }

  function pointerMove(event) {
    const start = pointerRef.current
    if (!start || start.id !== event.pointerId) return
    const x = (event.clientX - start.x) / 54, y = (event.clientY - start.y) / 54
    const length = Math.max(1, Math.hypot(x, y))
    inputRef.current.x = x / length; inputRef.current.z = y / length
    setStick({ x: x / length * 26, y: y / length * 26, active: true })
  }

  function pointerUp(event) {
    if (pointerRef.current?.id !== event.pointerId) return
    pointerRef.current = null; inputRef.current.x = 0; inputRef.current.z = 0
    setStick({ x: 0, y: 0, active: false })
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <section className="ef-training" aria-label="Football training">
      <div className="ef-training__title">
        <div><small>eFootball</small><h2>Training ground</h2></div>
        <span><i /> Free training</span>
      </div>
      <div className="ef-training__stage" ref={stageRef} tabIndex={0}
        aria-label="Football game. Move with WASD, arrow keys, or drag. Hold Space to charge a shot and release to shoot. Press F for full screen."
        onKeyDown={event => key(event, true)} onKeyUp={event => key(event, false)}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) clearMovement() }}
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
        onPointerCancel={clearMovement} onLostPointerCapture={() => { if (pointerRef.current) clearMovement() }}>
        <div className="ef-training__mount" ref={mountRef} />
        <div className="ef-training__hud">
          <span>Goals<strong>{String(hud.goals).padStart(2, '0')}</strong></span>
          <span>Shots<strong>{String(hud.shots).padStart(2, '0')}</strong></span>
        </div>
        <div className="ef-training__tools">
          <button type="button" aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} data-tooltip={fullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
            aria-pressed={fullscreen} onClick={toggleFullscreen}>
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button type="button" disabled={status !== 'ready'} aria-label={hud.view === 'follow' ? 'Inspect player' : 'Return to game'}
            data-tooltip={hud.view === 'follow' ? 'Inspect player' : 'Return to game'} aria-pressed={hud.view === 'player'}
            onClick={() => { clearMovement(); apiRef.current?.toggleView(); stageRef.current.focus({ preventScroll: true }) }}>
            {hud.view === 'follow' ? <Camera size={18} /> : <Gamepad2 size={18} />}
          </button>
          <button type="button" aria-label="Reset training" data-tooltip="Reset training" disabled={status !== 'ready'}
            onClick={() => { clearMovement(); apiRef.current?.reset(); stageRef.current.focus({ preventScroll: true }) }}><RotateCcw size={18} /></button>
        </div>
        <div className="ef-training__hint" aria-hidden="true"><kbd>WASD</kbd> move <kbd>Space</kbd> hold &amp; release to shoot <kbd>F</kbd> full screen</div>
        <div className="ef-training__player"><span>10</span><div><strong>MESSI</strong><small>PARIS / LWF</small></div></div>
        <div className="ef-training__status" aria-live="polite" aria-atomic="true">{status === 'ready' ? hud.message : ''}</div>
        <div className="ef-training__power" role="meter" aria-label="Shot power" aria-valuenow={hud.charge} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ transform: `scaleX(${hud.charge / 100})` }} />
        </div>
        <div className={`ef-training__stick ${stick.active ? 'is-active' : ''}`} aria-hidden="true">
          <span style={{ transform: `translate(${stick.x}px, ${stick.y}px)` }} />
        </div>
        {status !== 'ready' && <div className="ef-training__loading" role="status">
          {status === 'loading' ? <><LoaderCircle size={24} /><span>Preparing the pitch</span></> : <><span>The pitch could not load.</span><button type="button" onClick={() => setAttempt(value => value + 1)}><RotateCcw size={16} /> Retry</button></>}
        </div>}
      </div>
    </section>
  )
}
