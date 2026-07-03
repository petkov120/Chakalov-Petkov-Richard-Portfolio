import InvestigationPage from '../components/investigation/InvestigationPage'
import { investigations } from '../data/investigations'
import { universityxEvidence } from '../data/universityxEvidence'

const inv = investigations.find((i) => i.slug === 'universityx')

export default function UniversityXPage() {
  return <InvestigationPage investigation={inv} content={universityxEvidence} />
}
