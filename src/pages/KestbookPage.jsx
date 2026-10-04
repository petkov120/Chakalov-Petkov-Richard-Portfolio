import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import ScrollReveal from '../components/motion/ScrollReveal'
import Artboard from '../components/hydra/Artboard'
import '../components/mind/home.css'
import '../components/hydra/hydra.css'

const IMG = '/images/kestbook-new-ledger-replacement/'

const screens = [
  { id: 'dashboard', file: '01-dashboard.png', label: 'Dashboard', note: 'Overdue', purpose: 'The morning desk. Collected, due, and net sit above the people who need attention.' },
  { id: 'due', file: '02-dashboard-due-this-week.png', label: 'Due this week', purpose: 'The same desk, narrowed to what is coming due, with a reminder ready to send.' },
  { id: 'paid', file: '03-dashboard-recently-paid.png', label: 'Recently paid', purpose: 'Who already paid, so a landlord can confirm it and move on.' },
  { id: 'properties', file: '04-properties.png', label: 'Properties', purpose: 'Every building in the book. Open one to see the units and the money living there.' },
  { id: 'units', file: '05-units.png', label: 'Units', purpose: 'One property, unit by unit: who is in it, whether it is occupied, and the rent.' },
  { id: 'people', file: '06-people.png', label: 'People', purpose: 'Everyone linked to the properties — owners, tenants, caretakers — and what they owe.' },
  { id: 'documents', file: '07-documents.png', label: 'Documents', purpose: 'Receipts, notices, and agreements, kept with the people they belong to.' },
]

export default function KestbookPage() {
  return (
    <div className="mind-site">
      <div className="mind-interior">
        <SiteNav theme="mind" current="work" />
        <header className="hp-intro hp-intro--race">
          <span className="mind-label">Kestbook / Property books / 2026</span>
          <h1>Kest<span>book</span></h1>
        </header>
        <main className="hp-shots">
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
