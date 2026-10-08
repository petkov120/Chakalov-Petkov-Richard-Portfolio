// The gallery is a flat list of entries, grouped by how much weight each piece carries:
// shipped work first, then prototypes, then side projects. A visitor who only looks at the
// first card should land on the strongest evidence.

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live work' },
  { id: 'prototype', label: 'Prototypes' },
  { id: 'side', label: 'Side projects' },
]

const GROUP_ORDER = ['live', 'prototype', 'side']

const fromPrototype = item => ({
  key: item.id, type: 'phone', group: 'prototype', data: item,
  kind: 'Prototype', name: item.name, line: item.summary,
  note: item.status === 'Flow study' ? `Early flow study · ${item.year}` : `${item.status} · ${item.year}`,
  accent: item.accent, cta: 'Open prototype',
})

const fromCase = item => ({
  key: item.id, type: 'tile', group: item.origin === 'Live Work' ? 'live' : 'side', data: item,
  kind: item.origin === 'Live Work' ? 'Live work' : 'Side project', name: item.name, line: item.blurb, note: item.proof,
  credit: [item.role, item.year].filter(Boolean).join(' · '),
  accent: item.accent, cta: item.cta ?? 'View case study', href: item.href,
})

export function buildWall(prototypes, cases) {
  const entries = [...prototypes.map(fromPrototype), ...cases.map(fromCase)]
  return GROUP_ORDER.flatMap(group => entries.filter(entry => entry.group === group))
}
