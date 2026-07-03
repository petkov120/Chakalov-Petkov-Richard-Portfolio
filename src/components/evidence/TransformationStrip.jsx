import { useState } from 'react'
import EvidenceFrame from './EvidenceFrame'
import EvidenceLightbox from './EvidenceLightbox'

const accentPhaseColor = {
  clinify: '#3B82F6',
  universityx: '#E07A5F',
  treatmentpath: '#5C7A6B',
}

const accentHighlightRing = {
  clinify: 'ring-clinify/45 shadow-glow-clinify',
  universityx: 'ring-universityx/45 shadow-glow-universityx',
  treatmentpath: 'ring-treatmentpath/45',
}

const accentBadgeBg = {
  clinify: 'bg-clinify',
  universityx: 'bg-universityx',
  treatmentpath: 'bg-treatmentpath',
}

const accentText = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

function AlignmentDeckCard({ step, onSelect }) {
  const hasImage = Boolean(step.src)

  return (
    <button
      type="button"
      onClick={() => onSelect(step)}
      className="group w-[min(88vw,340px)] shrink-0 snap-center cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clinify md:w-[360px]"
      aria-label={`View Fig. ${step.figure}${step.caption ? `: ${step.caption}` : ''}`}
    >
      <div className="relative overflow-hidden rounded-lg border border-rule bg-white shadow-evidence transition-colors group-hover:border-muted/50">
        {hasImage ? (
          <img
            src={step.src}
            alt=""
            className="block aspect-video w-full object-contain bg-white p-1.5"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-placeholder/40 font-mono text-xs uppercase tracking-wider text-muted/60">
            {step.type ?? 'deck'}
          </div>
        )}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-12 font-mono text-[11px] uppercase tracking-wider text-white"
          aria-hidden="true"
        >
          <span className="md:hidden">Tap to view deck</span>
          <span className="hidden md:inline">Click to view deck</span>
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="font-mono text-xs uppercase tracking-wider text-ink">
          Fig. {step.figure}
        </p>
        {step.caption && (
          <p className="text-sm leading-snug text-muted line-clamp-2 text-pretty">
            {step.caption}
          </p>
        )}
      </div>
    </button>
  )
}

function TransformMiddleThumb({ step, onSelect }) {
  const hasImage = Boolean(step.src)

  return (
    <button
      type="button"
      onClick={() => onSelect(step)}
      className="group flex w-[4.5rem] shrink-0 flex-col gap-1.5 text-left md:w-20"
      aria-label={`View Fig. ${step.figure}${step.caption ? `: ${step.caption}` : ''}`}
    >
      <div className="overflow-hidden rounded border border-rule bg-white/90 transition-colors group-hover:border-muted/60">
        {hasImage ? (
          <img
            src={step.src}
            alt=""
            className="block aspect-video w-full object-contain bg-white p-0.5"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-placeholder/40 font-mono text-[9px] uppercase tracking-wider text-muted/60">
            {step.type ?? 'fig'}
          </div>
        )}
      </div>
      <span className="font-mono text-[9px] uppercase tracking-wider text-muted group-hover:text-ink">
        Fig. {step.figure}
      </span>
    </button>
  )
}

