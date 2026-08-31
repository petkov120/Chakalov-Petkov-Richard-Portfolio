const screens = [
  { id: 'notes', label: 'Notes', purpose: 'Find the right thought quickly' },
  { id: 'quick-capture', label: 'Quick capture', purpose: 'Write before the thought disappears' },
  { id: 'organise', label: 'Organise', purpose: 'Add only the structure that helps later' },
  { id: 'saved', label: 'Saved', purpose: 'Trust that the thought is findable' },
]

export default function NotepadUI({ screen }) {
  const current = screens.find((item) => item.id === screen) ?? screens[0]

  return (
    <div className="ui-canvas ui-canvas--notepad">
      <div className="ui-canvas__status"><span>9:41</span><i /><span>•••</span></div>
      <main className="ui-canvas__blank">
        <span className="ui-canvas__project">Notepad</span>
        <div>
          <span className="ui-canvas__number">{String(screens.indexOf(current) + 1).padStart(2, '0')}</span>
          <h2>{current.label}</h2>
          <p>{current.purpose}</p>
        </div>
        <small>Replace this neutral canvas in NotepadUI.jsx</small>
      </main>
    </div>
  )
}

export { screens as notepadScreens }
