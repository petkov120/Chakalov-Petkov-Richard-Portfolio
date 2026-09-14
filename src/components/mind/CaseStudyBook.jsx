import { useEffect, useRef, useState } from 'react'
import { Annotation } from './Marks'
import { timing, useDialog } from './motion'

import { BookCover } from './BookObject'

function BookFigure({ page }) {
  const [failed, setFailed] = useState(false)
  return <figure>{failed ? <div className="mind-book-image-fallback" role="img" aria-label={page.alt}><span className="mind-label">Image unavailable</span><p>{page.alt}</p></div> : <img src={page.image} alt={page.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />}{page.caption && <figcaption>{page.caption}</figcaption>}</figure>
}

function BookPage({ page, number }) {
  return <article className={`mind-book-page mind-book-page--${page.type}`}>
    <div className="mind-label mind-book-page__label">{page.label}</div><h3>{page.title}</h3>
    {page.type !== 'image' && page.body && <p>{page.body}</p>}
    {page.facts && <dl>{page.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
    {page.image && <BookFigure key={page.image} page={page} />}
    {page.type === 'image' && <p>{page.body}</p>}
    {page.items && <ul>{page.items.map(item => <li key={item}>{item}</li>)}</ul>}
    {page.metrics && <dl className="mind-book-page__metrics">{page.metrics.map(metric => <div key={metric.value}><dt>{metric.value}</dt><dd>{metric.detail}</dd></div>)}</dl>}
    {page.note && <Annotation>{page.note}</Annotation>}
    {page.link && <a className="mind-book-page__source" href={page.link.href}>{page.link.label} ↗</a>}
    <footer><span>Petkov Chakalov / Clinify</span><span>{String(number + 1).padStart(2, '0')}</span></footer>
  </article>
}

export default function BookReader({ book, reduced, origin, closing, onClose, onExited, initialPage = 0 }) {
  const dialog = useRef(null)
  const shell = useRef(null)
  const [stage, setStage] = useState('lifting')
  const [page, setPage] = useState(initialPage)
  const [single, setSingle] = useState(() => matchMedia('(max-width: 760px), (max-height: 580px)').matches)
  const [turn, setTurn] = useState(null)
  const [turnPage, setTurnPage] = useState(null)
  const touch = useRef(null)
  const [simple, setSimple] = useState(false)
  useDialog(dialog, onClose)

  useEffect(() => {
    const query = matchMedia('(max-width: 760px), (max-height: 580px)')
    const change = () => setSingle(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    const el = shell.current
    const measure = () => {
      const animation = el.style.animation
      el.style.animation = 'none'
      const r = el.getBoundingClientRect()
      const coverWidth = r.width * (single ? 1 : .5)
      const coverX = r.left + r.width - coverWidth / 2
      el.style.transformOrigin = `${single ? 50 : 75}% 50%`
      if (origin) {
        el.style.setProperty('--book-from-x', `${origin.left + origin.width / 2 - coverX}px`)
        el.style.setProperty('--book-from-y', `${origin.top + origin.height / 2 - (r.top + r.height / 2)}px`)
        el.style.setProperty('--book-from-scale', String(Math.min(origin.width / coverWidth, 1)))
      }
      el.style.animation = animation
    }
    measure()
    const timer = setTimeout(() => setStage('reading'), reduced ? 40 : timing.lift + timing.cover)
    return () => clearTimeout(timer)
  }, [origin, reduced, single])
  useEffect(() => {
    if (!closing) return undefined
    setTurn(null)
    setStage('closing')
    const returning = setTimeout(() => setStage('returning'), reduced ? 10 : timing.cover)
    const finish = setTimeout(onExited, reduced ? 80 : timing.cover + timing.lift)
    return () => { clearTimeout(returning); clearTimeout(finish) }
  }, [closing, onExited, reduced])
  useEffect(() => {
    if (!turn) return undefined
    const timer = setTimeout(() => { setPage(turnPage); setTurn(null) }, reduced || simple ? 30 : timing.turn)
    return () => clearTimeout(timer)
  }, [turn, turnPage, reduced, simple])
  useEffect(() => {
    const url = new URL(location.href)
    url.searchParams.set('page', String(page + 1))
    history.replaceState(history.state, '', `${url.pathname}${url.search}`)
  }, [page])
  const start = single ? page : Math.floor(page / 2) * 2
  const step = single ? 1 : 2
  const change = direction => {
    const target = start + direction * step
    if (turn || closing || stage !== 'reading' || target < 0 || target >= book.pages.length) return
    setTurnPage(target)
    setTurn(direction > 0 ? 'next' : 'previous')
  }
  const visibleStart = turn === 'next' ? turnPage : start
  return <dialog ref={dialog} className={`mind-dialog mind-reader ${simple ? 'mind-reader--simple' : ''}`} aria-labelledby="mind-reader-title" data-stage={stage} onKeyDown={event => {
    if (event.key === 'ArrowRight' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) { event.preventDefault(); change(1) }
    if (event.key === 'ArrowLeft' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) { event.preventDefault(); change(-1) }
  }}>
    <header className="mind-dialog__header"><h2 id="mind-reader-title" className="mind-label">{book.title} / Field notes</h2><div><button className="mind-reader__simple" onClick={() => setSimple(value => !value)} aria-pressed={simple}>Simple reader</button><button onClick={onClose} className="mind-text-button" autoFocus disabled={closing}>Close book <span aria-hidden="true">×</span></button></div></header>
    <div className="mind-reader__stage"><div ref={shell} className="mind-reader__book" onTouchStart={event => { const t = event.touches[0]; touch.current = { x: t.clientX, y: t.clientY } }} onTouchEnd={event => {
      if (!touch.current) return
      const t = event.changedTouches[0], dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y
      if (touch.current.x > 30 && touch.current.x < innerWidth - 30 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.7) change(dx < 0 ? 1 : -1)
      touch.current = null
    }}>
      <div className="mind-reader__spread" aria-busy={!!turn}>
        <BookPage page={book.pages[visibleStart]} number={visibleStart} />
        {!single && book.pages[visibleStart + 1] && <BookPage page={book.pages[visibleStart + 1]} number={visibleStart + 1} />}
      </div>
      {turn && !simple && !reduced && <div className={`mind-reader__turn mind-reader__turn--${turn}`} aria-hidden="true"><div className="mind-reader__turn-front"><BookPage page={book.pages[turn === 'next' ? Math.min(start + step - 1, book.pages.length - 1) : turnPage]} number={start} /></div><div className="mind-reader__turn-back"><span>{book.title}</span><i>Field notes</i></div></div>}
      <div className="mind-reader__cover" aria-hidden="true"><BookCover book={book} /></div>
    </div></div>
    <footer className="mind-reader__controls"><button onClick={() => change(-1)} disabled={start === 0 || !!turn || stage !== 'reading'}>← Previous</button><span className="mind-label" aria-live="polite">{single ? `Page ${page + 1}` : `Pages ${start + 1}–${Math.min(start + 2, book.pages.length)}`} / {book.pages.length}</span><button onClick={() => change(1)} disabled={start + step >= book.pages.length || !!turn || stage !== 'reading'}>Next →</button></footer>
  </dialog>
}
