import CaseStudyPage from '../components/case/CaseStudyPage'
import { investigations } from '../data/investigations'
import { clinifyEvidence } from '../data/clinifyEvidence'

const inv = investigations.find((i) => i.slug === 'clinify')

export default function ClinifyPage() {
  return <CaseStudyPage investigation={inv} content={clinifyEvidence} />
}
