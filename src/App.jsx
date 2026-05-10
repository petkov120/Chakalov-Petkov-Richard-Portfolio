import Hero from './components/Hero'
import ProjectIntro from './components/ProjectIntro'
import Chapter from './components/Chapter'
import DesignSystemView from './components/DesignSystemView'
import Showcase from './components/Showcase'
import Stack from './components/Stack'
import OtherWork from './components/OtherWork'
import Footer from './components/Footer'
import AboutPage from './pages/AboutPage'
import { chapters } from './data/chapters'
import { showcaseItems } from './data/showcase'

function ChapterBlock({ ch }) {
  return (
    <Chapter
      number={ch.number}
      title={ch.title}
      decision={ch.decision}
      images={ch.images}
      signals={ch.signals}
    >
      {ch.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </Chapter>
  )
}

export default function App() {
  const pathname = window.location.pathname

  if (pathname === '/about') {
    return <AboutPage />
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Hero />
      <ProjectIntro />

      <ChapterBlock ch={chapters[0]} />
      <DesignSystemView />

      {chapters.slice(1).map((ch) => (
        <ChapterBlock key={ch.number} ch={ch} />
      ))}

      <Showcase items={showcaseItems} />
      <Stack />
      <OtherWork />
      <Footer />
    </main>
  )
}
