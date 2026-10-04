import { useEffect } from 'react'
import MindPortfolioPage from './pages/MindPortfolioPage'
import ClinifyPage from './pages/ClinifyPage'
import UniversityXPage from './pages/UniversityXPage'
import NotesPage from './pages/NotesPage'
import PlaygroundPage from './pages/PlaygroundPage'
import NowPage from './pages/NowPage'
import UIStudioPage from './pages/UIStudioPage'
import WorkPage from './pages/WorkPage'
import HydraPage from './pages/HydraPage'
import GlobalContactCTA from './components/layout/GlobalContactCTA'
import { roomThemes } from './data/investigations'

const routes = {
  '/': MindPortfolioPage,
  '/work/clinify': ClinifyPage,
  '/interactions': MindPortfolioPage,
  '/interactions/card-removal': MindPortfolioPage,
  '/interactions/social': MindPortfolioPage,
  '/interactions/investment': MindPortfolioPage,
  '/interactions/notepad': MindPortfolioPage,
  '/hydra': HydraPage,
  '/investigations': MindPortfolioPage,
  '/clinify': ClinifyPage,
  '/universityx': UniversityXPage,
  '/notes': NotesPage,
  '/principles': NotesPage,
  '/playground': PlaygroundPage,
  '/now': NowPage,
  '/about': NotesPage,
  '/ui': UIStudioPage,
  '/work': WorkPage,
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
      'theme-mind',
      'theme-vault',
      'theme-paper',
      'theme-work',
      'room-clinify',
      'room-universityx',
      'room-treatmentpath',
    ]
    body.classList.remove(...allThemes)

    const slug = pathname.slice(1)
    const room = roomThemes[slug]

    if (Page === MindPortfolioPage || Page === HydraPage || Page === WorkPage) {
      body.classList.add('theme-mind')
    } else if (room) {
      body.classList.add(room)
    } else if (pathname === '/work') {
      body.classList.add('theme-work')
    } else if (pathname === '/' || pathname === '/now') {
      body.classList.add('theme-paper')
    } else {
      body.classList.add('theme-vault')
    }
  }, [pathname, Page])

  return (
    <>
      <Page />
      {Page !== MindPortfolioPage && Page !== HydraPage && Page !== WorkPage && pathname !== '/ui' && <GlobalContactCTA />}
    </>
  )
}
