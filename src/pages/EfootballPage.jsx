import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import ScrollReveal from '../components/motion/ScrollReveal'
import Artboard from '../components/hydra/Artboard'
import TrainingMode from '../components/efootball/TrainingMode'
import '../components/mind/home.css'
import '../components/hydra/hydra.css'

const IMG = '/images/efootball/'

const screens = [
  {
    id: 'home',
    file: 'home-screen.webp',
    label: 'Home Screen',
    note: 'Match day',
    purpose: 'The first stop for the player: mode entry, club identity, and match-day actions in one dramatic console frame.',
  },
  {
    id: 'team-select',
    file: 'team-select.webp',
    label: 'Team Select',
    purpose: 'A versus setup screen with clear team contrast, kit presence, and enough visual weight to feel like kickoff is close.',
  },
  {
    id: 'team-select-alt',
    file: 'team-select-1.webp',
    label: 'Team Select Alt',
    purpose: 'A second selection state for testing rhythm, focus, and how much information the player needs before confirming.',
  },
  {
    id: 'kickoff',
    file: 'kickoff-setting.webp',
    label: 'Kickoff Setting',
    purpose: 'The pre-match control layer: simple settings, quick confirmation, and no friction before the game starts.',
  },
  {
    id: 'lineup',
    file: 'line-up-screen.webp',
    label: 'Lineup Screen',
    purpose: 'Formation view for reading the squad, positions, and match setup before committing to the pitch.',
  },
]

export default function EfootballPage() {
  return (
    <div className="mind-site">
      <div className="mind-interior" style={{ '--accent': '#43d46b' }}>
        <SiteNav theme="mind" current="work" />
        <header className="hp-intro hp-intro--race">
          <span className="mind-label">eFootball UI / Console game screens / 2026</span>
          <h1>eFootball <span>UI</span></h1>
          <p>
            A compact match-day interface set: home, team selection, kickoff settings, and lineup
            screens designed around fast decisions and big sports energy.
          </p>
        </header>
        <main className="hp-shots">
          <TrainingMode />
          {screens.map((screen, index) => (
            <ScrollReveal as="figure" className="hp-shot" key={screen.id}>
              <Artboard label={`${screen.label}: ${screen.purpose}`}>
                <img className="hg-original" src={IMG + screen.file} alt="" />
              </Artboard>
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
