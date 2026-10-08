import CaseStudyPage from '../components/case/CaseStudyPage'
import { investigations } from '../data/investigations'
import { universityxEvidence } from '../data/universityxEvidence'

const inv = investigations.find((i) => i.slug === 'universityx')

export default function UniversityXPage() {
  return <CaseStudyPage investigation={inv} content={universityxEvidence} />
}
