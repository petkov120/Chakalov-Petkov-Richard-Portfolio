import { auroraSystem } from '../data/designSystem'

const DARK_BG      = '#04050f'
const DARK_SURFACE = 'rgba(12, 15, 35, 0.75)'
const DARK_BORDER  = 'rgba(80, 120, 200, 0.15)'
const DARK_DIVIDER = 'rgba(80, 120, 200, 0.1)'
const DARK_LABEL   = '#7a8aaa'
const DARK_TEXT    = '#dde6f5'

export default function DesignSystemView() {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">

        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
            System · Aurora
          </div>
          <h2 className="display text-2xl md:text-3xl leading-tight text-balance">
            The token system
          </h2>
          <p className="font-mono text-xs text-muted mt-4 leading-relaxed">
            Extracted from the live production codebase. No prior documentation existed.
          </p>
        </div>

        <div className="md:col-span-7 md:col-start-5 space-y-5">
          <p className="text-base md:text-lg leading-relaxed text-pretty max-w-prose">
            The Aurora palette was defined before the second screen shipped. Semantic roles
            were assigned upfront — teal for primary, blue for AI states, purple for admin
            context — because once clinical data sits next to AI-tagged data next to status
            indicators, ambiguous color assignments become UX errors.
          </p>

          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: DARK_BG,
              border: `1px solid ${DARK_BORDER}`,
              boxShadow: '0 4px 32px rgba(0,0,0,0.14)',
            }}
          >
            {/* Gradient accent bar */}
            <div style={{ height: 2, background: 'linear-gradient(135deg, #00d4ff, #00e5b0)' }} />

            {/* Block 1: Palette */}
            <div className="px-5 py-5 md:px-7 md:py-6">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.12em] mb-4"
                style={{ color: DARK_LABEL }}
              >
                Aurora Palette
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {auroraSystem.palette.map((swatch) => (
                  <div key={swatch.name}>
                    <div
                      className="h-7 w-full rounded mb-1.5"
                      style={{ background: swatch.hex }}
                    />
                    <div
                      className="font-mono text-[11px] font-medium leading-tight"
                      style={{ color: DARK_TEXT }}
                    >
                      {swatch.name}
                    </div>
                    <div
                      className="font-mono text-[10px] leading-tight mt-0.5"
                      style={{ color: DARK_LABEL }}
                    >
                      {swatch.hex}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4"
                style={{ borderTop: `1px solid ${DARK_DIVIDER}` }}
              >
                {auroraSystem.semantic.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div
                      className="shrink-0 rounded-full"
                      style={{ width: 7, height: 7, background: s.hex }}
                    />
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: DARK_LABEL }}
                    >
                      {s.name}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div
                    className="shrink-0 rounded"
                    style={{
                      width: 14,
                      height: 7,
                      background: 'linear-gradient(135deg, #00d4ff, #00e5b0)',
                    }}
                  />
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: DARK_LABEL }}
                  >
                    Brand gradient
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${DARK_DIVIDER}` }} />

            {/* Block 2: Status language */}
            <div className="px-5 py-5 md:px-7 md:py-6">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.12em] mb-4"
                style={{ color: DARK_LABEL }}
              >
                Status Language
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {auroraSystem.statusPills.map((pill) => (
                  <span
                    key={pill.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: pill.color,
                      background: pill.bg,
                      border: `1px solid ${pill.border}`,
                    }}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {auroraSystem.statusPills.map((pill) => (
                  <div key={pill.label} className="flex items-center gap-2">
                    <div
                      className="shrink-0 rounded-full"
                      style={{ width: 7, height: 7, background: pill.color }}
                    />
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: DARK_LABEL }}
                    >
                      {pill.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${DARK_DIVIDER}` }} />

            {/* Block 3: Call state machine */}
            <div className="px-5 py-5 md:px-7 md:py-6">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.12em] mb-0.5"
                style={{ color: DARK_LABEL }}
              >
                Call State Machine
              </div>
              <div
                className="font-mono text-[10px] mb-4"
                style={{ color: 'rgba(122,138,170,0.5)' }}
              >
                Invented — no prior visual convention for AI outbound voice
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {auroraSystem.callStates.map((s) => (
                  <div key={s.state} className="flex items-center gap-3">
                    <div
                      className="shrink-0 rounded-full"
                      style={{ width: 7, height: 7, background: s.color }}
                    />
                    <span
                      className="font-mono text-[11px] font-medium shrink-0"
                      style={{ color: DARK_TEXT, width: 86 }}
                    >
                      {s.state}
                    </span>
                    <span
                      className="font-mono text-[10px] leading-tight"
                      style={{ color: DARK_LABEL }}
                    >
                      {s.meaning}
                    </span>
                  </div>
                ))}
              </div>

              {/* State flow */}
              <div
                className="mt-4 pt-4 font-mono text-[10px] leading-relaxed"
                style={{ borderTop: `1px solid ${DARK_DIVIDER}`, color: 'rgba(122,138,170,0.5)' }}
              >
                connecting → ringing → active → completed&nbsp;&nbsp;/&nbsp;&nbsp;failed → unfinished · rescheduled
              </div>
            </div>
          </div>

          <p className="font-mono text-xs text-muted leading-relaxed">
            Values sourced from{' '}
            <code className="text-ink text-[11px]">index.css</code>,{' '}
            <code className="text-ink text-[11px]">tailwind.config.js</code>, and{' '}
            <code className="text-ink text-[11px]">CallUIModal.tsx</code> in the live codebase.
          </p>
        </div>
      </div>
    </section>
  )
}
