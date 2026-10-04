import { clinifyEvidence } from '../clinifyEvidence'

export const clinifyBook = {
  slug: 'clinify', title: 'Clinify', subtitle: 'Care is a human thing.', year: '2024 — now',
  role: 'Design engineering · Healthcare · Systems',
  pages: [
    { type: 'opening', label: '01 / CONTEXT', title: 'Design.\nFor real people.', body: clinifyEvidence.opening.overview, note: 'technology should give\ntime back to people.', facts: clinifyEvidence.opening.facts.slice(0, 3) },
    { type: 'image', label: '02 / THE WORKSPACE', title: 'One place to care.', image: '/images/clinify/member-communications.png', alt: 'Clinify member communications workspace with email, SMS, and AI call actions', body: clinifyEvidence.decisions[0].why, caption: 'FIG. 01 — The shared communication workspace.' },
    { type: 'text', label: '03 / THE QUESTION', title: 'Who should\nsee what?', body: clinifyEvidence.opening.problem, image: '/images/member-search.webp', alt: 'Clinify member ID search interface', note: 'Start with the person.\nThen design the system.' },
    { type: 'image', label: '04 / THE DECISION', title: 'A human starts it.', image: '/images/ai-agent-calls.webp', alt: 'Clinify recipient review and approval before initiating an AI call', body: clinifyEvidence.decisions[1].outcome, caption: 'FIG. 02 — Review before any patient contact.' },
    { type: 'text', label: '05 / MAKING IT REAL', title: 'Decisions,\nmade tangible.', body: clinifyEvidence.opening.context, items: clinifyEvidence.engineering.items, note: 'The details are the work.' },
    { type: 'results', label: '06 / IN THE WORLD', title: 'Confidence\nis the outcome.', metrics: clinifyEvidence.results.items.slice(0, 3), body: clinifyEvidence.closingQuote, link: { href: '/clinify', label: 'Read the complete evidence archive' } },
  ],
}

export const workCases = [
  {
    id: 'clinify',
    name: 'Clinify',
    field: 'Care, connected.',
    blurb: 'Enterprise AI care platform, shipped to paying customers.',
    proof: '18 months · MVP to production · Paying enterprise customers',
    src: '/images/clinify/work-card-thumbnail.png',
    alt: 'Clinify calling overview dashboard',
    href: '/work/clinify',
    origin: 'Live Work',
  },
  {
    id: 'universityx',
    name: 'UniversityX',
    field: 'A teacher, not a chatbot.',
    blurb: 'AI tutoring platform used across 3 institutions.',
    proof: '3 institutions · NGN 10M Hackaholics winner · NGN 30M+ awards contributed to',
    src: '/images/universityx/new-ai-tutor-interface.webp',
    alt: 'UniversityX AI tutor interface',
    href: '/universityx',
    origin: 'Live Work',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    field: 'Property, made calm.',
    blurb: 'A property ledger explored on the side.',
    src: '/images/playground/ledger-dashboard-empty-state.webp',
    alt: 'Ledger property dashboard empty state',
    href: '/playground',
    origin: 'Side Projects',
  },
  {
    id: 'hydra',
    name: 'Hydra',
    field: 'A game of momentum.',
    blurb: 'A game UI built for the fun of it.',
    src: '/images/playground/hydra-home-screen.webp',
    alt: 'Hydra game home interface',
    href: '/playground',
    origin: 'Side Projects',
  },
  {
    id: 'quickhand',
    name: 'QuickHand',
    field: 'Work, found by hand.',
    blurb: 'An onboarding flow for local service providers.',
    src: '/images/playground/quickhand-onboard-2.webp',
    alt: 'QuickHand offerings and onboarding',
    href: '/playground',
    origin: 'Side Projects',
  },
]

export { interactionProjects as zoomExplorations } from './interactions'

export const cardStudy = {
  slug: 'card-removal', title: 'Letting go, gently.', label: 'Virtual card removal',
  summary: 'A small interaction. A clearer decision.',
  notes: [
    { title: 'Core concept', body: 'Removing a card should make the result clear and leave room to change your mind. This is an interaction concept for the portfolio.' },
    { title: 'What changes', body: 'The selected card folds away. The space settles, a confirmation appears, and Undo stays available.' },
    { title: 'Why it works', body: 'Motion connects the action to its result. A persistent undo action gives the person control without a second confirmation screen.' },
    { title: 'Technical notes', body: 'A semantic React interface with CSS perspective and transform animation. The demonstration runs only while visible. Reduced motion keeps the same controls and feedback.' },
  ],
}
