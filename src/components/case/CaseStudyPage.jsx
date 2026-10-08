import SiteNav from '../layout/SiteNav'
import MindFooter from '../layout/MindFooter'
import ScrollReveal from '../motion/ScrollReveal'
import SlackThread from '../evidence/SlackThread'
import { workCases } from '../../data/mind/projects'
import '../mind/home.css'
import '../hydra/hydra.css'
import './case.css'

// Case studies in the same system as the side-project pages: the site nav, a big title,
// large framed screens with numbered captions. Content comes unchanged from the evidence files.

const EVIDENCE_TYPE = { shipped: 'Shipped', killed: 'Rejected', wireframe: 'Early wireframe', slack: 'Thread' }

function Figure({ figure, date, type, caption, src, alt, slackThread }) {
  const meta = [figure && `Fig. ${figure}`, date, EVIDENCE_TYPE[type]].filter(Boolean).join(' · ')
  return (
    <figure className="cs-figure" data-type={type}>
      {slackThread
        ? <div className="cs-figure__plate cs-figure__plate--light"><SlackThread {...slackThread} /></div>
        : <a className="cs-figure__plate" href={src} target="_blank" rel="noreferrer" aria-label={`Open full size: ${alt ?? caption}`}>
            <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
          </a>}
      {(meta || caption) && <figcaption><small>{meta}</small>{caption && <span>{caption}</span>}</figcaption>}
    </figure>
  )
}

function Spread({ spread }) {
  const { layout, kicker, headline, body, evidence = [], notes, margin, interstitial } = spread
  if (layout === 'void') return null

  if (layout === 'statement') {
    return <ScrollReveal className={`cs-statement${interstitial ? ' cs-statement--quiet' : ''}`}><p>{body}</p></ScrollReveal>
  }

  const label = layout === 'panel' ? spread.subtitle : (kicker ?? margin?.label)
  const title = layout === 'panel' ? spread.title : headline
  const items = notes ?? margin?.items

  return (
    <ScrollReveal as="section" className="cs-block">
      {label && <p className="cs-kicker">{label}</p>}
      {(title || body || items) && (
        <div className="cs-block__text">
          {title && <h3>{title}</h3>}
          {body && <p className={layout === 'full' && !evidence.length ? 'cs-lead' : undefined}>{body}</p>}
          {items && <ul className="cs-list">{items.map(item => <li key={item}>{item}</li>)}</ul>}
        </div>
      )}
      {layout === 'panel' && (
        <div className="cs-states">
          {spread.states.map(item => <span key={item.state} style={{ '--state': item.color }}>{item.state}</span>)}
          <p className="cs-flow">{spread.flow}</p>
        </div>
      )}
      {evidence.map(item => <Figure key={item.figure ?? item.src} {...item} />)}
    </ScrollReveal>
  )
}

function Section({ label, title, children, className = '' }) {
  return (
    <section className={`cs-section ${className}`}>
      <header className="cs-section__head">
        <p className="cs-kicker">{label}</p>
        {title && <h2>{title}</h2>}
      </header>
      {children}
    </section>
  )
}

