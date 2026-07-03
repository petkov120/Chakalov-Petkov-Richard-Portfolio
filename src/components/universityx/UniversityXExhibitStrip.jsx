import { universityxIndexThumbnails } from '../../data/universityxIndexThumbnails'

export default function UniversityXExhibitStrip() {
  return (
    <div className="universityx-exhibit-strip" aria-label="UniversityX exhibit index preview">
      <span className="universityx-exhibit-strip__label font-mono text-[9px] uppercase tracking-[0.16em] text-vault-muted/70">
        Exhibit log
      </span>
      <div className="universityx-exhibit-strip__row">
        {universityxIndexThumbnails.map((item) => (
          <figure key={item.figure} className="universityx-exhibit-strip__item">
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
