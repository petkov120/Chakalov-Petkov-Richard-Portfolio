import SiteNav from '../components/layout/SiteNav'
import MindFooter from '../components/layout/MindFooter'
import { EMAIL, EXPERIENCE, GITHUB, LINKEDIN, SKILLS } from '../data/mind/profile'
import '../components/mind/home.css'
import './resume.css'

// A plain, printable resume built from the same data as the site, so the two never disagree.
export default function ResumePage() {
  const links = [
    { label: EMAIL, href: `mailto:${EMAIL}` },
    { label: 'Portfolio', href: '/' },
    { label: 'GitHub', href: GITHUB },
    LINKEDIN && { label: 'LinkedIn', href: LINKEDIN },
  ].filter(Boolean)

  return (
    <div className="mind-site">
      <div className="mind-interior cv">
        <SiteNav theme="mind" current="resume" />
        <main className="cv__page">
          <header className="cv__head">
            <span className="mind-label">Resume / 2026</span>
            <h1>Petkov Chakalov</h1>
            <p className="cv__title">Design engineer · Lagos, Nigeria</p>
            <p className="cv__links">{links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}</p>
            <button className="cv__print" type="button" onClick={() => window.print()}>Download PDF <span aria-hidden="true">↓</span></button>
          </header>

          <div className="cv__body">
            <aside className="cv__aside">
              <section>
                <h2>Profile</h2>
                <p>Design engineer who takes AI products from research to production frontend. Founding designer at Clinify, an enterprise AI care platform with paying customers, and previously product designer at UniversityX, an AI tutoring platform used across 3 institutions and winner of Wema Bank Hackaholics 5.0.</p>
              </section>
              <section>
                <h2>Skills</h2>
                <p className="cv__skill-list">{SKILLS.map(skill => <span key={skill}>{skill}</span>)}</p>
              </section>
              <section>
                <h2>Also built</h2>
                <p>Working interface prototypes and side projects: Kestbook, Hydra, eFootball UI and QuickHand.</p>
              </section>
            </aside>

            <section className="cv__experience">
              <h2>Experience</h2>
              {EXPERIENCE.map(job => (
                <article className="cv__job" key={job.company}>
                  <div className="cv__job-head">
                    <h3>{job.company} <span>{job.role}</span></h3>
                    <p>{job.dates}</p>
                  </div>
                  <p className="cv__summary">{job.summary}</p>
                  <ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul>
                  <a className="cv__case" href={job.href}>Read the {job.company} case study <span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </section>
          </div>
        </main>
        <MindFooter />
      </div>
    </div>
  )
}
