import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import ScrollReveal from '../components/motion/ScrollReveal'
import '../components/mind/home.css'
import '../components/hydra/hydra.css'
import '../components/hydra/quickhand.css'

const IMG = '/images/playground/'

const Win = ({ src, className = '', style, children }) => (
  <div className={`qh-win ${className}`} style={style}>{children ?? <img src={IMG + src} alt="" />}</div>
)

const screens = [
  {
    id: 'offerings', label: 'Offerings', note: 'Setup',
    purpose: 'A provider describes what they do, what they charge, and where they work, one step at a time.',
    tag: 'Step 01 / Create offerings',
    stage: <Win src="quickhand-onboard-2.webp" style={{ left: '15%', top: '9.5%', width: '70%' }} />,
  },
  {
    id: 'onboarding', label: 'Choose a trade', note: 'Mobile + desktop',
    purpose: 'The category picker on a phone and on desktop: pick a trade, see progress, move on.',
    tag: 'Step 02 / Pick categories',
    stage: <>
      <Win src="quickhand-onboarding-grid.webp" className="qh-win--crop" style={{ left: '31%', top: '10%', width: '58%', height: '73%' }}>
        <div className="qh-view"><img src={IMG + 'quickhand-onboarding-grid.webp'} alt="" /></div>
      </Win>
      <div className="qh-phone" style={{ left: '12%', top: '11%', width: '19%' }}><img src={IMG + 'quickhand-mobile-onboarding.webp'} alt="" /></div>
    </>,
  },
  {
    id: 'profile', label: 'Provider profile', note: 'Trust',
    purpose: 'Pricing clarity and proof of work, so a customer can trust the person before the first message.',
    tag: 'Step 03 / Book with confidence',
    stage: <>
      <Win src="quickhand-carpenter-profile.webp" className="qh-win--crop" style={{ left: '8%', top: '9%', width: '66%', height: '78%' }}>
        <div className="qh-view"><img src={IMG + 'quickhand-carpenter-profile.webp'} alt="" /></div>
      </Win>
      <div className="qh-card" style={{
        right: '5%', bottom: '8%', width: '25%', aspectRatio: '1.054',
        backgroundImage: `url(${IMG}quickhand-carpenter-profile.webp)`, backgroundSize: '285.7% auto', backgroundPosition: '90.8% 19.7%',
      }} />
    </>,
  },
]

export default function QuickHandPage() {
  return (
    <div className="mind-site">
      <div className="mind-interior" style={{ '--accent': '#ff6a2b' }}>
        <SiteNav theme="mind" current="work" />
        <header className="hp-intro hp-intro--race">
          <span className="mind-label">QuickHand / Service providers / 2026</span>
          <h1>Quick<span>Hand</span></h1>
          <p>An onboarding flow for local service providers: from picking a trade to a profile customers can trust.</p>
        </header>
        <main className="hp-shots">
          {screens.map((screen, index) => (
            <ScrollReveal as="figure" className="hp-shot" key={screen.id}>
              <div className="qh-stage" role="img" aria-label={`${screen.label}: ${screen.purpose}`}>
                {screen.stage}
                <span className="qh-tag"><b>●</b> {screen.tag}</span>
              </div>
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
