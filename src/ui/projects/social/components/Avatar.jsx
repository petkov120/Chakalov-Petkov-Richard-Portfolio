import { avatarImages } from '../data/authors'

export default function Avatar({ tone = 'clay', initials = 'TA', className = '' }) {
  const src = avatarImages[tone]
  return (
    <span className={`x-avatar x-avatar--${tone} ${className}`}>
      {src ? <img src={src} alt="" aria-hidden="true" /> : null}
      <span className="x-avatar__fallback">{initials}</span>
    </span>
  )
}
