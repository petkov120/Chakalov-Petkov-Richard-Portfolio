import InvestigationPage from '../components/investigation/InvestigationPage'
import { investigations } from '../data/investigations'
import { treatmentpathEvidence } from '../data/treatmentpathEvidence'

const inv = investigations.find((i) => i.slug === 'treatmentpath')

export default function TreatmentPathPage() {
  return <InvestigationPage investigation={inv} content={treatmentpathEvidence} />
}
