import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import EntranceScene from '../components/mind/EntranceScene'
import Stage from '../components/stage/Stage'
import { Annotation, Highlight } from '../components/mind/Marks'
import MindFooter from '../components/layout/MindFooter'
import { useReducedMotion } from '../components/mind/motion'
import useShowcaseRoute from '../components/mind/useShowcaseRoute'
import { workCases, zoomExplorations } from '../data/mind/projects'
import { FACTS, SKILLS } from '../data/mind/profile'
import '../components/mind/home.css'

const InteractionShowcase = lazy(() => import('../components/mind/InteractionShowcase'))
const ENTERED_KEY = 'mind-entered'
const seenEntrance = () => { try { return sessionStorage.getItem(ENTERED_KEY) === '1' } catch { return false } }

export default function MindPortfolioPage() {
  const reduced = useReducedMotion()
  // Onboarding plays only on the bare homepage URL, once per visit; any deep link goes straight in.
  const [entered, setEntered] = useState(() => location.pathname !== '/' || !!location.hash || seenEntrance())
  const [preparing, setPreparing] = useState(false) // the interior mounts under the entrance portal
  const work = useRef(null)
  const interior = useRef(null)
  const backdrop = useRef(null)
  const atmosphereFrame = useRef(0)
  const showcase = useShowcaseRoute(zoomExplorations)

  const setAtmosphere = useCallback(values => {
    const node = backdrop.current
    if (!node) return
    if (values.glow) node.style.setProperty('--project-glow', values.glow)
    if (values.rail != null) node.style.setProperty('--rail-motion', values.rail)
  }, [])

  const enter = useCallback(() => {
    try { sessionStorage.setItem(ENTERED_KEY, '1') } catch { /* storage blocked: the intro just plays again */ }
    setEntered(true)
    history.replaceState(null, '', '/#work')
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => work.current?.focus({ preventScroll: true }))
  }, [])

  useEffect(() => { // the logo, from the homepage, replays the onboarding
    const replay = () => {
      if ((location.pathname.replace(/\/$/, '') || '/') !== '/' || location.hash) return
      setPreparing(false)
      setEntered(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', replay)
    return () => window.removeEventListener('hashchange', replay)
  }, [])

  useEffect(() => { if (showcase.id) setEntered(true) }, [showcase.id])

  useEffect(() => {
    if (!entered || reduced) return undefined
    const node = interior.current
    const bg = backdrop.current
    if (!node || !bg) return undefined
    const update = (x, y) => {
      cancelAnimationFrame(atmosphereFrame.current)
      atmosphereFrame.current = requestAnimationFrame(() => {
        bg.style.setProperty('--pointer-x', x)
        bg.style.setProperty('--pointer-y', y)
      })
    }
    const move = event => {
      if (event.pointerType !== 'mouse') return
      update(((event.clientX / innerWidth) - .5).toFixed(3), ((event.clientY / innerHeight) - .5).toFixed(3))
    }
    const leave = () => update(0, 0)
    const scroll = () => {
      const progress = Math.min(1, Math.max(0, scrollY / Math.max(innerHeight * .85, 1)))
      bg.style.setProperty('--hero-parallax', progress.toFixed(3))
    }
    node.addEventListener('pointermove', move, { passive: true })
    node.addEventListener('pointerleave', leave)
    addEventListener('scroll', scroll, { passive: true })
    scroll()
    return () => {
      cancelAnimationFrame(atmosphereFrame.current)
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerleave', leave)
      removeEventListener('scroll', scroll)
    }
  }, [entered, reduced])

  useEffect(() => { // the interior mounts after the browser tried to follow the hash
    if (location.hash !== '#about') return
    requestAnimationFrame(() => document.getElementById('about')?.scrollIntoView({ behavior: 'instant' }))
  }, [])

  const project = zoomExplorations.find(item => item.id === showcase.id)

  return <div className="mind-site" data-reduced={reduced} data-active-project={project?.id}>
    {!entered && <EntranceScene onEnter={enter} onPrepare={() => setPreparing(true)} reduced={reduced} />}
    {(entered || preparing) && <div ref={interior} className="mind-interior" inert={entered ? undefined : ''}>
      <div ref={backdrop} className="mind-work-bg" aria-hidden="true"><img className="mind-work-bg__statue" src="/images/entrance/statue-floral-cutout.webp" alt="" width="1024" height="1536" decoding="async" /></div>
      <a className="mind-skip" href="#gallery">Skip to the work</a>
      <SiteNav theme="mind" current="home" />
      <main id="work" ref={work} tabIndex={-1}>
        <section id="gallery" aria-label="Selected work">
          <Stage prototypes={zoomExplorations} cases={workCases} reduced={reduced} suspended={!!project} onOpen={showcase.open} onAtmosphere={setAtmosphere}
            masthead={<header className="stage__name">
              <p className="stage__eyebrow">Design engineer</p>
              <h1>Petkov Chakalov</h1>
              <p className="stage__identity">
                <strong>Founding designer at Clinify</strong>
                <span className="stage__identity-separator" aria-hidden="true">·</span>
                <span className="stage__identity-proof">Products used by 2 B2B customers and 3 institutions</span>
                <span className="stage__identity-separator" aria-hidden="true">·</span>
                <span className="stage__identity-location">Lagos</span>
              </p>
            </header>} />
        </section>
        <section id="about" className="mind-about mind-about--manga mind-section">
          <div>
            <p className="mind-label">About</p>
            <h2>Still<br /><Highlight>curious.</Highlight></h2>
            <Annotation tone="pink">A builder, before anything.</Annotation>
          </div>
          <div className="mind-about__story">
            <img src="/images/notes/nigeria-childhood.png" alt="Petkov as a child, smiling on a lawn in Nigeria" loading="lazy" width="240" height="280" />
            <p>I’m Petkov Chakalov, a design engineer based in Lagos. I grew up around systems that fail and people who find a way through anyway.</p>
            <p>That is still how I work. Clear questions. Thoughtful software. Products that have to hold when the stakes are real, especially in healthcare and education.</p>
            <dl className="mind-facts">
              {FACTS.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd><strong>{fact.value}</strong>{fact.role && <em>{fact.role}</em>}{fact.detail && <span>{fact.detail}</span>}</dd></div>)}
            </dl>
            <p className="mind-about__links"><a className="mind-link" href="/resume">Resume ↗︎</a><a className="mind-link" href="/about">The longer story ↗︎</a></p>
            <p className="mind-skills">{SKILLS.map(skill => <span key={skill}>{skill}</span>)}</p>
          </div>
        </section>
      </main>
      <MindFooter />
    </div>}
    {project && <Suspense fallback={<div className="mind-reader-loading" role="status">Opening project…</div>}>
      <InteractionShowcase item={project} projects={zoomExplorations} origin={showcase.entry?.rect}
        reduced={reduced} closing={showcase.closing} onClose={showcase.requestClose} onExited={showcase.finishClose} onProjectChange={showcase.change} getReturnRect={showcase.getReturnRect} />
    </Suspense>}
  </div>
}
