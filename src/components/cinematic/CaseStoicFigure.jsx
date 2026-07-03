export default function CaseStoicFigure({
  src = '/images/clinify/stoic-thinker.png',
  accent = 'clinify',
  onOpen,
  letterOpen = false,
}) {
  return (
    <figure
      className={`case-stoic-figure case-stoic-figure--end case-stoic-figure--${accent} grid md:grid-cols-12 gap-6 md:gap-10 mt-10 md:mt-14 pt-8 md:pt-10`}
    >
      <div className="hidden md:block md:col-span-2" />
      <div className="md:col-span-10 flex justify-center">
        <button
          type="button"
          className="case-stoic-figure__trigger group"
          onClick={onOpen}
          aria-expanded={letterOpen}
          aria-haspopup="dialog"
          aria-label="Open a note from the author"
        >
          <img
            src={src}
            alt=""
            className="case-stoic-figure__img"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <span className="case-stoic-figure__glow" aria-hidden="true" />
          <span className="case-stoic-figure__cue" aria-hidden="true">
            <span className="case-stoic-figure__cue-touch">Tap for a note from the author</span>
            <span className="case-stoic-figure__cue-hover">Open a note from the author</span>
          </span>
        </button>
      </div>
    </figure>
  )
}
