const accentPreviewClass = {
  clinify: 'investigation-hero-preview--clinify',
  universityx: 'investigation-hero-preview--universityx',
  treatmentpath: 'investigation-hero-preview--treatmentpath',
}

export default function InvestigationHeroArt({
  src,
  alt,
  active = false,
  layout = 'overlay',
  artifact,
  artifactLabel,
  artifactAlt,
  accent = 'clinify',
}) {
  if (!src) return null

  const isInline = layout === 'inline'
  const hasArtifact = Boolean(artifact)
  const previewAccent = accentPreviewClass[accent] ?? accentPreviewClass.clinify

  return (
    <div
      className={`investigation-hero-art ${
        hasArtifact ? 'investigation-hero-art--composed' : 'pointer-events-none'
      } ${isInline ? 'investigation-hero-art--inline' : ''} ${active ? 'is-active' : ''}`}
      aria-hidden={hasArtifact ? undefined : true}
    >
      <div className="investigation-hero-depth">
        <img
          src={src}
          alt={alt}
          className="investigation-hero-art__img"
          loading={active ? 'eager' : 'lazy'}
          draggable={false}
        />
        <div className="investigation-hero-art__fade" />
        <div className="investigation-hero-art__fade-soft" />

        {artifact && (
          <div
            className={`investigation-hero-preview ${previewAccent}${active ? ' is-visible' : ''}`}
          >
            <div className="investigation-hero-preview__glow" />
            <div className="investigation-hero-preview__frame">
              <img
                src={artifact}
                alt={artifactAlt || artifactLabel || ''}
                className="investigation-hero-preview__img"
                loading={active ? 'eager' : 'lazy'}
                draggable={false}
              />
              {artifactLabel && (
                <span className="investigation-hero-preview__label">{artifactLabel}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
