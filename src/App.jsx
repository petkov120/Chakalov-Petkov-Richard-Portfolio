import Hero from './components/Hero'
import ProjectIntro from './components/ProjectIntro'
import Chapter from './components/Chapter'
import Showcase from './components/Showcase'
import Stack from './components/Stack'
import OtherWork from './components/OtherWork'
import Footer from './components/Footer'
import AboutPage from './pages/AboutPage'
import { chapters } from './data/chapters'
import { showcaseItems } from './data/showcase'

export default function App() {
  const pathname = window.location.pathname

  if (pathname === '/about') {
    return <AboutPage />
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Hero />
      <ProjectIntro />

      {chapters.map((ch) => (
        <Chapter
          key={ch.number}
          number={ch.number}
          title={ch.title}
          decision={ch.decision}
          images={ch.images}
        >
          {ch.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Chapter>
      ))}

      <Showcase items={showcaseItems} />
      <Stack />
      <OtherWork />
      <Footer />
    </main>
  )
}
