import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import EntranceScene from '../components/mind/EntranceScene'
import { InteractionReview } from '../components/mind/InteractionStudy'
import WorkCases from '../components/mind/WorkCases'
import ZoomExplorations from '../components/mind/ZoomExplorations'
import { Annotation, Highlight } from '../components/mind/Marks'
import BookFallback, { ReaderBoundary } from '../components/mind/BookFallback'
import { useReducedMotion } from '../components/mind/motion'
import { clinifyBook, zoomExplorations } from '../data/mind/projects'
import '../components/mind/mind.css'
import '../components/mind/interaction-rail.css'

const BookReader = lazy(() => import('../components/mind/CaseStudyBook'))
const InteractionShowcase = lazy(() => import('../components/mind/InteractionShowcase'))
const EMAIL = 'petkovrichard8@gmail.com'
const RESUME_MAILTO = `mailto:${EMAIL}?subject=Resume%20request`
const readLegacyOverlay = () => location.pathname === '/work/clinify' ? { kind: 'book', page: Math.max(0, Math.min(clinifyBook.pages.length - 1, Math.floor(Number(new URLSearchParams(location.search).get('page')) || 1) - 1)) } : location.pathname === '/interactions/card-removal' ? { kind: 'study' } : null

const readOverlay = () => {
  const project = zoomExplorations.find(item => item.href === location.pathname)
  return project ? { kind: 'showcase', id: project.id } : readLegacyOverlay()
}

