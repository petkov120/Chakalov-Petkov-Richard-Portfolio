import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import ScrollReveal from '../components/motion/ScrollReveal'
import Artboard from '../components/hydra/Artboard'
import HydraRacingDemo from '../components/hydra/HydraRacingDemo'
import { hydraScreens } from '../components/hydra/screens'
import '../components/mind/home.css'
import '../components/hydra/hydra.css'

export default function HydraPage() {
  return (
    <div className="mind-site">
      <div className="mind-interior" style={{ '--accent': '#ff3b3b' }}>
        <SiteNav theme="mind" current="work" />
        <header className="hp-intro hp-intro--race">
          <span className="mind-label">Hydra Motorsport / 2026</span>
          <h1>Hydra <span>Race</span></h1>
        </header>
        <main className="hp-shots">
          <HydraRacingDemo />
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
