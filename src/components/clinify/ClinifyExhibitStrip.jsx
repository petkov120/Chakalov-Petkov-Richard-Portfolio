import { clinifyIndexThumbnails } from '../../data/clinifyIndexThumbnails'

export default function ClinifyExhibitStrip() {
  return (
    <div className="clinify-exhibit-strip" aria-label="Exhibit index preview">
      <span className="clinify-exhibit-strip__label font-mono text-[9px] uppercase tracking-[0.16em] text-vault-muted/70">
        Exhibit log
      </span>
      <div className="clinify-exhibit-strip__row">
        {clinifyIndexThumbnails.map((item) => (
          <figure key={item.figure} className="clinify-exhibit-strip__item">
            <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
            <figcaption className="font-mono text-[8px] tracking-wider text-vault-muted/80">
              {item.figure}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
