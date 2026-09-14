export default function MindPhone({ children, className = '', label, screenClassName = '', island = false }) {
  return (
    <figure className={`mind-phone ${className}`.trim()}>
      <div className="mind-phone__bezel">
        {island ? <span className="mind-phone__island" aria-hidden="true" /> : null}
        <div className={`mind-phone__screen ${screenClassName}`.trim()}>{children}</div>
      </div>
      {label ? <figcaption className="mind-label">{label}</figcaption> : null}
    </figure>
  )
}
