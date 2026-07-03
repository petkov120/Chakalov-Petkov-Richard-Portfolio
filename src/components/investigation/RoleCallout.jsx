const accentBorder = {
  clinify: 'border-clinify/35',
  universityx: 'border-universityx/35',
  treatmentpath: 'border-treatmentpath/35',
}

const accentLabel = {
  clinify: 'text-clinify',
  universityx: 'text-universityx',
  treatmentpath: 'text-treatmentpath',
}

export default function RoleCallout({ role, scope = [], accent = 'clinify' }) {
  if (!role) return null

  const borderClass = accentBorder[accent] ?? accentBorder.clinify
  const labelClass = accentLabel[accent] ?? accentLabel.clinify

  return (
    <aside
      className={`role-callout rounded-lg border bg-vault/40 px-4 py-4 md:px-5 md:py-5 ${borderClass}`}
      aria-label="My role on this project"
    >
      <p className={`dossier-label mb-2.5 ${labelClass}`}>
        My role
      </p>
      <p className="dossier-body text-pretty">
        {role}
      </p>
      {scope.length > 0 && (
        <ul className="role-callout__scope mt-4 space-y-2">
          {scope.map((item) => (
            <li
              key={item}
              className="dossier-meta-note normal-case tracking-normal text-[0.8125rem] pl-3 border-l border-vault-rule"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