export default function CaseStudyPage({ investigation, content }) {
  const card = workCases.find(item => item.id === investigation.slug)
  const { opening = {}, heroStage, screenGallery = [], cinematic, spreads = [], results, engineering, collaboration, decisions = [], notBuilt = [], closingQuote, authorNote } = content
  const dates = investigation.tags.at(-1)
  const hero = heroStage?.evidence?.[0] ?? { src: investigation.heroArtifact, alt: investigation.heroArtifactLabel, caption: investigation.heroArtifactLabel }
  const facts = (opening.facts ?? []).filter(fact => ['Role', 'Timeline', 'Team', 'Status', 'Validation', 'Adoption'].includes(fact.label))
  const next = workCases.filter(item => item.origin === 'Live Work').find(item => item.id !== investigation.slug)
  return (
    <div className="mind-site">
      <div className="mind-interior cs" data-case={investigation.slug} style={{ '--accent': card?.accent ?? '#ffe72d' }}>
        <SiteNav theme="mind" current="work" />

        <header className="hp-intro cs-intro">
          <div className="cs-intro__copy">
            <p className="mind-label">{investigation.name} / {investigation.tags[0]} / {dates}</p>
            <h1>{investigation.name}<span>.</span></h1>
            <p className="cs-question">{investigation.question}</p>
            <p className="cs-stakes">{investigation.stakes}</p>
            <dl className="cs-facts">
              {facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
          </div>
        </header>

        <main className="cs-main">
          <ScrollReveal as="figure" className="cs-hero">
            <div className="cs-figure__plate">
              <img src={hero.src} alt={hero.alt ?? ''} fetchpriority="high" />
            </div>
            {(heroStage?.headline || hero.caption) && (
              <figcaption>
                <strong>{heroStage?.headline ?? investigation.name}</strong>
                <span>{heroStage?.body ?? hero.caption}</span>
              </figcaption>
            )}
          </ScrollReveal>

          <section className="cs-section cs-brief">
            <p className="cs-kicker">My role</p>
            <div>
              <p className="cs-lead">{opening.context}</p>
              {opening.roleScope?.length > 0 && <ul className="cs-list">{opening.roleScope.map(item => <li key={item}>{item}</li>)}</ul>}
            </div>
            {opening.overview && <><p className="cs-kicker">The product</p><p>{opening.overview}</p></>}
            {opening.problem && <><p className="cs-kicker">The problem</p><p>{opening.problem}</p></>}
          </section>

          {screenGallery.length > 0 && (
            <Section label="Production interface" title="The product in use">
              <div className="hp-shots cs-shots">
                {screenGallery.map((screen, index) => (
                  <ScrollReveal as="figure" className="hp-shot" key={screen.id}>
                    <div className="cs-figure__plate"><img src={screen.src} alt={screen.alt ?? ''} loading="lazy" decoding="async" /></div>
                    <figcaption>
                      <small>{String(index + 1).padStart(2, '0')}</small>
                      <div>
                        <strong>{screen.label}</strong>
                        <p>{screen.caption?.replace(/^Fig\.\s*[\d.]+\s*—\s*/, '')}</p>
                      </div>
                    </figcaption>
                  </ScrollReveal>
                ))}
              </div>
            </Section>
          )}

          {cinematic && (
            <ScrollReveal className="cs-cinematic">
              <p className="cs-cinematic__line">{cinematic.line}</p>
              <p>{cinematic.punch}</p>
            </ScrollReveal>
          )}

          {spreads.length > 0 && (
            <Section label="From constraint to system" title="The decisions inside the interface">
              <div className="cs-story">{spreads.map(spread => <Spread key={spread.id} spread={spread} />)}</div>
            </Section>
          )}

          {results && (
            <Section label={results.label ?? 'Outcomes'} title="Evidence, not claims">
              <dl className="cs-results">
                {results.items.map(item => <div key={item.value + item.detail}><dt>{item.value}</dt><dd>{item.detail}</dd></div>)}
              </dl>
              {engineering && (
                <div className="cs-engineering">
                  <p className="cs-kicker">{engineering.label}</p>
                  <ul className="cs-list">{engineering.items.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
              )}
            </Section>
          )}

          {collaboration && (
            <Section label={collaboration.label ?? 'Collaboration'} title={collaboration.title} className="cs-collaboration">
              <p className="cs-lead">{collaboration.body}</p>
              <ul className="cs-collaboration__list">
                {collaboration.items.map(item => {
                  const [label, ...rest] = item.split(':')
                  return <li key={item}><strong>{label}</strong><span>{rest.join(':').trim()}</span></li>
                })}
              </ul>
            </Section>
          )}

          {decisions.length > 0 && (
            <Section label="Product judgment" title="Trade-offs I owned">
              <ol className="cs-decisions">
                {decisions.map((item, index) => (
                  <ScrollReveal as="li" key={item.decision}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <h3>{item.decision}</h3>
                    <dl>
                      <div><dt>Why</dt><dd>{item.why}</dd></div>
                      <div><dt>Trade-off</dt><dd>{item.tradeoff}</dd></div>
                      <div><dt>Outcome</dt><dd>{item.outcome}</dd></div>
                    </dl>
                  </ScrollReveal>
                ))}
              </ol>
            </Section>
          )}

          {notBuilt.length > 0 && (
            <Section label="Restraint" title="What I chose not to build">
              <ul className="cs-notbuilt">
                {notBuilt.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.reason}</span></li>)}
              </ul>
            </Section>
          )}

          {(closingQuote || authorNote) && (
            <ScrollReveal as="section" className="cs-closing">
              {closingQuote && <blockquote>{closingQuote}</blockquote>}
              {authorNote && (
                <div className="cs-note">
                  <p className="cs-kicker">{authorNote.kicker}</p>
                  <p>{authorNote.greeting}</p>
                  {authorNote.paragraphs.map(text => <p key={text}>{text}</p>)}
                  <p className="cs-note__sign">{authorNote.signOff}<span>{authorNote.meta}</span></p>
                </div>
              )}
            </ScrollReveal>
          )}

          {next && (
            <a className="cs-next" href={next.href}>
              <span className="cs-next__preview" aria-hidden="true"><img src={next.thumb.main} alt="" loading="lazy" decoding="async" /></span>
              <span className="cs-kicker">Next case study</span>
              <strong>{next.name}</strong>
              <span>{next.blurb}</span>
            </a>
          )}
        </main>
        <MindFooter />
      </div>
    </div>
  )
}
