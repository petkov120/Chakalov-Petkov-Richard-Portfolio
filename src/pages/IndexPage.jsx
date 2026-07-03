import { useEffect, useState } from 'react'
import ClinifyExhibitStrip from '../components/clinify/ClinifyExhibitStrip'
import ClinifyHeroAnnotation from '../components/clinify/ClinifyHeroAnnotation'
import ClinifyIndexGlyph from '../components/glyphs/ClinifyIndexGlyph'
import UniversityXExhibitStrip from '../components/universityx/UniversityXExhibitStrip'
import { QuestionWithThesis, StakesWithAccent } from '../components/clinify/ClinifyTypography'
import InvestigationHeroArt from '../components/cinematic/InvestigationHeroArt'
import SiteNav from '../components/layout/SiteNav'
import { investigations } from '../data/investigations'

const accentText = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

const indexGlow = {
  clinify: 'index-glow-clinify',
  universityx: 'index-glow-universityx',
  treatmentpath: 'index-glow-treatmentpath',
}

const enterGlow = {
  clinify: 'hover:shadow-glow-clinify border-clinify/30 hover:border-clinify/60',
  universityx: 'hover:shadow-glow-universityx border-universityx/30 hover:border-universityx/60',
  treatmentpath: 'hover:shadow-glow-treatmentpath border-treatmentpath/30 hover:border-treatmentpath/60',
}

function handleHeroPreviewMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -9
  e.currentTarget.style.setProperty('--tilt-x', `${x.toFixed(2)}deg`)
  e.currentTarget.style.setProperty('--tilt-y', `${y.toFixed(2)}deg`)
}

function handleHeroPreviewLeave(e) {
  e.currentTarget.style.setProperty('--tilt-x', '0deg')
  e.currentTarget.style.setProperty('--tilt-y', '0deg')
}

