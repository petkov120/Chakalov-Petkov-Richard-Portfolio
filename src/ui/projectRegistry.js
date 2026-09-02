import InvestmentUI, { investmentScreens } from './projects/InvestmentUI'
import NotepadUI, { notepadScreens } from './projects/NotepadUI'
import SocialUI, { socialScreens } from './projects/social/SocialUI'

export const uiProjects = [
  {
    id: 'investment',
    name: 'Investment',
    file: 'src/ui/projects/InvestmentUI.jsx',
    brief: '/ui/investment/brief.md',
    screens: investmentScreens,
    Component: InvestmentUI,
  },
  {
    id: 'notepad',
    name: 'Notepad',
    file: 'src/ui/projects/NotepadUI.jsx',
    brief: '/ui/notepad/brief.md',
    screens: notepadScreens,
    Component: NotepadUI,
  },
  {
    id: 'social',
    name: 'X redesign',
    file: 'src/ui/projects/social/SocialUI.jsx',
    brief: '/ui/social/brief.md',
    screens: socialScreens,
    Component: SocialUI,
  },
]
