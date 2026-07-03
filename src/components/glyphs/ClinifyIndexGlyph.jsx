import { AlphaPaths, GlyphGradientDefs, MeasureHandPaths } from './glyphPaths'

export default function ClinifyIndexGlyph() {
  return (
    <svg
      className="investigation-glyph investigation-glyph--index"
      viewBox="0 0 400 400"
      aria-hidden
    >
      <GlyphGradientDefs />
      <g className="investigation-glyph__ghost">
        <AlphaPaths />
        <MeasureHandPaths />
      </g>
    </svg>
  )
}
