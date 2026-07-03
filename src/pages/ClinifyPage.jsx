import InvestigationPage from '../components/investigation/InvestigationPage'
import { investigations } from '../data/investigations'
import { clinifyEvidence } from '../data/clinifyEvidence'

const inv = investigations.find((i) => i.slug === 'clinify')

export default function ClinifyPage() {
  return <InvestigationPage investigation={inv} content={clinifyEvidence} />
}
