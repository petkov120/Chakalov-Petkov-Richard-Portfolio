import { useEffect, useState } from 'react'
import SiteNav, { AccentRule } from '../layout/SiteNav'
import InvestigationBackLink from './InvestigationBackLink'

const accentText = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

const roomAtmosphere = {
  clinify: 'room-opening-clinify',
  universityx: 'room-opening-universityx',
  treatmentpath: 'room-opening-treatmentpath',
}

export default function InvestigationOpening({
  id,
  slug,
  name,
  question,
  tags = [],
  accent = 'clinify',
  stakes,
  context,
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const navTheme = accent === 'clinify' ? 'vault' : 'paper'

  return (
    <>
      <SiteNav theme={navTheme} investigationsHref="/#works" />

      <InvestigationBackLink slug={slug} accent={accent} theme={navTheme} href="/#works" />

      <section
        className={`min-h-[92vh] flex flex-col justify-center pb-16 md:pb-24 relative overflow-hidden ${roomAtmosphere[accent]}`}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {accent === 'clinify' && (
            <>
              <div className="absolute inset-0 cinematic-glow-clinify opacity-80" />
              <div className="absolute inset-0 dot-grid opacity-20" />
            </>
          )}
          {accent === 'universityx' && (
            <div className="absolute inset-0 cinematic-glow-universityx" />
          )}
          {accent === 'treatmentpath' && (
            <div className="absolute inset-0 cinematic-glow-treatmentpath" />
          )}
        </div>

        <div
          className={`relative transition-all duration-1000 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <div className={`font-mono text-xs ${accentText[accent]} mb-2`}>{id}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {name}
              </div>
            </div>

            <div className="md:col-span-10 space-y-8 md:space-y-10">
              <h1 className="display text-[10vw] md:text-[6vw] lg:text-[5vw] leading-[0.98] text-balance">
                {question}
              </h1>

              {stakes && (
                <p className="font-serif text-2xl md:text-3xl italic leading-snug text-pretty max-w-3xl text-muted">
                  {stakes}
                </p>
              )}

              <AccentRule accent={accent} className="max-w-xs opacity-80" />

              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              {context && (
                <p className="text-base md:text-lg leading-relaxed text-pretty max-w-prose text-muted/90">
                  {context}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-20 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/40">
          evidence below ↓
        </div>
      </section>
    </>
  )
}
