import { useEffect } from 'react'
import IndexPage from './pages/IndexPage'
import ClinifyPage from './pages/ClinifyPage'
import UniversityXPage from './pages/UniversityXPage'
import TreatmentPathPage from './pages/TreatmentPathPage'
import NotesPage from './pages/NotesPage'
import PlaygroundPage from './pages/PlaygroundPage'
import NowPage from './pages/NowPage'
import GlobalContactCTA from './components/layout/GlobalContactCTA'
import { roomThemes } from './data/investigations'

const routes = {
  '/': IndexPage,
  '/clinify': ClinifyPage,
  '/universityx': UniversityXPage,
  '/treatmentpath': TreatmentPathPage,
  '/notes': NotesPage,
  '/principles': NotesPage,
  '/playground': PlaygroundPage,
  '/now': NowPage,
  '/about': NotesPage,
}

function getPathname() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return routes[path] ? path : '/'
}

export default function App() {
  const pathname = getPathname()
  const Page = routes[pathname]

  useEffect(() => {
    const body = document.body
    const allThemes = [
      'theme-vault',
      'theme-paper',
      'room-clinify',
      'room-universityx',
      'room-treatmentpath',
    ]
    body.classList.remove(...allThemes)

    const slug = pathname.slice(1)
    const room = roomThemes[slug]

    if (room) {
      body.classList.add(room)
    } else if (pathname === '/now') {
      body.classList.add('theme-paper')
    } else {
      body.classList.add('theme-vault')
    }
  }, [pathname])

  return (
    <>
      <Page />
      <GlobalContactCTA />
    </>
  )
}
