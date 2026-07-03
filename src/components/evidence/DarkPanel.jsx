export default function DarkPanel({
  title,
  subtitle,
  children,
  flow,
  sources = [],
  accent = 'clinify',
}) {
  const gradient =
    accent === 'clinify'
      ? 'linear-gradient(135deg, #00d4ff, #00e5b0)'
      : accent === 'universityx'
        ? 'linear-gradient(135deg, #E07A5F, #F4A261)'
        : 'linear-gradient(135deg, #5C7A6B, #8FB996)'

  return (
    <div
      className="rounded-xl overflow-hidden shadow-evidence"
      style={{
        background: '#0A0E14',
        border: '1px solid rgba(120, 140, 180, 0.14)',
      }}
    >
      <div style={{ height: 2, background: gradient }} />

      <div className="px-5 py-5 md:px-7 md:py-6">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.12em] mb-0.5"
          style={{ color: '#8A96B0' }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className="font-mono text-[10px] mb-4"
            style={{ color: 'rgba(138,150,176,0.55)' }}
          >
            {subtitle}
          </div>
        )}

        {children}

        {flow && (
          <div
            className="mt-4 pt-4 font-mono text-[10px] leading-relaxed"
            style={{
              borderTop: '1px solid rgba(120, 140, 180, 0.1)',
              color: 'rgba(138,150,176,0.55)',
            }}
          >
            {flow}
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div
          className="px-5 py-3 md:px-7 font-mono text-[10px]"
          style={{
            borderTop: '1px solid rgba(120, 140, 180, 0.1)',
            color: 'rgba(138,150,176,0.45)',
          }}
        >
          Values sourced from{' '}
          {sources.map((s, i) => (
            <span key={s}>
              {i > 0 && ', '}
              <code style={{ color: '#DDE6F5' }}>{s}</code>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function StateRow({ states }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
      {states.map((s) => (
        <div key={s.state} className="flex items-center gap-3">
          <div
            className="shrink-0 rounded-full"
            style={{ width: 7, height: 7, background: s.color }}
          />
          <span
            className="font-mono text-[11px] font-medium shrink-0"
            style={{ color: '#DDE6F5', width: 86 }}
          >
            {s.state}
          </span>
        </div>
      ))}
    </div>
  )
}
