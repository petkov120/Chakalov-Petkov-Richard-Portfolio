export function GlyphGradientDefs() {
  return (
    <defs>
      <linearGradient id="clinify-glyph-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#00D4FF" />
      </linearGradient>
    </defs>
  )
}

const strokeProps = {
  fill: 'none',
  stroke: 'url(#clinify-glyph-gradient)',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const accentStroke = {
  ...strokeProps,
  stroke: '#c45c4a',
}

export function AlphaPaths({ pathLength = 100 }) {
  return (
    <>
      <path
        pathLength={pathLength}
        d="M 118 248 C 118 168 168 128 218 128 C 278 128 308 168 308 218 C 308 278 258 318 198 318 C 148 318 118 288 118 248 Z"
        {...strokeProps}
      />
      <path pathLength={pathLength} d="M 198 318 L 198 368" {...accentStroke} />
    </>
  )
}

export function MeasureHandPaths({ pathLength = 100 }) {
  return (
    <>
      <path pathLength={pathLength} d="M 72 320 L 72 260 L 98 220" {...strokeProps} />
      <path pathLength={pathLength} d="M 98 220 L 118 168 L 128 148" {...strokeProps} />
      <path pathLength={pathLength} d="M 98 220 L 138 152 L 152 138" {...strokeProps} />
      <path pathLength={pathLength} d="M 72 260 Q 108 248 128 228" {...strokeProps} />
      <path pathLength={pathLength} d="M 128 228 L 168 248 L 198 268" {...accentStroke} />
    </>
  )
}

export function PointHandPaths({ pathLength = 100 }) {
  return (
    <>
      <path pathLength={pathLength} d="M 48 280 L 48 230 L 68 190" {...strokeProps} />
      <path pathLength={pathLength} d="M 68 190 L 148 168 L 228 158" {...strokeProps} />
      <path pathLength={pathLength} d="M 68 190 L 88 210 L 108 228" {...strokeProps} />
      <path pathLength={pathLength} d="M 88 210 Q 72 248 58 278" {...strokeProps} />
      <path pathLength={pathLength} d="M 228 158 L 248 154" {...accentStroke} />
    </>
  )
}

export function TickArcPaths({ pathLength = 100 }) {
  return (
    <>
      <path
        pathLength={pathLength}
        d="M 260 120 A 80 80 0 0 1 340 200"
        {...strokeProps}
        strokeWidth={1}
      />
      <path pathLength={pathLength} d="M 278 138 L 282 148" {...strokeProps} strokeWidth={0.75} />
      <path pathLength={pathLength} d="M 302 128 L 306 138" {...strokeProps} strokeWidth={0.75} />
      <path pathLength={pathLength} d="M 326 142 L 330 152" {...strokeProps} strokeWidth={0.75} />
    </>
  )
}
