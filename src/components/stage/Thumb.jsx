import './thumb.css'
import VideoThumb from './VideoThumb'

/**
 * One thumbnail style for the gallery and the Work page.
 * - "window": the product, fully visible in a frame, on a gradient from the project's colour,
 *   with a second screen peeking out behind it. Nothing is cropped mid-sentence.
 * - "cover": a photograph that is meant to fill the frame.
 * - "video": a lazy preview with project-specific labels and a still-image fallback.
 */
export default function Thumb({ thumb, alt, accent, playing }) {
  if (thumb.mode === 'video') return <VideoThumb thumb={thumb} alt={alt} playing={playing}/>
  if (thumb.mode === 'cover') {
    return <span className="thumb thumb--cover"><img src={thumb.main} alt={alt} style={{ '--from': thumb.from, '--to': thumb.to }} decoding="async" draggable="false" /></span>
  }
  return (
    <span className="thumb thumb--window" style={{ '--accent': accent }}>
      {thumb.back && <img className="thumb__back" src={thumb.back} alt="" decoding="async" draggable="false" />}
      <img className="thumb__main" src={thumb.main} alt={alt} decoding="async" draggable="false" />
    </span>
  )
}