function EvolutionArrow({ className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-mono text-2xl text-muted/35 md:text-3xl ${className}`}
      aria-hidden
    >
      →
    </div>
  )
}

function MilestoneColumn({ milestone, accent, highlight = false }) {
  const highlightRing = accentHighlightRing[accent] ?? accentHighlightRing.clinify
  const badgeBg = accentBadgeBg[accent] ?? accentBadgeBg.clinify
  const hasTour = Boolean(milestone.annotations?.length)

  const frame = (
    <EvidenceFrame
      {...milestone}
      accent={accent}
      expandable={milestone.expandable !== false}
      expandHint={
        hasTour ? undefined : milestone.expandHint ?? 'See this stage in detail'
      }
    />
  )

  return (
    <div className="min-w-0">
      <PhaseLabel accent={accent} shipped={highlight}>
        {milestone.phaseLabel ?? (highlight ? 'Production today' : 'First ship')}
      </PhaseLabel>
      {milestone.evolvedNote && (
        <p className="mb-4 text-base leading-relaxed text-pretty text-muted md:text-lg">
          {milestone.evolvedNote}
        </p>
      )}
      {highlight ? (
        <div className={`relative rounded-lg ring-2 ring-offset-2 ring-offset-vault ${highlightRing}`}>
          <span
            className={`absolute -top-2.5 right-3 z-10 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white ${badgeBg}`}
          >
            Today
          </span>
          {frame}
        </div>
      ) : (
        <div className="relative rounded-lg border border-rule">
          <span className="absolute -top-2.5 right-3 z-10 rounded border border-rule bg-vault/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
            First ship
          </span>
          {frame}
        </div>
      )}
    </div>
  )
}

export default function TransformationStrip({
  label,
  summary,
  shippedNote,
  alignmentNote,
  steps = [],
  milestones = [],
  accent = 'clinify',
}) {
  const [lightboxStep, setLightboxStep] = useState(null)

  if (!steps.length) return null

  const phaseColor = accentPhaseColor[accent] ?? accentPhaseColor.clinify
  const highlightRing = accentHighlightRing[accent] ?? accentHighlightRing.clinify
  const badgeBg = accentBadgeBg[accent] ?? accentBadgeBg.clinify
  const hasMilestones = milestones.length >= 2

  if (steps.length === 1 && !hasMilestones) {
    return (
      <section className="relative -mx-6 overflow-hidden border-b border-t border-rule px-6 py-16 md:-mx-12 md:px-12 md:py-24">
        <div className="relative mx-auto max-w-wide">
          <StripHeader label={label} summary={summary} />
          <EvidenceFrame {...steps[0]} accent={accent} />
        </div>
      </section>
    )
  }

  const before = steps[0]
  const middle = hasMilestones ? steps.slice(1) : steps.slice(1, -1)
  const after = hasMilestones ? null : steps[steps.length - 1]
  const followUpDecks = hasMilestones ? steps.slice(1) : []
  const middleCountLabel =
    middle.length === 1 ? '1 iteration' : `${middle.length} steps between`
  const evolvedNote = after?.evolvedNote ?? shippedNote

  return (
    <section className="relative -mx-6 overflow-hidden border-b border-t border-rule px-6 py-16 md:-mx-12 md:px-12 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${phaseColor}22, transparent 60%)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-wide">
        <StripHeader label={label} summary={summary} />

        {hasMilestones ? (
          <div className="rounded-lg border border-rule bg-vault/20 px-4 py-6 md:px-7 md:py-8">
            <PhaseLabel>Act I · Alignment on slides</PhaseLabel>
            <p className="mb-8 max-w-prose text-base leading-relaxed text-pretty text-muted md:text-lg">
              {alignmentNote ??
                before.phaseNote ??
                'Stakeholders aligned on workflows in PowerPoint before a single production pixel shipped.'}
            </p>

            <div className="mb-10">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                Fig. {before.figure} · Where it started
              </p>
              <EvidenceFrame
                {...before}
                accent={accent}
                expandHint="View full deck"
              />
            </div>

            {followUpDecks.length > 0 && (
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">
                  +{followUpDecks.length} alignment decks · swipe to browse
                </p>
                <div className="relative -mx-1">
                  <div className="flex gap-5 overflow-x-auto px-1 pb-3 snap-x snap-mandatory no-scrollbar">
                    {followUpDecks.map((step) => (
                      <AlignmentDeckCard
                        key={step.figure}
                        step={step}
                        onSelect={setLightboxStep}
                      />
                    ))}
                  </div>
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-vault/90 to-transparent md:w-16"
                    aria-hidden
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-10">
          <div className="min-w-0">
            <PhaseLabel>Where it started</PhaseLabel>
            <p className="mb-3 text-sm leading-relaxed text-pretty text-muted">
              {before.phaseNote ?? 'Alignment deck. Stakeholders, structure, workflows on slides.'}
            </p>
            <EvidenceFrame {...before} expandable={false} accent={accent} />
          </div>

          {middle.length > 0 && (
            <div className="flex flex-col items-center gap-3 px-2 lg:max-w-[11rem]">
              <div className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70 lg:block">
                Evolved through
              </div>
              <div className="hidden font-mono text-2xl text-muted/35 lg:block" aria-hidden>
                →
              </div>
              <p className="max-w-[12rem] text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider text-muted">
                {middleCountLabel}
              </p>
              <div className="flex flex-wrap items-start justify-center gap-2 lg:flex-col lg:items-center">
                {middle.map((step) => (
                  <TransformMiddleThumb
                    key={step.figure}
                    step={step}
                    onSelect={setLightboxStep}
                  />
                ))}
              </div>
            </div>
          )}

          {!hasMilestones && (
            <div className="min-w-0 lg:col-start-3">
              <PhaseLabel accent={accent} shipped>
                Evolved into product
              </PhaseLabel>
              {evolvedNote && (
                <p className="mb-3 text-sm leading-relaxed text-pretty text-muted">
                  {evolvedNote}
                </p>
              )}
              <div className={`relative rounded-lg ring-2 ring-offset-2 ring-offset-vault ${highlightRing}`}>
                <span
                  className={`absolute -top-2.5 right-3 z-10 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white ${badgeBg}`}
                >
                  Shipped
                </span>
                <EvidenceFrame
                  {...after}
                  accent={accent}
                  expandHint={
                    after.annotations?.length ? undefined : 'See how the deck became product'
                  }
                />
              </div>
            </div>
          )}
        </div>
        )}

        {hasMilestones && (
          <div className="mt-12 md:mt-16 border-t border-rule pt-10 md:pt-12">
            <div className="mb-8">
              <PhaseLabel accent={accent} shipped>
                Act II · Progressive evolution in production
              </PhaseLabel>
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-pretty text-muted">
                {shippedNote ??
                  'Each stage named what it was, from first shipped screen to what care managers use today.'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.figure} className="contents">
                  {index > 0 && (
                    <EvolutionArrow className="hidden md:flex md:pt-24" />
                  )}
                  {index > 0 && (
                    <EvolutionArrow className="flex rotate-90 md:hidden md:pt-0" />
                  )}
                  <MilestoneColumn
                    milestone={milestone}
                    accent={accent}
                    highlight={index === milestones.length - 1}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxStep?.src && (
        <EvidenceLightbox
          open
          onClose={() => setLightboxStep(null)}
          src={lightboxStep.src}
          alt={lightboxStep.alt ?? lightboxStep.caption}
          figure={lightboxStep.figure}
          caption={lightboxStep.caption}
          annotations={lightboxStep.annotations}
          accent={accent}
        />
      )}
    </section>
  )
}

function StripHeader({ label, summary }) {
  return (
    <div className="mb-10 md:mb-12">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Evolution
      </div>
      <div className="display text-2xl text-balance md:text-3xl">{label ?? 'PowerPoint becomes product'}</div>
      {summary && (
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-pretty text-muted md:text-base">
          {summary}
        </p>
      )}
    </div>
  )
}

function PhaseLabel({ children, shipped = false, accent = 'clinify' }) {
  return (
    <div
      className={`mb-2 font-mono text-xs uppercase tracking-[0.12em] ${
        shipped ? accentText[accent] ?? 'text-ink' : 'text-muted'
      }`}
    >
      {children}
    </div>
  )
}
