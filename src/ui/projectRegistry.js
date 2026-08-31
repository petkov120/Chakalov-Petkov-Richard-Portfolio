import InvestmentUI, { investmentScreens } from './projects/InvestmentUI'
import NotepadUI, { notepadScreens } from './projects/NotepadUI'
import SocialUI, { socialScreens } from './projects/SocialUI'

export const uiProjects = [
  {
    id: 'investment',
    name: 'Investment',
    brief: '/ui/investment/brief.md',
    screens: investmentScreens,
    Component: InvestmentUI,
  },
  {
    id: 'notepad',
    name: 'Notepad',
    brief: '/ui/notepad/brief.md',
    screens: notepadScreens,
    Component: NotepadUI,
  },
  {
    id: 'social',
    name: 'X redesign',
    brief: '/ui/social/brief.md',
    screens: socialScreens,
    Component: SocialUI,
  },
]
