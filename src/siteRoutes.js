export const PUBLIC_ROUTES = [
  '/',
  '/work',
  '/clinify',
  '/universityx',
  '/resume',
  '/about',
  '/notes',
  '/principles',
  '/now',
  '/hydra',
  '/kestbook',
  '/efootball',
  '/quickhand',
  '/playground',
  '/interactions',
  '/interactions/card-removal',
  '/interactions/social',
  '/interactions/investment',
  '/interactions/notepad',
]

const DEFAULT_META = {
  title: 'Petkov Chakalov — Design Engineer',
  description: 'Product design investigations into complex healthcare, AI and digital systems.',
}

export const PAGE_META = {
  '/': DEFAULT_META,
  '/work': {
    title: 'Selected Work — Petkov Chakalov',
    description: 'Shipped products, interactive prototypes and side projects by design engineer Petkov Chakalov.',
  },
  '/clinify': {
    title: 'Clinify Case Study — Petkov Chakalov',
    description: 'Designing and shipping an enterprise AI care platform used by paying healthcare customers.',
  },
  '/universityx': {
    title: 'UniversityX Case Study — Petkov Chakalov',
    description: 'Designing an AI tutoring platform used across three institutions and recognized at Wema Bank Hackaholics.',
  },
  '/resume': {
    title: 'Résumé — Petkov Chakalov',
    description: 'Experience, skills and selected product work from design engineer Petkov Chakalov.',
  },
  '/about': {
    title: 'About — Petkov Chakalov',
    description: 'The story behind Petkov Chakalov’s work across design, engineering, healthcare and education.',
  },
  '/notes': {
    title: 'Notes — Petkov Chakalov',
    description: 'Notes on curiosity, culture, product design and engineering.',
  },
  '/principles': {
    title: 'Design Principles — Petkov Chakalov',
    description: 'Notes and principles about building thoughtful software for complex systems.',
  },
  '/now': {
    title: 'Now — Petkov Chakalov',
    description: 'Current ideas, experiments and work in progress.',
  },
  '/hydra': {
    title: 'Hydra Racing — Petkov Chakalov',
    description: 'An interactive racing interface and engineering experiment.',
  },
  '/kestbook': {
    title: 'Kestbook — Petkov Chakalov',
    description: 'A property-record product concept designed and built by Petkov Chakalov.',
  },
  '/efootball': {
    title: 'eFootball UI — Petkov Chakalov',
    description: 'An interactive football interface and gameplay prototype.',
  },
  '/quickhand': {
    title: 'QuickHand — Petkov Chakalov',
    description: 'A service marketplace product and interface exploration.',
  },
  '/playground': {
    title: 'Playground — Petkov Chakalov',
    description: 'Interactive product, interface and engineering experiments.',
  },
}

export function normalizePathname(value = '/') {
  const pathname = value.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/'
  return pathname === '/investigations' ? '/' : pathname
}

export function metadataFor(pathname) {
  const normalized = normalizePathname(pathname)
  if (normalized.startsWith('/interactions/')) {
    return {
      title: 'Interaction Prototype — Petkov Chakalov',
      description: 'An interactive product prototype designed and built by Petkov Chakalov.',
    }
  }
  if (normalized === '/interactions') {
    return {
      title: 'Interaction Prototypes — Petkov Chakalov',
      description: 'Interactive product prototypes designed and built by Petkov Chakalov.',
    }
  }
  return PAGE_META[normalized] ?? DEFAULT_META
}

export function canonicalPath(pathname) {
  const normalized = normalizePathname(pathname)
  if (normalized === '/notes' || normalized === '/principles') return '/about'
  return normalized
}

export function bodyThemeFor(pathname) {
  const normalized = normalizePathname(pathname)
  if (normalized === '/now') return 'theme-paper'
  if (normalized === '/playground') return 'theme-vault'
  return 'theme-mind'
}
