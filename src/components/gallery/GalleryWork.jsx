export default function GalleryWork({ projects }) {
  return (
    <div className="gallery-work">
      <h2 className="sr-only">Selected work</h2>
      <div className="gallery-work__viewport">
        <div className="gallery-work__track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="gallery-work__group"
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {projects.map((project) => (
                <li key={`${project.id}-${copy}`}>
                  <a
                    href={project.href}
                    className="gallery-work__item"
                    aria-label={`View ${project.name}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    <figure className="gallery-work__frame">
                      <img src={project.src} alt="" loading="lazy" decoding="async" />
                      <figcaption className="gallery-work__card-title">
                        <span>{project.name}</span>
                        {project.status === 'draft' ? <small>In progress</small> : null}
                      </figcaption>
                    </figure>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <p className="gallery-work__caption">Interfaces and interaction studies from across the years</p>
      <a className="gallery-work__cta" href="/playground">
        See interactions
      </a>
    </div>
  )
}
