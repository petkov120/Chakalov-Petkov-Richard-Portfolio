import { Annotation, Highlight } from './Marks'
import CaseStudyIDE from './CaseStudyIDE'
import { workCases } from '../../data/mind/projects'

export default function WorkCases({ onOpenClinify }) {
  return (
    <section id="cases" className="mind-works mind-section" aria-labelledby="mind-works-title">
      <div className="mind-section__meta">
        <span className="mind-label">02 / Work</span>
        <span className="mind-label">Selected studies</span>
      </div>
      <div className="mind-works__intro">
        <p className="mind-label">Stories you can open.</p>
        <h2 id="mind-works-title">The <Highlight>work</Highlight></h2>
        <Annotation>not a product page.<br />the actual studies.</Annotation>
      </div>
      <CaseStudyIDE items={workCases} onOpenItem={(item) => { if (item.id !== 'clinify') return false; onOpenClinify?.(); return true }} />
    </section>
  )
}
