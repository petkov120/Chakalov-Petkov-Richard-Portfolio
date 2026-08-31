import { useEffect } from 'react'
import IndexPage from './pages/IndexPage'
import ClinifyPage from './pages/ClinifyPage'
import UniversityXPage from './pages/UniversityXPage'
import NotesPage from './pages/NotesPage'
import PlaygroundPage from './pages/PlaygroundPage'
import NowPage from './pages/NowPage'
import UIStudioPage from './pages/UIStudioPage'
import GlobalContactCTA from './components/layout/GlobalContactCTA'
import { roomThemes } from './data/investigations'

const routes = {
  '/': IndexPage,
  '/investigations': IndexPage,
  '/clinify': ClinifyPage,
  '/universityx': UniversityXPage,
  '/notes': NotesPage,
  '/principles': NotesPage,
  '/playground': PlaygroundPage,
  '/now': NowPage,
  '/about': NotesPage,
  '/ui': UIStudioPage,
}

function getPathname() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/investigations') return '/'
  return routes[path] ? path : '/'
}

export default function App() {
  const pathname = getPathname()
  const Page = routes[pathname]

  useEffect(() => {
    const rawPath = window.location.pathname.replace(/\/$/, '')
    if (rawPath === '/investigations') {
      window.history.replaceState({}, '', '/#works')
    }
  }, [])

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
    } else if (pathname === '/' || pathname === '/now') {
      body.classList.add('theme-paper')
    } else {
      body.classList.add('theme-vault')
    }
  }, [pathname])

  return (
    <>
      <Page />
      {pathname !== '/' && pathname !== '/ui' && <GlobalContactCTA />}
    </>
  )
}
