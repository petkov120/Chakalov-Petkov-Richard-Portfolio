import { useState } from 'react'
import EvidenceLightbox from './EvidenceLightbox'
import SlackThread from './SlackThread'

const typeLabels = {
  deck: 'DECK',
  wireframe: 'WIREFRAME',
  diagram: 'DIAGRAM',
  shipped: 'SHIPPED',
  sketch: 'SKETCH',
  note: 'NOTE',
  slack: 'SLACK',
  whiteboard: 'WHITEBOARD',
  research: 'RESEARCH',
  killed: 'KILLED',
  zoom: 'ZOOM',
}

const aspectClasses = {
  slide: 'aspect-video',
  video: 'aspect-video',
  fourThree: 'aspect-[4/3]',
  square: 'aspect-square',
  tall: 'aspect-[3/4]',
}

const frameStyles = {
  deck: 'border border-rule bg-white shadow-evidence',
  wireframe: 'border border-dashed border-muted/50 bg-placeholder/60',
  diagram: 'border border-rule bg-paper dot-grid-paper',
  shipped: 'border border-[#cfcbc4] bg-white shadow-evidence',
  sketch: 'border border-dashed border-muted/40 bg-placeholder/30',
  note: 'border border-rule bg-white/80',
  slack: 'overflow-hidden bg-[#ffffff] border border-[#e8e8e8]',
  whiteboard: 'border border-rule bg-white shadow-evidence',
  research: 'border border-rule bg-placeholder/50',
  killed: 'border border-dashed border-muted/60 bg-muted/5 opacity-90',
  zoom: 'border border-rule bg-white shadow-evidence',
}

function PlaceholderVisual({ type }) {
  switch (type) {
    case 'wireframe':
      return (
        <div className="w-3/4 space-y-2 opacity-30">
          <div className="h-2 bg-muted rounded-sm w-full" />
          <div className="h-2 bg-muted rounded-sm w-5/6" />
          <div className="h-16 bg-muted/50 rounded-sm w-full mt-3" />
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-muted rounded-sm w-20" />
            <div className="h-6 bg-muted/50 rounded-sm w-20" />
          </div>
        </div>
      )
    case 'deck':
    case 'zoom':
      return (
        <div className="w-3/4 aspect-video bg-muted/20 rounded border border-muted/30 flex items-center justify-center">
          <span className="font-serif italic text-lg text-muted/50">
            {type === 'zoom' ? 'Workshop' : 'Slide'}
          </span>
        </div>
      )
    case 'diagram':
      return (
        <div className="w-3/4 flex items-center gap-3 opacity-40">
          <div className="h-3 w-3 rounded-full bg-clinify shrink-0" />
          <div className="h-px flex-1 bg-muted" />
          <div className="h-3 w-3 rounded-full bg-muted shrink-0" />
          <div className="h-px flex-1 bg-muted" />
          <div className="h-3 w-3 rounded-full bg-muted shrink-0" />
        </div>
      )
    case 'sketch':
    case 'whiteboard':
      return (
        <div className="w-3/4 h-24 border border-muted/30 rounded opacity-30 relative">
          <div className="absolute inset-3 border border-dashed border-muted/50 rounded-sm" />
          {type === 'whiteboard' && (
            <div className="absolute bottom-4 left-6 right-6 h-px bg-muted/40" />
          )}
        </div>
      )
    case 'slack':
      return (
        <div className="w-3/4 space-y-2 p-3">
          <div className="h-8 rounded bg-white/10 w-full" />
          <div className="h-8 rounded bg-white/5 w-4/5 ml-4" />
          <div className="h-8 rounded bg-white/10 w-full" />
        </div>
      )
    case 'research':
      return (
        <div className="w-3/4 space-y-2 opacity-40 px-2">
          <div className="h-1.5 bg-muted rounded w-full" />
          <div className="h-1.5 bg-muted rounded w-full" />
          <div className="h-1.5 bg-muted rounded w-[92%]" />
          <div className="h-1.5 bg-muted rounded w-full" />
          <div className="h-1.5 bg-muted rounded w-3/4" />
        </div>
      )
    case 'killed':
      return (
        <div className="w-3/4 flex flex-col items-center gap-2 opacity-35">
          <div className="w-full h-20 border border-dashed border-muted rounded relative">
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted rotate-[-8deg]">
              Killed
            </div>
          </div>
        </div>
      )
    case 'note':
      return (
        <p className="font-serif italic text-base text-muted/60 text-center max-w-xs px-4">
          Your note here
        </p>
      )
    default:
      return (
        <div className="w-3/4 space-y-2 opacity-25">
          <div className="h-3 bg-muted rounded-sm w-1/3" />
          <div className="h-24 bg-muted/40 rounded-sm w-full" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 bg-muted/30 rounded-sm" />
            <div className="h-8 bg-muted/30 rounded-sm" />
            <div className="h-8 bg-muted/30 rounded-sm" />
          </div>
        </div>
      )
  }
}

