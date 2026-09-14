import { Annotation } from './Marks'

export function BookCover({ book }) {
  return <div className="mind-book-cover">
    <div className="mind-book-cover__top"><span>FIELD NOTES</span><span>VOL. 01</span></div>
    <div className="mind-book-cover__title"><span>{book.title}</span><em>Care is<br />a human thing.</em></div>
    <div className="mind-book-cover__art" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--line': i }} />)}</div>
    <div className="mind-book-cover__bottom"><span>Designing trust.<br />One decision at a time.</span><span>P. C.<br />2026</span></div>
  </div>
}

export function ClosedBook({ book, hidden, onOpen, triggerRef }) {
  return <section id="case-study" className="mind-case mind-section" aria-labelledby="mind-case-title">
    <div className="mind-section__meta"><span className="mind-label">03 / Case study</span><span className="mind-label">A closer look</span></div>
    <div className="mind-case__layout"><div className="mind-case__copy"><p className="mind-label">Healthcare, connected.</p><h2 id="mind-case-title">{book.title}</h2><p>When the stakes are human,<br />the details matter.</p><div className="mind-case__facts"><span>{book.year}</span><span>{book.role}</span></div><button className="collage-enter" onClick={onOpen}>Open it <span aria-hidden="true">↗</span></button><Annotation tone="white">small details.<br />big change.</Annotation></div>
    <div className="mind-case__object"><button ref={triggerRef} className="mind-book-object" onClick={onOpen} aria-label={`Open ${book.title} case-study book`} style={{ visibility: hidden ? 'hidden' : undefined }}><span className="mind-book-object__back" /><span className="mind-book-object__pages" /><span className="mind-book-object__spine"><span>CLINIFY — FIELD NOTES</span><span>01</span></span><BookCover book={book} /></button><span className="mind-case__shadow" aria-hidden="true" /><p className="mind-label mind-case__caption">Pick it up. Take your time.</p></div></div>
  </section>
}

