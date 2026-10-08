import { lazy, Suspense, useEffect } from 'react'
import MindPortfolioPage from './pages/MindPortfolioPage'
import { roomThemes } from './data/investigations'

const ClinifyPage = lazy(() => import('./pages/ClinifyPage'))
const UniversityXPage = lazy(() => import('./pages/UniversityXPage'))
const NotesPage = lazy(() => import('./pages/NotesPage'))
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'))
const NowPage = lazy(() => import('./pages/NowPage'))
const UIStudioPage = lazy(() => import('./pages/UIStudioPage'))
const WorkPage = lazy(() => import('./pages/WorkPage'))
const HydraPage = lazy(() => import('./pages/HydraPage'))
const KestbookPage = lazy(() => import('./pages/KestbookPage'))
const EfootballPage = lazy(() => import('./pages/EfootballPage'))
const QuickHandPage = lazy(() => import('./pages/QuickHandPage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const GlobalContactCTA = lazy(() => import('./components/layout/GlobalContactCTA'))

const routes = {
  '/': MindPortfolioPage,
  '/work/clinify': ClinifyPage,
  '/interactions': MindPortfolioPage,
  '/interactions/card-removal': MindPortfolioPage,
  '/interactions/social': MindPortfolioPage,
  '/interactions/investment': MindPortfolioPage,
  '/interactions/notepad': MindPortfolioPage,
  '/hydra': HydraPage,
  '/kestbook': KestbookPage,
  '/efootball': EfootballPage,
  '/quickhand': QuickHandPage,
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
  '/resume': ResumePage,
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
      window.history.replaceState({}, '', '/#work')
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

    if (Page === MindPortfolioPage || Page === HydraPage || Page === KestbookPage || Page === EfootballPage || Page === QuickHandPage || Page === NotesPage || Page === WorkPage || Page === ClinifyPage || Page === UniversityXPage || Page === ResumePage) {
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
    <Suspense fallback={<div className="app-route-loading" role="status">Loading…</div>}>
      <Page />
      {Page !== MindPortfolioPage && Page !== HydraPage && Page !== KestbookPage && Page !== EfootballPage && Page !== QuickHandPage && Page !== NotesPage && Page !== WorkPage && Page !== ClinifyPage && Page !== UniversityXPage && pathname !== '/ui' && Page !== ResumePage && <GlobalContactCTA />}
    </Suspense>
  )
}
