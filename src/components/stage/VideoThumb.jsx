import { useEffect, useRef, useState } from 'react'
import { Play, VolumeX } from 'lucide-react'

export default function VideoThumb({ thumb, alt, playing }) {
  const root = useRef(null), video = useRef(null), progress = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const active = visible && !failed && (playing ?? (!reduced && hovered))

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 })
    observer.observe(root.current)
    const link = root.current.closest('a')
    const focus = () => setHovered(true), blur = () => setHovered(false)
    link?.addEventListener('focus', focus)
    link?.addEventListener('blur', blur)
    return () => { observer.disconnect(); media.removeEventListener('change', sync); link?.removeEventListener('focus', focus); link?.removeEventListener('blur', blur) }
  }, [])

  useEffect(() => {
    const element = video.current
    if (!active) { element.pause(); return }
    if (!element.getAttribute('src')) element.src = thumb.video
    element.play().catch(() => setLoaded(false))
    return () => element.pause()
  }, [active, thumb.video])

  useEffect(() => {
    const pause = () => {
      if (document.hidden) video.current?.pause()
      else if (active) video.current?.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', pause)
    return () => document.removeEventListener('visibilitychange', pause)
  }, [active])

  return <span className="thumb thumb--video" ref={root} data-playing={active && loaded} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
    <img className="thumb-video__poster" src={thumb.main} alt={alt} loading="lazy" decoding="async" draggable="false"/>
    <video ref={video} muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1}
      onLoadedData={() => setLoaded(true)} onError={() => { setFailed(true); setLoaded(false) }}
      onTimeUpdate={() => { const el=video.current; if(progress.current)progress.current.style.transform='scaleX('+(el.duration?el.currentTime/el.duration:0)+')' }}/>
    <span className="thumb-video__shade"/>
    <span className="thumb-video__brand">HYDRA <span>RACE</span></span>
    <span className="thumb-video__play" aria-hidden="true"><Play size={30} fill="currentColor" strokeWidth={1.5}/></span>
    <span className="thumb-video__footer" aria-hidden="true"><span><Play size={14} fill="currentColor"/>Play race</span><span>Coastal Circuit <VolumeX size={15}/></span></span>
    <span className="thumb-video__timeline" aria-hidden="true"><i ref={progress}/></span>
  </span>
}
