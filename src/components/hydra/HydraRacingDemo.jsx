import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Maximize, Zap, ChevronUp, Volume2, VolumeX } from 'lucide-react'
import CarArt, { cars } from './cars'
import './race.css'

const formatTime = t => Math.floor(t / 60) + ':' + (t % 60).toFixed(2).padStart(5, '0')
export default function HydraRacingDemo() {
  const mount = useRef(null), shell = useRef(null), engine = useRef(null), minimap = useRef(null)
  const [selected, setSelected] = useState(0)
  const [hud, setHud] = useState({ phase: 'garage', speed: 0, position: 1, lap: 1, time: 0, boost: 100 })
  const [ready, setReady] = useState(false), [error, setError] = useState('')
  const [muted, setMuted] = useState(false)
  useEffect(() => {
    let cancelled = false, instance
    import('./raceEngine').then(async ({ createRace }) => {
      if (cancelled) return
      instance = await createRace(mount.current, cars, setHud, minimap.current)
      if (cancelled) { instance.dispose(); return }
      engine.current = instance
      setReady(true)
    }).catch(() => setError('The race could not load. Reload with WebGL enabled to try again.'))
    return () => { cancelled = true; instance?.dispose(); engine.current = null }
  }, [])
  const start = () => { engine.current?.start(); shell.current?.focus() }
  const touch = code => ({
    onPointerDown: e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); engine.current?.key(code, true) },
    onPointerUp: () => engine.current?.key(code, false),
    onPointerCancel: () => engine.current?.key(code, false),
    onLostPointerCapture: () => engine.current?.key(code, false),
  })
  const garage = hud.phase === 'garage'
  return <section className="hydra-race" aria-label="Hydra Race playable prototype">
    <div className="race-title"><div><small>HYDRA MOTORSPORT</small><h2>Coastal Circuit</h2></div><span>3 LAPS / 8 DRIVERS</span></div>
    <div className="race-stage" data-phase={hud.phase} ref={shell} tabIndex={0} aria-label="WASD or arrows to drive. Shift boosts. Escape pauses. R restarts."
      onKeyDown={e => { if (e.target.tagName === 'SELECT') return; if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyS','KeyA','KeyD','ShiftLeft','ShiftRight','Escape','KeyR'].includes(e.code)) { e.preventDefault(); if (!e.repeat) engine.current?.key(e.code, true) } }}
      onKeyUp={e => engine.current?.key(e.code, false)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) engine.current?.blur() }}>
      <div className="race-canvas" ref={mount}/><div className="race-vignette"/>
      <canvas className="race-minimap" width="180" height="140" ref={minimap} style={{ display: garage ? 'none' : 'block' }} aria-label="Circuit map and driver positions"/>
      <div className="race-top"><b>HYDRA<span> / RACE</span></b><div className="race-tools">
        <select aria-label="Graphics quality" disabled={!ready} defaultValue="auto" onChange={e => engine.current?.quality(e.target.value)}><option value="auto">Auto</option><option value="high">High</option><option value="low">Low</option></select>
        <button title={muted ? 'Unmute engine' : 'Mute engine'} aria-label={muted ? 'Unmute engine' : 'Mute engine'} onClick={() => setMuted(engine.current?.mute() ?? false)}>{muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
        {!garage && <button title="Pause or resume" aria-label="Pause or resume" onClick={() => engine.current?.pause()}>{hud.phase === 'paused' ? <Play size={18}/> : <Pause size={18}/>}</button>}
        <button title="Fullscreen" aria-label="Fullscreen" onClick={() => { if (document.fullscreenElement) document.exitFullscreen?.(); else shell.current?.requestFullscreen?.().catch(() => {}) }}><Maximize size={18}/></button>
      </div></div>
      {garage ? <>
        <div className="race-car-title"><small>{cars[selected].cls} / {cars[selected].rating} OVR</small><h3>{cars[selected].name}</h3><span>COASTAL CIRCUIT / GRAND PRIX</span></div>
        <div className="race-garage-bottom"><div className="race-car-list" aria-label="Select your car">{cars.map((car,i) => <button key={car.name} disabled={!ready} aria-pressed={selected === i} onClick={() => { setSelected(i); engine.current?.select(i) }} style={{ '--paint': car.color }}><CarArt car={car}/><strong>{car.name}</strong><small>{car.cls}</small></button>)}</div>
        <div className="race-launch"><div className="race-specs">{['Speed','Acceleration','Handling'].map((s,i) => <label key={s}>{s}<meter min="0" max="100" value={cars[selected].stats[i]}/></label>)}</div><button className="race-primary" disabled={!ready} onClick={start}><Play size={18}/>{ready ? 'Start race' : 'Loading circuit'}</button></div></div>
      </> : <>
        <div className="race-standing"><small>POSITION</small><strong>{hud.position}<span> / 8</span></strong><p>LAP {hud.lap} / 3</p><time>{formatTime(hud.time)}</time></div>
        <div className="race-speed"><strong>{hud.speed}</strong><span>KM/H</span><div><Zap size={15}/><meter aria-label="Boost remaining" min="0" max="100" value={hud.boost}/></div></div>
        {hud.phase === 'countdown' && <div className="race-countdown">{hud.countdown || 'GO'}</div>}
        {(hud.phase === 'paused' || hud.phase === 'finished') && <div className="race-overlay"><small>COASTAL CIRCUIT</small><h3>{hud.phase === 'finished' ? 'P' + hud.position + ' / Finish' : 'Race paused'}</h3>{hud.phase === 'finished' && <p>{cars[selected].name} / {formatTime(hud.time)}</p>}<div>{hud.phase === 'paused' && <button className="race-primary" onClick={() => { engine.current?.pause(); shell.current?.focus() }}><Play size={18}/>Resume</button>}<button onClick={start}><RotateCcw size={18}/>Race again</button><button onClick={() => engine.current?.garage()}><ArrowLeft size={18}/>Garage</button></div></div>}
        {hud.phase === 'racing' && <div className="race-touch"><div><button aria-label="Steer left" {...touch('ArrowLeft')}><ArrowLeft/></button><button aria-label="Steer right" {...touch('ArrowRight')}><ArrowRight/></button></div><div><button aria-label="Brake" {...touch('ArrowDown')}>Brake</button><button aria-label="Boost" {...touch('ShiftLeft')}><Zap/></button><button aria-label="Accelerate" {...touch('ArrowUp')}><ChevronUp/></button></div></div>}
      </>}
      {error && <div className="race-overlay" role="alert">{error}</div>}
    </div>
    <p className="race-credit">Vehicle: <a href="https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6" target="_blank" rel="noreferrer">Ferrari 458 Italia by vicent091036</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Adapted materials and mesh batching.</p>
  </section>
}
