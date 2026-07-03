export default function NotesMangaPanel({ panel }) {
  if (!panel?.src) return null

  const isWide = panel.layout === 'wide' || panel.layout === 'full'

  return (
    <figure
      className={`notes-manga-panel ${isWide ? 'notes-manga-panel--wide' : ''}`}
    >
      <div className="notes-manga-panel__frame">
        <img
          src={panel.src}
          alt={panel.alt ?? ''}
          loading="lazy"
          decoding="async"
          className="notes-manga-panel__img"
        />
      </div>
      {panel.caption && (
        <figcaption className="notes-manga-panel__caption">
          {panel.caption}
        </figcaption>
      )}
    </figure>
  )
}
