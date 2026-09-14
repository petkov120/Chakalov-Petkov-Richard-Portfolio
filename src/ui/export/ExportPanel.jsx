import { useEffect, useRef, useState } from 'react'
import { canRecord, captureCover, convertToMp4, downloadBlob, MAX_SECONDS, prepareRecording } from './capture'
import './export.css'

export default function ExportPanel({ frameRef, project, screen, onScreenChange, onClose, isPlaying, onPlay, onPause }) {
  const [status, setStatus] = useState('idle')
  const [format, setFormat] = useState('webp')
  const [seconds, setSeconds] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [message, setMessage] = useState('')
  const [source, setSource] = useState(null)
  const [recording, setRecording] = useState(null)
  const [original, setOriginal] = useState(null)
  const sessionRef = useRef(null)
  const phaseRef = useRef('idle')
  const closeRef = useRef(null)
  const mountedRef = useRef(true)
  const conversionRef = useRef(null)
  const busy = ['preparing', 'countdown', 'recording', 'converting', 'cover'].includes(status)
  const filename = `${project.id}-${screen.id}`
  const supported = canRecord()

  function phase(value) { phaseRef.current = value; setStatus(value) }

  useEffect(() => {
    mountedRef.current = true
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const resize = () => {
      const room = window.innerWidth >= 800 ? window.innerWidth - 344 : window.innerWidth - 24
      const height = window.innerWidth >= 800 ? window.innerHeight - 48 : window.innerHeight - 330
      frameRef.current?.style.setProperty('--export-scale', Math.max(0.2, Math.min(2, room / 540, height / 675)))
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      mountedRef.current = false
      sessionRef.current?.cancel()
      conversionRef.current?.abort()
      window.removeEventListener('resize', resize)
      document.body.style.overflow = overflow
      frameRef.current?.style.removeProperty('--export-scale')
    }
  }, [frameRef])

  useEffect(() => {
    const key = (event) => {
      if (event.key !== 'Escape') return
      if (phaseRef.current === 'recording') stopRecording()
      else if (!busy) onClose()
    }
    const hidden = () => {
      if (document.hidden && phaseRef.current === 'recording') stopRecording()
    }
    document.addEventListener('keydown', key)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      document.removeEventListener('keydown', key)
      document.removeEventListener('visibilitychange', hidden)
    }
  })

  useEffect(() => {
    if (status !== 'recording') return undefined
    const start = performance.now()
    const timer = setInterval(() => {
      const elapsed = (performance.now() - start) / 1000
      setSeconds(Math.min(MAX_SECONDS, elapsed))
      if (elapsed >= MAX_SECONDS) stopRecording()
    }, 100)
    return () => clearInterval(timer)
  }, [status])

  async function saveCover() {
    onPause()
    phase('cover')
    setMessage('Rendering your cover…')
    try {
      const blob = await captureCover(frameRef.current, format)
      if (!mountedRef.current) return
      const extension = blob.type === 'image/webp' ? 'webp' : 'png'
      downloadBlob(blob, `${filename}-1080x1350.${extension}`)
      setMessage('Cover downloaded · 1080 × 1350')
    } catch (error) {
      if (mountedRef.current) setMessage(error.message)
    } finally {
      if (mountedRef.current) phase('idle')
    }
  }

  async function startRecording() {
    if (busy) return
    onPause()
    phase('preparing')
    setMessage('Select this studio tab in the sharing picker.')
    setSource(null)
    try {
      const session = await prepareRecording(frameRef.current, () => {
        if (phaseRef.current === 'recording') stopRecording()
        else if (phaseRef.current === 'countdown') cancelCountdown()
      })
      if (!mountedRef.current) { session.cancel(); return }
      sessionRef.current = session
      setSource(session.source)
      setCountdown(3)
      phase('countdown')
      setMessage('Get ready. Only the phone presentation will be saved.')
      for (let value = 3; value > 0; value -= 1) {
        setCountdown(value)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (!mountedRef.current || phaseRef.current !== 'countdown' || sessionRef.current !== session) return
      }
      setRecording(null)
      setOriginal(null)
      setSeconds(0)
      session.start()
      phase('recording')
      setMessage('Interact with the phone. Stop when your moment is finished.')
      session.result.catch((error) => {
        if (mountedRef.current && phaseRef.current === 'recording') {
          phase('idle')
          setMessage(error.message)
        }
      })
    } catch (error) {
      sessionRef.current?.cancel()
      if (!mountedRef.current) return
      phase('idle')
      setMessage(error.name === 'NotAllowedError' ? 'Sharing was cancelled. Nothing was recorded.' : error.message)
    }
  }

  function cancelCountdown() {
    sessionRef.current?.cancel()
    sessionRef.current = null
    phase('idle')
    setMessage('Recording cancelled.')
  }

  async function stopRecording() {
    if (phaseRef.current !== 'recording') return
    phase('converting')
    onPause()
    setMessage('Preparing your MP4 locally…')
    const session = sessionRef.current
    session.stop()
    try {
      const raw = await session.result
      if (!raw || !mountedRef.current) return
      setOriginal(raw)
      conversionRef.current = new AbortController()
      const mp4 = await convertToMp4(raw, conversionRef.current.signal)
      if (!mountedRef.current) return
      setRecording(mp4)
      setMessage('Ready · H.264 MP4 · 1080 × 1350 · 30 fps · silent')
      phase('ready')
    } catch (error) {
      if (!mountedRef.current) return
      phase('idle')
      setMessage(error.message)
    } finally {
      sessionRef.current = null
    }
  }

  return (
    <aside className="ui-export" aria-label="Export presentation">
      <button ref={closeRef} className="ui-export__back" type="button" disabled={busy} onClick={onClose}>← Back to studio</button>
      <div className="ui-export__heading"><span>Present your work</span><h2>Export</h2><p>{project.name} · 1080 × 1350</p></div>
      <label className="ui-export__screen">Screen
        <select value={screen.id} disabled={['preparing', 'countdown', 'converting', 'cover'].includes(status)} onChange={(event) => onScreenChange(event.target.value)}>
          {project.screens.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <button type="button" className="ui-export__sequence" disabled={busy && status !== 'recording'} onClick={onPlay}>{isPlaying ? 'Pause sequence' : 'Play sequence'}</button>
      <section className="ui-export__section">
        <h3>Cover image</h3>
        <div className="ui-export__cover">
          <select aria-label="Cover format" value={format} disabled={busy} onChange={(event) => setFormat(event.target.value)}><option value="webp">WebP</option><option value="png">PNG</option></select>
          <button type="button" disabled={busy} onClick={saveCover}>{status === 'cover' ? 'Rendering…' : 'Download cover'}</button>
        </div>
      </section>
      <section className="ui-export__section">
        <h3>Interaction video</h3>
        {status === 'recording' ? (
          <button type="button" className="ui-export__record is-recording" onClick={stopRecording}><span /> Stop · {seconds.toFixed(1)}s</button>
        ) : status === 'countdown' ? (
          <button type="button" className="ui-export__record" onClick={cancelCountdown}>Starting in {countdown} · Cancel</button>
        ) : (
          <button type="button" className="ui-export__record" disabled={busy || !supported} onClick={startRecording}><span />{status === 'preparing' ? 'Choose this tab…' : status === 'converting' ? 'Preparing MP4…' : 'Record interaction'}</button>
        )}
        <p>{supported ? 'Share this tab, then click through your flow. A 3-second countdown gives you time to get ready. Up to 30 seconds, no audio.' : 'Use desktop Chrome or Edge for video recording. You can still export covers.'}</p>
        {source && source.width < 1080 && <p className="ui-export__quality">Source: {source.width} × {source.height}, enlarged to 1080 × 1350. A larger window or higher-density display gives sharper video.</p>}
        {recording && <button type="button" className="ui-export__download" onClick={() => downloadBlob(recording, `${project.id}-interaction-1080x1350.mp4`)}>Download MP4</button>}
        {!recording && original && !busy && <button type="button" className="ui-export__download" onClick={() => downloadBlob(original, `${project.id}-original.${original.type.includes('mp4') ? 'mp4' : 'webm'}`)}>Download original recording</button>}
      </section>
      <p className="ui-export__status" role="status">{message || 'The background follows your studio theme. Your current screen and edits stay intact.'}</p>
    </aside>
  )
}
