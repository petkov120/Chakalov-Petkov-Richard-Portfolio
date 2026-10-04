import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import SiteNav from '../components/layout/SiteNav'
import EntranceScene from '../components/mind/EntranceScene'
import Stage from '../components/stage/Stage'
import { Annotation, Highlight } from '../components/mind/Marks'
import { useReducedMotion } from '../components/mind/motion'
import useShowcaseRoute from '../components/mind/useShowcaseRoute'
import { workCases, zoomExplorations } from '../data/mind/projects'
import '../components/mind/home.css'

const InteractionShowcase = lazy(() => import('../components/mind/InteractionShowcase'))
const EMAIL = 'petkovrichard8@gmail.com'
const SKILLS = ['Product design', 'UX systems', 'React', 'Frontend implementation', 'AI workflows', 'Healthcare operations', 'Figma']

export default function MindPortfolioPage() {
  const reduced = useReducedMotion()
  // Onboarding plays only on the bare homepage URL; any deep link goes straight in.
  const [entered, setEntered] = useState(() => location.pathname !== '/' || !!location.hash)
  const [preparing, setPreparing] = useState(false) // the interior mounts under the entrance portal
  const work = useRef(null)
  const showcase = useShowcaseRoute(zoomExplorations)

  const enter = useCallback(() => {
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

  const project = zoomExplorations.find(item => item.id === showcase.id)

  return <div className="mind-site" data-reduced={reduced} data-active-project={project?.id}>
    {!entered && <EntranceScene onEnter={enter} onPrepare={() => setPreparing(true)} reduced={reduced} />}
    {(entered || preparing) && <div className="mind-interior" inert={entered ? undefined : ''}>
      <div className="mind-work-bg" aria-hidden="true"><img className="mind-work-bg__statue" src="/images/entrance/statue-floral-cutout.png" alt="" width="1024" height="1536" /></div>
      <a className="mind-skip" href="#gallery">Skip to the work</a>
      <SiteNav theme="mind" current="home" />
      <main id="work" ref={work} tabIndex={-1}>
        <section id="gallery" aria-label="Selected work">
          <Stage prototypes={zoomExplorations} cases={workCases} reduced={reduced} suspended={!!project} onOpen={showcase.open}
            masthead={<div className="stage__name"><h1>Petkov Chakalov</h1><p className="mind-label">Design engineer · Lagos</p></div>} />
        </section>
        <section id="about" className="mind-about mind-section">
          <div>
            <p className="mind-label">About</p>
            <h2>Still<br /><Highlight>curious.</Highlight></h2>
            <Annotation tone="pink">A builder, before anything.</Annotation>
          </div>
          <div className="mind-about__story">
            <img src="/images/notes/nigeria-childhood.png" alt="Petkov as a child, smiling on a lawn in Nigeria" loading="lazy" width="240" height="280" />
            <p>I’m Petkov Chakalov, a design engineer based in Lagos. I grew up around systems that fail and people who find a way through anyway.</p>
            <p>That is still how I work. Clear questions. Thoughtful software. Products that have to hold when the stakes are real, especially in healthcare and education.</p>
            <a className="mind-link" href="/notes">A little more about me ↗</a>
            <p className="mind-skills">{SKILLS.map(skill => <span key={skill}>{skill}</span>)}</p>
          </div>
        </section>
      </main>
      <footer className="mind-footer">
        <span className="mind-label">Good things start with a conversation.</span>
        <a href={`mailto:${EMAIL}`}>What are you<br /><Highlight>thinking?</Highlight><span aria-hidden="true">↗</span></a>
        <div>
          <span>© 2026 Petkov Chakalov</span><span>Lagos, Nigeria</span>
          <a href={`mailto:${EMAIL}`}>Email ↗</a>
          <a href="https://github.com/petkov120" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={`mailto:${EMAIL}?subject=Resume%20request`}>Resume ↗</a>
        </div>
      </footer>
    </div>}
    {project && <Suspense fallback={<div className="mind-reader-loading" role="status">Opening project…</div>}>
      <InteractionShowcase item={project} projects={zoomExplorations} origin={showcase.entry?.rect} initialScreen={showcase.entry?.id === project.id ? showcase.entry.screen : undefined}
        reduced={reduced} closing={showcase.closing} onClose={showcase.requestClose} onExited={showcase.finishClose} onProjectChange={showcase.change} getReturnRect={showcase.getReturnRect} />
    </Suspense>}
  </div>
}
