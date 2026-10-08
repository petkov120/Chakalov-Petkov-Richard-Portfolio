// One source for the facts a hiring manager reads: the About section and /resume both render this.
export const EMAIL = 'petkovrichard8@gmail.com'
export const GITHUB = 'https://github.com/petkov120'
export const LINKEDIN = '' // add the profile URL to show it in the footer, About and resume

export const SKILLS = ['Product design', 'UX systems', 'React', 'TypeScript', 'Frontend implementation', 'AI workflows', 'Healthcare operations', 'Figma']

export const FACTS = [
  { label: 'Now', value: 'Clinify', role: 'Founding designer and design engineer, 2024 to now', detail: 'Enterprise AI care platform, MVP to production in 18 months, 2 paying B2B customers.' },
  { label: 'Before', value: 'UniversityX', role: 'Product designer, 2021 to 2023', detail: 'AI tutoring used across 3 institutions. Came back in 2024 to win Wema Bank Hackaholics 5.0 (NGN 10M).' },
  { label: 'Works across', value: 'Research, UX and UI, then production frontend in React and TypeScript.' },
]

export const EXPERIENCE = [
  {
    company: 'Clinify', role: 'Founding designer and design engineer', dates: '2024 to now', href: '/clinify',
    summary: 'Care operations platform for health plans: member context, outreach campaigns, and email, SMS and AI voice in one workspace.',
    points: [
      'Owned UX and UI from research to shipped product, then moved into production frontend alongside engineering',
      'Took the product from MVP to production in 18 months; 2 paying B2B customers run it today',
      'Unified three communication channels into one workspace, with human approval before any patient contact (HIPAA)',
      'Team of 2 engineers, 1 PM, and me as founding designer',
    ],
  },
  {
    company: 'UniversityX', role: 'Product designer', dates: '2021 to 2023 · rejoined 2024', href: '/universityx',
    summary: 'AI tutoring platform built for understanding, not just answers. Used across Covenant University, LASU and a polytechnic partner.',
    points: [
      'Designed the product from the first learning platform through the 2022 shift to AI tutoring',
      'Shaped the tutoring model around comprehension: adapting explanations when confidence dropped',
      'Rejoined in 2024 for Wema Bank Hackaholics 5.0; the team won the NGN 10,000,000 prize',
      'Contributed to projects with NGN 30M+ in awards',
    ],
  },
]
