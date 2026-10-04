// The gallery is a flat list of entries. Prototypes (live UI) and case studies (screenshots)
// alternate so it never reads as two separate lists.

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live work' },
  { id: 'prototype', label: 'Prototypes' },
  { id: 'side', label: 'Side projects' },
]

const fromPrototype = item => ({
  key: item.id, type: 'phone', group: 'prototype', data: item,
  kind: 'Prototype', name: item.name, line: item.summary, note: `${item.status} · ${item.year}`,
  accent: item.accent, cta: 'Open prototype',
})

const fromCase = item => ({
  key: item.id, type: 'tile', group: item.origin === 'Live Work' ? 'live' : 'side', data: item,
  kind: item.origin === 'Live Work' ? 'Live work' : 'Side project', name: item.name, line: item.blurb, note: item.proof,
  accent: item.accent, cta: 'View case study', href: item.href,
})

export function buildWall(prototypes, cases) {
  // Live work first, then side projects.
  const ordered = [...cases.filter(c => c.origin === 'Live Work'), ...cases.filter(c => c.origin !== 'Live Work')]
  const wall = []
  prototypes.forEach((item, index) => {
    wall.push(fromPrototype(item))
    if (ordered[index]) wall.push(fromCase(ordered[index]))
  })
  ordered.slice(prototypes.length).forEach(item => wall.push(fromCase(item)))
  return wall
}
