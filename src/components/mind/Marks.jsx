export function Scribble({ className = '' }) {
  return <svg className={`mind-scribble ${className}`} viewBox="0 0 240 130" fill="none" aria-hidden="true"><path d="M14 70C52 8 184 2 218 51S110 123 45 98 36 21 118 19 234 73 188 104 54 111 22 80C-1 59 63 20 153 29S215 111 103 108" stroke="currentColor" strokeWidth="1.6" /><path d="M37 96C94 125 197 116 227 68M17 68C49 27 106 19 155 23" stroke="currentColor" strokeWidth=".7" /></svg>
}
export function Annotation({ children, className = '', tone = 'yellow' }) {
  return <aside className={`mind-note mind-note--${tone} ${className}`}>{children}</aside>
}
export function Highlight({ children, className = '' }) {
  return <span className={`collage-highlight ${className}`}>{children}</span>
}
export function Contour({ className = '' }) {
  return <svg className={`mind-contour ${className}`} viewBox="0 0 260 260" aria-hidden="true" fill="none">{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="130" cy="130" rx={25 + i * 8} ry={15 + i * 9} transform={`rotate(${i * 8} 130 130)`} stroke="currentColor" strokeWidth=".65" />)}</svg>
}