export default function MindPortfolioPage() {
  const reduced = useReducedMotion()
  const [entered, setEntered] = useState(() => location.pathname !== '/' || !!location.hash)
  const [preparing, setPreparing] = useState(false)
  const [overlay, setOverlay] = useState(readOverlay)
  const [closing, setClosing] = useState(false)
  const [origin, setOrigin] = useState(null)
  const bookTrigger = useRef(null)
  const [showcaseEntry, setShowcaseEntry] = useState(null)
  const returnFocus = useRef(null)
  const work = useRef(null)
  const workBg = useRef(null)
  const currentOverlay = useRef(overlay)
  currentOverlay.current = overlay
  const [archive] = useState(() => location.pathname === '/interactions' || zoomExplorations.some(item => item.href === location.pathname))

  useEffect(() => {
    const node = workBg.current
    if (!node || reduced || !entered) {
      node?.style.setProperty('--hero-parallax', '0')
      return undefined
    }

    let frame = 0
    const update = () => {
      frame = 0
      const distance = Math.max(1, innerHeight * 1.05)
      const progress = Math.min(1, Math.max(0, scrollY / distance))
      node.style.setProperty('--hero-parallax', progress.toFixed(3))
    }
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    addEventListener('scroll', requestUpdate, { passive: true })
    addEventListener('resize', requestUpdate)
    return () => {
      removeEventListener('scroll', requestUpdate)
      removeEventListener('resize', requestUpdate)
      cancelAnimationFrame(frame)
    }
  }, [entered, reduced])

  const enter = useCallback(() => {
    setEntered(true)
    history.replaceState(null, '', '/#work')
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => work.current?.focus({ preventScroll: true }))
  }, [])
  useEffect(() => {
    const showOnboard = () => {
      const path = location.pathname.replace(/\/$/, '') || '/'
      if (path !== '/' || location.hash) return
      setPreparing(false)
      setEntered(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', showOnboard)
    return () => window.removeEventListener('hashchange', showOnboard)
  }, [])
  useEffect(() => {
    const back = () => {
      const next = readOverlay()
      if (currentOverlay.current && !next) {
        if (['book', 'showcase'].includes(currentOverlay.current.kind)) setClosing(true)
        else setOverlay(null)
      } else { setClosing(false); setOverlay(next); setEntered(true) }
    }
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [])
  useEffect(() => {
    if (overlay && overlay.kind !== 'showcase' && !history.state?.mindOverlay) requestAnimationFrame(() => document.getElementById(overlay.kind === 'book' ? 'cases' : 'interactions')?.scrollIntoView({ behavior: 'instant', block: 'center' }))
    // Direct project links open without replaying the entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const open = (kind) => {
    returnFocus.current = document.activeElement
    if (kind === 'book' && bookTrigger.current) {
      const r = bookTrigger.current.getBoundingClientRect()
      setOrigin({ left: r.left, top: r.top, width: r.width, height: r.height })
    }
    const returnUrl = location.pathname + location.search + location.hash
    history.pushState({ mindOverlay: true, returnUrl }, '', kind === 'book' ? '/work/clinify' : '/interactions/card-removal')
    setClosing(false)
    setOverlay({ kind, page: 0 })
  }
  const openProject = (item, trigger) => {
    if (currentOverlay.current) return
    returnFocus.current = trigger
    const rect = trigger.querySelector('.mind-phone').getBoundingClientRect()
    const screen = trigger.querySelector('.mind-studio-preview')?.dataset.screen || item.posterScreen
    setShowcaseEntry({ id: item.id, screen, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } })
    history.pushState({ mindOverlay: true, returnUrl: location.pathname + location.search + location.hash }, '', item.href)
    setClosing(false)
    setOverlay({ kind: 'showcase', id: item.id })
  }
  const changeProject = useCallback(id => {
    const item = zoomExplorations.find(project => project.id === id)
    if (!item) return
    history.replaceState(history.state, '', item.href)
    setOverlay({ kind: 'showcase', id })
  }, [])
  const getReturnRect = useCallback(() => {
    const item = document.querySelector(`[data-study="${currentOverlay.current?.id}"]`)
    const track = item?.closest('.mind-rail__track')
    if (!item || !track) return null
    const r = item.getBoundingClientRect(), railRect = track.getBoundingClientRect()
    if (r.left < railRect.left || r.right > railRect.right) track.scrollLeft += r.left - railRect.left - 22
    const result = item.querySelector('.mind-phone').getBoundingClientRect()
    return result.bottom > 0 && result.top < innerHeight ? { left: result.left, top: result.top, width: result.width, height: result.height } : null
  }, [])
  const finishClose = useCallback(() => {
    const kind = currentOverlay.current?.kind
    const projectId = currentOverlay.current?.id
    setOverlay(null)
    setClosing(false)
    requestAnimationFrame(() => {
      const target = kind === 'showcase' ? document.querySelector(`[data-study="${projectId}"] .mind-rail__open`) : returnFocus.current?.isConnected ? returnFocus.current : kind === 'book' ? bookTrigger.current : document.querySelector('.mind-interaction__copy .mind-link')
      target?.focus({ preventScroll: true })
    })
    if (readOverlay()) {
      if (history.state?.mindOverlay) history.back()
      else {
        history.replaceState(null, '', kind === 'book' ? '/#cases' : kind === 'showcase' ? '/interactions' : '/#interactions')
        requestAnimationFrame(() => document.getElementById(kind === 'book' ? 'cases' : 'interactions')?.scrollIntoView({ behavior: 'instant', block: 'center' }))
      }
    }
  }, [])
  const closeBook = useCallback(() => setClosing(true), [])

  return <div className="mind-site" data-reduced={reduced} data-active-project={overlay?.kind === 'showcase' ? overlay.id : undefined}>
    {!entered && <EntranceScene onEnter={enter} onPrepare={() => setPreparing(true)} reduced={reduced} />}
    {(entered || preparing) && <div className="mind-interior" inert={!entered ? '' : undefined}>
      <div className="mind-work-bg" ref={workBg} aria-hidden="true">
          <img className="mind-work-bg__statue" src="/images/entrance/statue-floral-cutout.png" alt="" width="1024" height="1536" />
      </div>
      <a className="mind-skip" href={archive ? '#interactions' : '#cases'}>Skip to the work</a>
      <SiteNav theme="mind" current={archive ? 'work' : 'home'} />
      <main id="work" ref={work} tabIndex={-1}>
        {!archive && <section id="interactions-preview" className="mind-interactions-preview mind-section" aria-labelledby="mind-interactions-preview-title">
          <div className="mind-section__meta"><span className="mind-label">01 / Interactive work</span><span className="mind-label">Live previews</span></div>
          <div className="mind-interactions-preview__intro">
            <h2 id="mind-interactions-preview-title">Petkov <Highlight>Chakalov</Highlight></h2>
            <p className="mind-label">Design engineer · Lagos, Nigeria</p>
            <p className="mind-interactions-preview__role">I design and build AI products for healthcare and education, from research and systems thinking through shipped frontend.</p>
          </div>
          <ZoomExplorations items={zoomExplorations} reduced={reduced} suspended={!!overlay} onOpen={openProject} standalone />
          <a className="collage-enter mind-interactions-preview__link" href="/interactions">Explore <span aria-hidden="true">↗</span></a>
        </section>}
        {!archive && <WorkCases onOpenClinify={() => open('book')} />}
        {archive && <section id="interactions" className="mind-interactions-archive" aria-labelledby="mind-archive-title"><header className="mind-section"><p className="mind-label">Interactive work</p><h1 id="mind-archive-title">Don&apos;t just look. <Highlight>Play</Highlight></h1><p>Small moments from the interfaces I’m making.</p></header><ZoomExplorations items={zoomExplorations} reduced={reduced} suspended={!!overlay} onOpen={openProject} standalone /></section>}
        {!archive && <>
          <section className="mind-practice mind-section" aria-labelledby="mind-practice-title">
            <div className="mind-section__meta"><span className="mind-label">03 / Practice</span><span className="mind-label">How I make</span></div>
            <div className="mind-practice__heading"><h2 id="mind-practice-title">From question<br />to <Highlight>shipped.</Highlight></h2><p>I work across product design and frontend, especially where AI meets complex human workflows.</p></div>
            <ol className="mind-practice__steps">
              <li><span>01</span><strong>Research</strong><p>Understand the people, constraints, and real decision being made.</p></li>
              <li><span>02</span><strong>Prototype</strong><p>Make the risky interaction tangible early enough to learn from it.</p></li>
              <li><span>03</span><strong>Systemize</strong><p>Turn the useful parts into clear patterns and resilient states.</p></li>
              <li><span>04</span><strong>Build</strong><p>Carry the thinking into React, production frontend, and delivery.</p></li>
            </ol>
            <p className="mind-practice__skills"><span>Product design</span><span>UX systems</span><span>React</span><span>Frontend implementation</span><span>AI workflows</span><span>Healthcare operations</span><span>Figma</span></p>
          </section>
          <section id="about" className="mind-about mind-section"><div><p className="mind-label">04 / The person behind the pixels</p><h2>Still<br /><Highlight>curious.</Highlight></h2><Annotation tone="pink">A builder, before anything.</Annotation></div><div className="mind-about__story"><img src="/images/notes/nigeria-childhood.png" alt="Petkov as a child, smiling on a lawn in Nigeria" loading="lazy" width="240" height="280" /><p>I’m Petkov Chakalov, a design engineer based in Lagos. I grew up around systems that fail and people who find a way through anyway.</p><p>That is still how I work. Clear questions. Thoughtful software. Products that have to hold when the stakes are real, especially in healthcare and education.</p><a className="mind-link" href="/notes">A little more about me ↗</a></div></section>
        </>}
      </main>
      <footer className="mind-footer mind-section"><span className="mind-label">Good things start with a conversation.</span><a href={`mailto:${EMAIL}`}>What are you<br /><Highlight>thinking?</Highlight><span aria-hidden="true">↗</span></a><div><span>© 2026 Petkov Chakalov</span><span>Lagos, Nigeria</span><a href={`mailto:${EMAIL}`}>Email ↗</a><a href="https://github.com/petkov120" target="_blank" rel="noreferrer">GitHub ↗</a><a href={RESUME_MAILTO}>Resume ↗</a></div></footer>
    </div>}
    {overlay?.kind === 'showcase' && <Suspense fallback={<div className="mind-reader-loading" role="status">Opening project…</div>}><InteractionShowcase item={zoomExplorations.find(project => project.id === overlay.id)} projects={zoomExplorations} origin={showcaseEntry?.rect} initialScreen={showcaseEntry?.id === overlay.id ? showcaseEntry.screen : undefined} reduced={reduced} closing={closing} onClose={closeBook} onExited={finishClose} onProjectChange={changeProject} getReturnRect={getReturnRect} /></Suspense>}
    {overlay?.kind === 'study' && <InteractionReview reduced={reduced} onClose={finishClose} />}
    {overlay?.kind === 'book' && <ReaderBoundary fallback={<BookFallback book={clinifyBook} onClose={finishClose} />}><Suspense fallback={<div className="mind-reader-loading" role="status">Opening Clinify…</div>}><BookReader book={clinifyBook} reduced={reduced} origin={origin} closing={closing} onClose={closeBook} onExited={finishClose} initialPage={overlay.page} /></Suspense></ReaderBoundary>}
  </div>
}
