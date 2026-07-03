import EvidenceFrame from './EvidenceFrame'
import DarkPanel, { StateRow } from './DarkPanel'

const accentLabel = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

const accentItemBorder = {
  clinify: 'border-clinify/55',
  universityx: 'border-universityx/55',
  treatmentpath: 'border-treatmentpath/55',
}

export default function EvidenceSpread({ spread, accent = 'clinify' }) {
  const noteRotations = [-1.2, 1.5, -0.8, 1.1]
  const {
    layout,
    margin,
    body,
    evidence,
    title,
    subtitle,
    kicker,
    headline,
    states,
    flow,
    sources,
    evidenceLayout,
    footnote,
  } = spread

  if (layout === 'slack') {
    return (
      <section className="dossier-spread dossier-spread--slack">
        {body && (
          <p className="dossier-body text-pretty max-w-prose mb-8 md:mb-10">
            {body}
          </p>
        )}
        <div className="slack-exhibit-plate -mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-4 py-6 md:px-8 md:py-8 shadow-evidence">
          {evidence?.map((item) => (
            <EvidenceFrame
              key={item.figure}
              {...item}
              accent={accent}
              onLightSurface
            />
          ))}
        </div>
      </section>
    )
  }

  if (layout === 'exhibit') {
    const labelClass = accentLabel[accent] ?? accentLabel.clinify

    return (
      <section className="dossier-spread dossier-spread--exhibit">
        <div className="evidence-exhibit__plate -mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-5 py-10 md:px-10 md:py-12 shadow-evidence text-[#1D1C1D]">
          {(kicker || headline) && (
            <header className="evidence-exhibit__header mb-8 md:mb-10 max-w-prose">
              {kicker && (
                <p className={`dossier-label mb-3 ${labelClass}`}>{kicker}</p>
              )}
              {headline && (
                <h2 className="dossier-exhibit-title display text-2xl md:text-[1.75rem] leading-tight text-balance">
                  {headline}
                </h2>
              )}
            </header>
          )}

          <div className="space-y-8">
            {evidence?.map((item) => (
              <EvidenceFrame
                key={item.figure}
                {...item}
                accent={accent}
                exhibit
                onLightSurface
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'board') {
    const labelClass = accentLabel[accent] ?? accentLabel.clinify
    const notes = spread.notes ?? []

    return (
      <section className="dossier-spread dossier-spread--board">
        <div className="evidence-board -mx-4 md:-mx-8 rounded-xl bg-[#f7f4ef] px-5 py-8 md:px-10 md:py-10 shadow-evidence">
          {(kicker || headline || body) && (
            <header className="mb-8 md:mb-10 max-w-prose">
              {kicker && <p className={`dossier-label mb-3 ${labelClass}`}>{kicker}</p>}
              {headline && (
                <h2 className="display text-2xl md:text-[1.85rem] leading-tight text-balance text-[#1a1a1a] mb-4">
                  {headline}
                </h2>
              )}
              {body && (
                <p className="dossier-body text-pretty text-[#3d3b38]">{body}</p>
              )}
            </header>
          )}

          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <aside className="md:col-span-4 space-y-4">
              {notes.map((note, i) => (
                <article
                  key={`${note.slice(0, 20)}-${i}`}
                  className="evidence-board__note"
                  style={{ '--note-rotation': `${noteRotations[i % noteRotations.length]}deg` }}
                >
                  <p>{note}</p>
                </article>
              ))}
            </aside>

            <div className="md:col-span-8 grid gap-6 md:gap-8">
              {evidence?.map((item) => (
                <EvidenceFrame key={item.figure} {...item} accent={accent} onLightSurface />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'statement') {
    const isTall = spread.tall
    const isInterstitial = spread.interstitial

    return (
      <section
        className={`dossier-spread dossier-spread--statement${
          isTall ? ' dossier-spread--statement-tall' : ''
        }${isInterstitial ? ' dossier-spread--interstitial' : ''}`}
      >
        <p
          className={`dossier-statement display leading-[1.06] text-balance max-w-4xl ${
            isInterstitial
              ? 'font-serif text-2xl md:text-3xl italic text-vault-muted'
              : 'text-4xl md:text-6xl lg:text-[3.35rem]'
          }`}
        >
          {body}
        </p>
      </section>
    )
  }

  if (layout === 'void') {
    const voidSize = spread.size ?? 'medium'

    return (
      <div
        className={`dossier-spread dossier-spread--void dossier-spread--void-${voidSize}`}
        aria-hidden="true"
      />
    )
  }

  if (layout === 'stage') {
    const labelClass = accentLabel[accent] ?? accentLabel.clinify
    const frameVariant = spread.stageVariant === 'viewport' ? 'viewport' : 'stage'
    const isHeroStage = spread.id === 'hero-stage'

    return (
      <section className={`dossier-spread dossier-spread--stage ${isHeroStage ? 'dossier-spread--hero-stage' : ''}`}>
        <div className="investigation-dossier__stage-outer">
          {(kicker || headline || body) && (
            <header className="investigation-dossier__stage-intro mb-5 md:mb-10 lg:mb-12 max-w-prose">
              {kicker && (
                <p className={`dossier-label mb-3 ${labelClass}`}>{kicker}</p>
              )}
              {headline && (
                <h2 className="dossier-display display text-2xl md:text-[1.85rem] leading-tight text-balance mb-4">
                  {headline}
                </h2>
              )}
              {body && (
                <p className="dossier-body text-pretty">{body}</p>
              )}
            </header>
          )}

          <div className="space-y-6">
            {evidence?.map((item) => (
              <EvidenceFrame
                key={item.figure}
                {...item}
                accent={accent}
                variant={item.variant ?? frameVariant}
                onLightSurface
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'margin') {
    const labelClass = accentLabel[accent] ?? accentLabel.clinify
    const itemBorderClass = accentItemBorder[accent] ?? accentItemBorder.clinify

    return (
      <section className="dossier-spread dossier-spread--margin">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-14">
          {margin && (
            <aside className="md:col-span-12 lg:col-span-4 xl:col-span-3">
              <div className="dossier-margin-card rounded-lg border border-vault-rule bg-vault/55 px-5 py-6 md:sticky md:top-24 md:px-6 md:py-7 lg:max-w-sm">
                <div className={`dossier-label mb-5 ${labelClass}`}>
                  {margin.label}
                </div>
                <ul className="space-y-4">
                  {margin.items.map((item) => (
                    <li
                      key={item}
                      className={`dossier-margin-item border-l-2 pl-4 ${itemBorderClass}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          <div
            className={`${margin ? 'md:col-span-12 lg:col-span-8 xl:col-span-9' : 'md:col-span-12'} space-y-8`}
          >
            {evidence?.map((item) => (
              <EvidenceFrame key={item.figure} {...item} />
            ))}
            {body && (
              <p className="dossier-body text-pretty max-w-prose">
                {body}
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'full') {
    const isWhiteSurface = spread.surface === 'white'

    return (
      <section
        className={`dossier-spread dossier-spread--full ${
          isWhiteSurface
            ? 'dossier-spread--surface -mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-5 py-12 md:px-10 md:py-14 shadow-evidence'
            : ''
        }`}
      >
        <div className={`${isWhiteSurface ? 'space-y-10 md:space-y-12' : 'space-y-8'}`}>
          {body && (
            <p
              className={`dossier-body text-pretty max-w-prose ${
                isWhiteSurface ? 'dossier-body--on-light' : ''
              }`}
            >
              {body}
            </p>
          )}
          {evidence?.map((item) => (
            <EvidenceFrame
              key={item.figure}
              {...item}
              accent={accent}
              onLightSurface={isWhiteSurface}
            />
          ))}
        </div>
      </section>
    )
  }

  if (layout === 'paired') {
    return (
      <section className="dossier-spread dossier-spread--paired dot-grid-paper rounded-lg px-5 md:px-10 -mx-4 md:-mx-8">
        {body && (
          <p className="dossier-body text-pretty max-w-prose mb-10">
            {body}
          </p>
        )}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {evidence?.map((item) => (
            <EvidenceFrame key={item.figure} {...item} />
          ))}
        </div>
      </section>
    )
  }

  if (layout === 'panel') {
    return (
      <section className="dossier-spread dossier-spread--panel">
        {body && (
          <p className="dossier-body text-pretty max-w-prose mb-8">
            {body}
          </p>
        )}
        <DarkPanel
          title={title}
          subtitle={subtitle}
          flow={flow}
          sources={sources}
          accent={accent}
        >
          <StateRow states={states} />
        </DarkPanel>

        {evidence?.length > 0 && (
          <div
            className={`mt-10 md:mt-12 -mx-4 md:-mx-8 rounded-xl bg-[#ffffff] px-5 py-10 md:px-10 md:py-12 shadow-evidence gap-8 md:gap-10 ${
              evidenceLayout === 'stack'
                ? 'flex flex-col'
                : 'grid md:grid-cols-2'
            }`}
          >
            {evidence.map((item) => (
              <EvidenceFrame key={item.figure} {...item} accent={accent} onLightSurface />
            ))}
          </div>
        )}

        {footnote && (
          <p className="dossier-meta-note mt-8 md:mt-10 max-w-prose border-l-2 border-vault-rule pl-4 normal-case tracking-normal text-[0.8125rem] leading-relaxed">
            {footnote}
          </p>
        )}
      </section>
    )
  }

  if (layout === 'grid') {
    return (
      <section className="dossier-spread dossier-spread--grid">
        {body && (
          <p className="dossier-body text-pretty max-w-prose mb-10">
            {body}
          </p>
        )}
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {evidence?.map((item) => (
            <EvidenceFrame key={item.figure} {...item} />
          ))}
        </div>
      </section>
    )
  }

  return null
}
