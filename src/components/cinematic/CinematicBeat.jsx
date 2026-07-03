import ScrollReveal from '../motion/ScrollReveal'

export default function CinematicBeat({
  line,
  punch,
  accent = 'clinify',
  className = '',
}) {
  const glowClass = {
    clinify: 'cinematic-glow-clinify',
    universityx: 'cinematic-glow-universityx',
    treatmentpath: 'cinematic-glow-treatmentpath',
  }[accent]

  return (
    <ScrollReveal
      as="section"
      className={`investigation-cinematic relative py-12 md:py-28 lg:py-40 md:min-h-[50vh] flex items-center overflow-hidden ${className}`}
    >
      <div
        className={`absolute inset-0 pointer-events-none opacity-60 ${glowClass}`}
        aria-hidden
      />

      <div className="relative max-w-5xl">
        <p className="dossier-statement display text-4xl md:text-6xl lg:text-7xl leading-[1.02] text-balance">
          {line}
        </p>
        {punch && (
          <p className="dossier-lead mt-5 md:mt-8 lg:mt-10 font-serif text-xl md:text-2xl lg:text-3xl italic leading-snug text-pretty max-w-3xl">
            {punch}
          </p>
        )}
      </div>
    </ScrollReveal>
  )
}
