import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import ScrollReveal from '../components/motion/ScrollReveal'
import Artboard from '../components/hydra/Artboard'
import { hydraScreens } from '../components/hydra/screens'
import '../components/mind/home.css'
import '../components/hydra/hydra.css'

export default function HydraPage() {
  return (
    <div className="mind-site">
      <div className="mind-interior">
        <SiteNav theme="mind" current="work" />
        <header className="hp-intro">
          <span className="mind-label">Side project · Game UI · 2026</span>
          <h1>Hydra <span>Race</span></h1>
          <p>A racing game interface for desktop and console, from the first launch screen to the podium. Three of these screens are the original designs. The rest extend the same system.</p>
          <div className="hp-meta"><span>{hydraScreens.length} screens</span><span>Desktop · console</span><span>1920 × 1080</span><span>Controller-first</span></div>
        </header>
        <main className="hp-shots">
          {hydraScreens.map((screen, index) => (
            <ScrollReveal as="figure" className="hp-shot" key={screen.id}>
              <Artboard label={`${screen.label}: ${screen.purpose}`}>{screen.render()}</Artboard>
              <figcaption>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <strong>{screen.label}</strong>
                {screen.note ? <em>{screen.note}</em> : <span />}
                <p>{screen.purpose}</p>
              </figcaption>
            </ScrollReveal>
          ))}
        </main>
        <MindFooter />
      </div>
    </div>
  )
}
