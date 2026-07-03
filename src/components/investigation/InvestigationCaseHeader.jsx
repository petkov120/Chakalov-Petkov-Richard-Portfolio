import { AccentRule } from '../layout/SiteNav'
import { QuestionWithThesis, StakesWithAccent } from '../clinify/ClinifyTypography'
import RoleCallout from './RoleCallout'

export default function InvestigationCaseHeader({
  id,
  name,
  tags = [],
  accent = 'clinify',
  question,
  stakes,
  facts = [],
  context,
  lens,
  roleScope = [],
  validation,
}) {
  const isClinify = accent === 'clinify'

  return (
    <header
      className={`investigation-case-header pb-12 md:pb-16 mb-10 md:mb-14 border-b border-vault-rule relative overflow-hidden ${
        isClinify ? 'case-header' : ''
      }`}
    >
      {isClinify && question && (
        <div className="case-watermark display" aria-hidden>
          {question}
        </div>
      )}

      {isClinify && <div className="case-header-blur-fade" aria-hidden />}

      <div className="grid md:grid-cols-12 gap-8 md:gap-12 relative z-[2]">
        <div className="md:col-span-2 pt-1">
          <p className="dossier-rail-label mb-6">Classified</p>
          <p className="dossier-rail-id">{id}</p>
          <p className="dossier-rail-name">{name}</p>
        </div>

        <div className="md:col-span-10 space-y-7 md:space-y-8">
          {question && (
            <h1 className="dossier-display display text-3xl md:text-[2.65rem] lg:text-[2.85rem] leading-[1.06] text-balance max-w-3xl">
              {isClinify ? <QuestionWithThesis question={question} /> : question}
            </h1>
          )}

          {stakes && (
            isClinify ? (
              <StakesWithAccent
                text={stakes}
                className="dossier-lead font-serif text-xl md:text-[1.35rem] leading-snug text-pretty max-w-xl"
              />
            ) : (
              <p className="dossier-lead font-serif text-xl md:text-[1.35rem] italic leading-snug text-pretty max-w-xl">
                {stakes}
              </p>
            )
          )}

          {lens && (
            <p className="dossier-lens font-mono text-[11px] uppercase tracking-[0.14em] leading-relaxed text-pretty max-w-xl border-l-2 border-vault-rule/80 pl-4 text-vault-text">
              {lens}
            </p>
          )}

          {facts.length > 0 && (
            <dl className="case-facts-grid">
              {facts.map((fact) => (
                <div key={fact.label} className="case-facts-grid__item">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {context && (
            <RoleCallout role={context} scope={roleScope} accent={accent} />
          )}

          <AccentRule accent={accent} className="max-w-xs opacity-80" />

          {tags.length > 0 && (
            <div className="dossier-meta-row">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          {validation && (
            <p className="dossier-meta-note max-w-2xl">{validation}</p>
          )}
        </div>
      </div>
    </header>
  )
}