export default function IndexPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const sections = document.querySelectorAll('[data-index-section]')
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index-section'))
            setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.45 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const scrollToInvestigationFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash.startsWith('inv-')) return

      const section = document.getElementById(hash)
      if (!section) return

      section.scrollIntoView({ behavior: 'auto', block: 'start' })
      const idx = Number(section.getAttribute('data-index-section'))
      if (!Number.isNaN(idx)) {
        setActiveIndex(idx)
      }
    }

    const frame = requestAnimationFrame(scrollToInvestigationFromHash)
    window.addEventListener('hashchange', scrollToInvestigationFromHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', scrollToInvestigationFromHash)
    }
  }, [])

  return (
    <main className="theme-vault index-page min-h-screen">
      <div className="relative px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
        <SiteNav theme="vault" current="investigations" />

        <div className="hidden lg:block absolute inset-y-0 right-0 w-1.5 pointer-events-none">
          <div className="sticky top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
            {investigations.map((inv, i) => (
              <a
                key={inv.id}
                href={`#inv-${inv.slug}`}
                className={`block w-1.5 rounded-full transition-all duration-500 ${
                  activeIndex === i ? 'h-10 bg-vault-text' : 'h-1.5 bg-vault-rule hover:bg-vault-muted'
                }`}
                aria-label={`Scroll to ${inv.name}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-0">
          {investigations.map((inv, i) => {
            const isDraft = inv.status === 'draft'
            const isClinify = inv.accent === 'clinify'
            const isUniversityX = inv.accent === 'universityx'
            const glowClass = isClinify ? 'clinify-warm-light' : (indexGlow[inv.accent] ?? '')
            const accentClass = accentText[inv.accent] ?? 'text-vault-text'
            const ctaClass = enterGlow[inv.accent] ?? 'border-vault-rule hover:border-vault-muted'

            return (
              <section
                key={inv.id}
                id={`inv-${inv.slug}`}
                data-index-section={i}
                data-inv-slug={inv.slug}
                data-inv-accent={inv.accent}
                className={`index-page__section relative overflow-hidden py-20 md:py-28${
                  i > 0 ? ' border-t border-vault-rule' : ''
                }${isClinify ? ' clinify-hero-section' : ''}`}
              >
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${glowClass} ${
                    activeIndex === i ? 'opacity-100' : 'opacity-30'
                  }`}
                  aria-hidden
                />
                {isClinify ? (
                  <>
                    <ClinifyIndexGlyph />
                    <div className="absolute inset-0 field-grain pointer-events-none" aria-hidden />
                  </>
                ) : (
                  <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" aria-hidden />
                )}

                <div className="relative">
                  <div
                    className={`index-hero-compose index-hero-compose--artifact index-hero-compose--${inv.accent}`}
                    onMouseMove={inv.heroArtifact ? handleHeroPreviewMove : undefined}
                    onMouseLeave={inv.heroArtifact ? handleHeroPreviewLeave : undefined}
                  >
                    {isClinify && <ClinifyHeroAnnotation />}
                    <div className="index-hero-compose__art">
                      <InvestigationHeroArt
                        src={inv.heroImage}
                        alt={`${inv.name}, investigation metaphor`}
                        active={activeIndex === i}
                        layout="inline"
                        artifact={inv.heroArtifact}
                        artifactLabel={inv.heroArtifactLabel}
                        artifactAlt={`${inv.name}, product artifact`}
                        accent={inv.accent}
                      />
                    </div>
                    <div className="index-hero-compose__text">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className={`font-mono text-xs ${accentClass} tracking-widest`}>
                          {inv.id}
                        </div>
                        {isDraft && (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-vault-muted border border-vault-rule rounded-full px-2.5 py-0.5 sr-only">
                            In progress
                          </span>
                        )}
                      </div>

                      <h1 className="display text-4xl md:text-5xl lg:text-[3.25rem] leading-[0.98] text-balance mb-8 md:mb-10">
                        {isClinify ? (
                          <QuestionWithThesis question={inv.question} />
                        ) : (
                          inv.question
                        )}
                      </h1>

                  {isClinify ? (
                    <StakesWithAccent
                      text={inv.stakes}
                      className="font-serif text-lg md:text-xl text-vault-text/95 leading-snug max-w-xl text-pretty mb-6 md:mb-8"
                    />
                  ) : (
                    <p className="font-serif text-lg md:text-xl italic text-vault-text/95 leading-snug max-w-xl text-pretty mb-6 md:mb-8">
                      {inv.stakes}
                    </p>
                  )}

                  {inv.lens && (
                    <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.14em] text-vault-text leading-relaxed max-w-xl text-pretty mb-10 md:mb-12 border-l border-vault-rule pl-4">
                      {inv.lens}
                    </p>
                  )}

                  {!inv.lens && <div className="mb-10 md:mb-12" />}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <a
                          href={inv.href}
                          className={`group inline-flex items-center gap-3 font-mono text-sm border rounded-full px-6 py-3 transition-all duration-300 ${ctaClass}`}
                        >
                          {isDraft ? 'Preview investigation' : 'Enter investigation'}
                          <span className="group-hover:translate-x-1 transition-transform" aria-hidden>
                            →
                          </span>
                        </a>
                        <span className="font-mono text-xs text-vault-muted">{inv.name}</span>
                      </div>
                    </div>
                  </div>

                  {isDraft && (
                    <div
                      className={`index-draft-modal index-draft-modal--${inv.accent}`}
                      role="status"
                      aria-label={`${inv.name} investigation in progress`}
                    >
                      <div className="index-draft-modal__backdrop" aria-hidden />
                      <div className="index-draft-modal__panel">
                        <p className="index-draft-modal__eyebrow">Case file</p>
                        <p className="index-draft-modal__title">In progress</p>
                        <p className="index-draft-modal__copy">
                          This investigation is still being assembled. Preview what exists so far.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {isClinify && (
                  <div className="relative mt-4 md:mt-6">
                    <ClinifyExhibitStrip />
                  </div>
                )}
                {isUniversityX && (
                  <div className="relative mt-4 md:mt-6">
                    <UniversityXExhibitStrip />
                  </div>
                )}
              </section>
            )
          })}

          <section className="border-t border-vault-rule pt-16 md:pt-24">
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-7">
                <a
                  href="mailto:petkovrichard8@gmail.com"
                  className="display text-3xl md:text-4xl italic text-vault-text hover:text-white transition-colors"
                >
                  petkovrichard8@gmail.com
                </a>
              </div>
              <div className="md:col-span-5 md:text-right font-mono text-sm text-vault-muted space-y-1">
                <div className="text-vault-text">Lagos · open globally</div>
                <a
                  href="https://github.com/petkov120"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block hover:text-vault-text transition-colors"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
            <p className="mt-12 font-mono text-xs text-vault-muted/50">© 2026 Petkov Chakalov</p>
          </section>
        </div>
      </div>
    </main>
  )
}
