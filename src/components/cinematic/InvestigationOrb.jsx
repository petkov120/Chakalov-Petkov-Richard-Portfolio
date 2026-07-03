const orbConfig = {
  clinify: {
    core: 'rgba(59, 130, 246, 0.55)',
    glow: 'rgba(0, 212, 255, 0.35)',
    ring: 'rgba(59, 130, 246, 0.25)',
    size: 'min(52vw, 520px)',
  },
  universityx: {
    core: 'rgba(224, 122, 95, 0.5)',
    glow: 'rgba(244, 162, 97, 0.4)',
    ring: 'rgba(224, 122, 95, 0.22)',
    size: 'min(58vw, 560px)',
  },
  treatmentpath: {
    core: 'rgba(92, 122, 107, 0.48)',
    glow: 'rgba(143, 185, 150, 0.32)',
    ring: 'rgba(92, 122, 107, 0.24)',
    size: 'min(50vw, 480px)',
  },
}

export default function InvestigationOrb({ accent = 'clinify', active = false }) {
  const config = orbConfig[accent] ?? orbConfig.clinify

  return (
    <div
      className={`investigation-orb pointer-events-none ${active ? 'is-active' : ''}`}
      aria-hidden
      style={{ '--orb-size': config.size }}
    >
      <div
        className="investigation-orb__ring"
        style={{ borderColor: config.ring }}
      />
      <div
        className="investigation-orb__glow"
        style={{
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
        }}
      />
      <div
        className="investigation-orb__core"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${config.core}, transparent 62%)`,
          boxShadow: `0 0 60px ${config.glow}, inset 0 0 40px rgba(255,255,255,0.06)`,
        }}
      />
    </div>
  )
}
