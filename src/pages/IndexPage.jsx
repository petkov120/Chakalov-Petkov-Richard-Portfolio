import GalleryStrip from '../components/gallery/GalleryStrip'
import GalleryWork from '../components/gallery/GalleryWork'
import GalleryNav from '../components/layout/GalleryNav'
import { galleryPhotos, galleryProjects, galleryWorkPrimary } from '../data/gallery'

const EMAIL = 'petkovrichard8@gmail.com'
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Inquiry`

export default function IndexPage() {
  return (
    <main className="gallery-page min-h-screen">
      <GalleryNav />

      <div className="gallery-page__shell">
        <section className="gallery-hero" aria-labelledby="gallery-name">
          <p className="gallery-hero__role">Design engineer · Lagos</p>
          <h1 id="gallery-name" className="gallery-hero__name display">
            Petkov
            <em>Chakalov</em>
          </h1>
          <p className="gallery-hero__line">
            I design software people have to trust at work.
          </p>
        </section>
      </div>

      <section className="gallery-section" aria-label="Selected screens">
        <GalleryStrip
          items={galleryWorkPrimary}
          caption="Tap a screen. There’s more inside."
        />
      </section>

      <div className="gallery-page__shell">
        <section id="about" className="gallery-bio" aria-labelledby="gallery-bio-heading">
          <h2 id="gallery-bio-heading" className="sr-only">
            About
          </h2>
          <p>
            I grew up in Nigeria, around systems that fail and people who find a way through anyway.
            That is still how I work. Quiet products. Clear questions. Software that has to hold
            when the stakes are real.
          </p>
          <p>
            Design engineer on{' '}
            <a href="/clinify" className="gallery-inline-mark gallery-inline-mark--clinify">Clinify</a>, building enterprise care tools teams can actually trust.{' '}
            <a href="/universityx" className="gallery-inline-mark gallery-inline-mark--universityx">
              UniversityX
            </a>{' '}
            started as a chatbot. I turned it into a teacher. The playground is where interface
            ideas become working interactions before they become products.
          </p>
          <p>
            The weaver is the reminder: ask who it is for, then make the thing hold.
          </p>
        </section>
      </div>

      <section id="works" className="gallery-section gallery-section--work" aria-label="Work">
        <GalleryWork projects={galleryProjects} />
      </section>

      <div className="gallery-page__shell">
        <section className="gallery-photos" aria-label="Photographs">
          {galleryPhotos.map((photo) => (
            <figure key={photo.src} className="gallery-photos__item">
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </section>

        <footer className="gallery-footer">
          <p className="gallery-footer__kicker">Still asking why.</p>
          <a href={MAILTO} className="gallery-footer__cta">
            Write me
          </a>
          <div className="gallery-footer__meta">
            <img src="/images/weaver-mark.svg" width="22" height="22" alt="" aria-hidden="true" />
            <span>© 2026 Petkov Chakalov</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