function ExpandHint({ hasTour, expandHint }) {
  return (
    <p className="evidence-expand-hint mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#616061]">
      {hasTour ? (
        <>
          <span className="md:hidden">Tap image for guided tour</span>
          <span className="hidden md:inline">Click image for guided tour</span>
        </>
      ) : expandHint ? (
        <>
          <span className="md:hidden">{expandHint}</span>
          <span className="hidden md:inline">
            {expandHint.replace(/^Tap to /i, 'Click to ').replace(/^Tap /i, 'Click ')}
          </span>
        </>
      ) : (
        <>
          <span className="md:hidden">Tap image to expand</span>
          <span className="hidden md:inline">Click image to expand</span>
        </>
      )}
    </p>
  )
}

export default function EvidenceFrame({
  type = 'shipped',
  figure,
  date,
  caption,
  aspect = 'video',
  placeholderLabel,
  src,
  alt,
  expandable = true,
  annotations,
  accent = 'clinify',
  expandHint,
  slackThread,
  exhibit = false,
  onLightSurface = false,
  variant = 'default',
  hideCaption = false,
  speechBubble,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const label = typeLabels[type] ?? type.toUpperCase()
  const aspectClass = aspectClasses[aspect] ?? aspectClasses.video
  const frameClass = frameStyles[type] ?? frameStyles.shipped
  const isDark = type === 'slack'
  const imageAlt = alt ?? caption ?? `${label} evidence`
  const canExpand = Boolean(src && expandable)
  const hasTour = Boolean(annotations?.length)
  const isStage = variant === 'stage'
  const isViewport = variant === 'viewport'
  const paddedImage =
    !isStage &&
    !isViewport &&
    (exhibit || type === 'shipped' || type === 'deck' || type === 'zoom')

  const imageClassName = [
    'block w-full h-auto',
    isStage ? 'evidence-frame__img--stage object-contain mx-auto' : '',
    isViewport ? 'evidence-frame__img--viewport object-contain mx-auto' : '',
    paddedImage ? 'object-contain mx-auto max-w-[960px]' : '',
    paddedImage ? (exhibit ? 'p-6 md:p-8' : 'p-3 md:p-4') : '',
    isStage || isViewport ? 'bg-white' : '',
    type === 'deck' || type === 'zoom' || (type === 'killed' && aspect === 'slide')
      ? 'bg-white'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  const figureClassName = [
    'group scroll-mt-28',
    exhibit ? 'evidence-frame--exhibit' : '',
    type === 'slack' ? 'slack-exhibit-figure' : '',
    isStage ? 'evidence-frame--stage' : '',
    isViewport ? 'evidence-frame--viewport' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const captionInk = onLightSurface || type === 'slack' || exhibit
  const figcaptionMuted = captionInk ? 'text-[#4f4d49]' : 'text-muted'
  const figcaptionInk = captionInk ? 'text-[#1D1C1D]' : 'text-ink'
  const hasSpeechBubble = Boolean(speechBubble?.text)
  const speechBubbleStyle = hasSpeechBubble
    ? {
        left: `${speechBubble.x ?? 8}%`,
        top: `${speechBubble.y ?? 10}%`,
      }
    : undefined

  return (
    <figure
      className={figureClassName}
      id={figure ? `fig-${String(figure).replace(/\./g, '-')}` : undefined}
    >
      <div
        className={`${isStage || isViewport ? 'evidence-frame__stage-shell' : 'rounded-lg overflow-hidden'} ${!isStage && !isViewport ? frameClass : ''} ${type === 'slack' ? 'border-0 shadow-none' : ''} ${isStage || isViewport ? 'border border-[#cfcbc4]/80 bg-white shadow-evidence overflow-hidden rounded-lg' : ''}`}
      >
        {slackThread ? (
          <SlackThread {...slackThread} />
        ) : src ? (
          canExpand ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative block w-full cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clinify"
              aria-label={`Expand Fig. ${figure ?? ''}${caption ? `: ${caption}` : ''}`}
            >
              <img
                src={src}
                alt={imageAlt}
                className={imageClassName}
                loading="lazy"
                decoding="async"
              />
              {hasSpeechBubble && (
                <span
                  className="pointer-events-none absolute z-10 max-w-[72%] rounded-2xl border border-white/80 bg-white/95 px-3 py-2 font-mono text-[10px] leading-snug text-[#1D1C1D] shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:text-xs"
                  style={speechBubbleStyle}
                >
                  {speechBubble.text}
                  <span
                    className="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 border-r border-b border-white/80 bg-white/95"
                    aria-hidden
                  />
                </span>
              )}
            </button>
          ) : (
            <div className="relative">
              <img
                src={src}
                alt={imageAlt}
                className={imageClassName}
                loading="lazy"
                decoding="async"
              />
              {hasSpeechBubble && (
                <span
                  className="pointer-events-none absolute z-10 max-w-[72%] rounded-2xl border border-white/80 bg-white/95 px-3 py-2 font-mono text-[10px] leading-snug text-[#1D1C1D] shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:text-xs"
                  style={speechBubbleStyle}
                >
                  {speechBubble.text}
                  <span
                    className="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 border-r border-b border-white/80 bg-white/95"
                    aria-hidden
                  />
                </span>
              )}
            </div>
          )
        ) : (
          <div
            className={`${aspectClass} flex flex-col items-center justify-center gap-2 px-6 ${isDark ? 'text-vault-muted' : ''}`}
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-vault-muted/70' : 'text-muted/70'}`}
            >
              {placeholderLabel ?? `${label} PLACEHOLDER`}
            </span>
            <PlaceholderVisual type={type} />
          </div>
        )}
      </div>

      {!hideCaption && (
        <figcaption
          className={`evidence-figcaption mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between ${
            isStage || isViewport ? 'max-w-canvas mx-auto px-2' : ''
          }`}
        >
          <span className={`evidence-figcaption__main font-mono text-[12px] leading-relaxed ${figcaptionInk}`}>
            Fig. {figure}
            {caption && (
              <span className={`evidence-figcaption__caption block sm:inline font-normal ${figcaptionMuted}`}>
                . {caption}
              </span>
            )}
          </span>
          <span
            className={`evidence-figcaption__meta font-mono text-[10px] uppercase tracking-wider shrink-0 ${figcaptionMuted}`}
          >
            {label}
            {date && <> · {date}</>}
          </span>
        </figcaption>
      )}

      {canExpand && !hideCaption && (
        <ExpandHint hasTour={hasTour} expandHint={expandHint} />
      )}

      {canExpand && (
        <EvidenceLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          src={src}
          alt={imageAlt}
          figure={figure}
          caption={caption}
          annotations={annotations}
          accent={accent}
        />
      )}
    </figure>
  )
}
