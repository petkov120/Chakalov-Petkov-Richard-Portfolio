export const principles = [
  {
    number: '01',
    statement: 'Software should explain itself.',
    proof: 'If a care manager needs a training deck to use a feature, the interface failed. Every state, constraint, and next step should be readable in the UI.',
    ref: { label: 'Clinify · Fig. 2.1', href: '/clinify' },
  },
  {
    number: '02',
    statement: 'AI should remove work, not people.',
    proof: 'Automation that creates review queues without reducing cognitive load is not a product win. Design for the handoff: what the human still owns, and why.',
    ref: { label: 'UniversityX · AI tutor', href: '/universityx' },
  },
  {
    number: '03',
    statement: 'Design systems are products.',
    proof: 'Tokens, status language, and state machines are product decisions with clinical consequences. The system ships before the second screen.',
    ref: { label: 'Clinify · Call state machine', href: '/clinify' },
  },
  {
    number: '04',
    statement: 'Understanding the business matters more than beautiful screens.',
    proof: 'A HIPAA boundary killed the obvious list view. Browse was not allowed, only assigned access. The data model is a design input, not an engineering afterthought.',
    ref: { label: 'Clinify · Member search', href: '/clinify' },
  },
  {
    number: '05',
    statement: 'Every feature must earn its place.',
    proof: 'Channel selection moved to step one after watching a care manager rebuild an entire batch schedule. Features earn their place in the workflow.',
    ref: { label: 'Clinify · Fig. 1.5', href: '/clinify' },
  },
]
