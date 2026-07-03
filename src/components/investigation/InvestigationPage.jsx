import InvestigationBackLink from './InvestigationBackLink'
import InvestigationCaseHeader from './InvestigationCaseHeader'
import InvestigationBrief from './InvestigationBrief'
import MarginSnake from './MarginSnake'
import TransformationStrip from '../evidence/TransformationStrip'
import EvidenceSpread from '../evidence/EvidenceSpread'
import DecisionCard from '../evidence/DecisionCard'
import NotBuiltSection from '../evidence/NotBuiltSection'
import ResultsStrip from '../evidence/ResultsStrip'
import EngineeringStrip from '../evidence/EngineeringStrip'
import CinematicBeat from '../cinematic/CinematicBeat'
import CaseClosingBeat from './CaseClosingBeat'
import ScrollReveal from '../motion/ScrollReveal'
import { roomThemes } from '../../data/investigations'

export default function InvestigationPage({ investigation, content }) {
  const {
    opening,
    heroStage,
    cinematic,
    transformation,
    spreads = [],
    decisions = [],
    engineering,
    notBuilt = [],
    results,
    validation,
    closingQuote,
    closingFigure,
    authorNote,
    authorNoteButtonLabel,
  } = content

  const roomClass = roomThemes[investigation.accent] ?? ''
  const isClinify = investigation.accent === 'clinify'
  const isUniversityX = investigation.accent === 'universityx'
  const hasClosingFigure = Boolean(closingFigure?.src)
  const hasBrief = Boolean(opening?.overview || opening?.problem)
  const showTransformation = transformation && !isClinify

  return (
    <main className={`theme-vault min-h-screen classified-dossier ${roomClass} relative`}>
      {isClinify ? (
        <>
          <div className="absolute inset-0 clinify-warm-light clinify-case-light pointer-events-none opacity-80" aria-hidden />
          <div className="absolute inset-0 field-grain pointer-events-none" aria-hidden />
        </>
      ) : isUniversityX ? (
        <>
          <div className="absolute inset-0 universityx-warm-light universityx-case-light pointer-events-none opacity-85" aria-hidden />
          <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" aria-hidden />
          <div className="absolute inset-0 field-grain opacity-[0.03] pointer-events-none" aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" aria-hidden />
      )}

      <header
        className={`investigation-nav fixed top-0 inset-x-0 z-50 border-b border-vault-rule backdrop-blur-md ${
          isClinify ? 'investigation-nav--clinify' : 'bg-vault/90'
        }`}
      >
        <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-6 py-4 md:px-12 md:py-5">
          <InvestigationBackLink
            slug={investigation.slug}
            accent={investigation.accent}
            theme="vault"
          />
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-vault-muted sm:inline">
            {investigation.id} · {investigation.name}
          </span>
        </div>
      </header>

      <div className="investigation-dossier__shell relative px-6 md:px-12 pt-[5rem] md:pt-24 pb-28 md:pb-36 max-w-wide mx-auto margin-line">
        <div className="investigation-dossier__flow relative z-[1]">
        <MarginSnake />
        <InvestigationCaseHeader
          id={investigation.id}
          name={investigation.name}
          tags={investigation.tags}
          accent={investigation.accent}
          question={investigation.question}
          stakes={investigation.stakes}
          lens={investigation.lens}
          facts={opening?.facts}
          context={opening?.context}
          roleScope={opening?.roleScope}
          validation={validation}
        />

        {hasBrief && (
          <InvestigationBrief
            overview={opening.overview}
            problem={opening.problem}
          />
        )}

        {heroStage && (
          <ScrollReveal>
            <EvidenceSpread
              spread={{ ...heroStage, layout: 'stage', id: 'hero-stage' }}
              accent={investigation.accent}
            />
          </ScrollReveal>
        )}

        {cinematic && (
          <CinematicBeat accent={investigation.accent} {...cinematic} />
        )}

        {spreads.length > 0 && (
          <section className="investigation-dossier__chapter investigation-dossier__chapter--cinematic">
            <div
              className={`investigation-dossier__spreads${
                isClinify ? ' investigation-dossier__spreads--cinematic' : ''
              }`}
            >
              {spreads.map((spread, i) => (
                <ScrollReveal key={spread.id ?? i} delay={i * 60}>
                  <EvidenceSpread
                    spread={spread}
                    accent={investigation.accent}
                  />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {showTransformation && (
          <div className="investigation-dossier__chapter">
          <ScrollReveal>
            <TransformationStrip
              label={transformation.label}
              summary={transformation.summary}
              shippedNote={transformation.shippedNote}
              alignmentNote={transformation.alignmentNote}
              steps={transformation.steps}
              milestones={transformation.milestones}
              accent={investigation.accent}
            />
          </ScrollReveal>
          </div>
        )}

        {(results || engineering) && (
          <section className="investigation-dossier__chapter investigation-dossier__chapter--outcomes">
            {results && (
              <ScrollReveal>
                <ResultsStrip results={results} accent={investigation.accent} />
              </ScrollReveal>
            )}
            {engineering && (
              <ScrollReveal>
                <EngineeringStrip engineering={engineering} accent={investigation.accent} />
              </ScrollReveal>
            )}
          </section>
        )}

        {decisions.length > 0 && (
          <section className="investigation-dossier__chapter investigation-dossier__chapter--decisions">
            <ScrollReveal>
              <div className="dossier-section-kicker investigation-dossier__chapter-label">
                Decisions
              </div>
            </ScrollReveal>
            <div className="space-y-8 md:space-y-10">
            {decisions.map((d, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <DecisionCard {...d} index={i + 1} accent={investigation.accent} />
              </ScrollReveal>
            ))}
            </div>
          </section>
        )}

        <section className="investigation-dossier__chapter investigation-dossier__chapter--closing">
          <ScrollReveal>
            <NotBuiltSection items={notBuilt} />
          </ScrollReveal>
          <ScrollReveal>
            <CaseClosingBeat
              accent={investigation.accent}
              showFigure={isClinify || hasClosingFigure}
              closingText={closingQuote}
              closingFigure={closingFigure}
              note={authorNote}
              noteButtonLabel={authorNoteButtonLabel}
            />
          </ScrollReveal>
        </section>

        <footer className="investigation-dossier__footer dossier-meta-note pt-14 md:pt-16 border-t border-vault-rule mt-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <span>
              {investigation.id} · {investigation.name} · End of file
            </span>
          </div>
        </footer>
        </div>
      </div>
    </main>
  )
}
