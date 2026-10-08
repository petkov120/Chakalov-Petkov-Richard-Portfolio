import { useEffect, useMemo, useRef, useState } from 'react'
import './notepad.css'
import './notepad-personality.css'

const screens = [
  { id: 'notes', label: 'Notes', purpose: 'Find the right thought quickly' },
  { id: 'quick-capture', label: 'Quick capture', purpose: 'Write before the thought disappears' },
  { id: 'organise', label: 'Organise', purpose: 'Add only the structure that helps later' },
  { id: 'saved', label: 'Saved', purpose: 'Trust that the thought is findable' },
]

const seedNotes = [
  { id: 1, title: 'Let them look around first', body: 'The product should earn the sign-up. Show one useful moment before asking for an email.', time: '9:24 AM', tag: 'Product', pinned: true, tint: 'amber' },
  { id: 2, title: 'Motion needs a reason', body: 'A transition should answer two things: where did this come from, and where can I find it again?', time: 'Yesterday', tag: 'Design', pinned: true, tint: 'blue' },
  { id: 3, title: 'Before I forget', body: 'Pick up the A3 prints · Call Mum · Send Ada the revised prototype', time: 'Thu', tag: 'Life', tint: 'green' },
  { id: 4, title: 'Read with a pencil', body: 'The Shape of Design · The Creative Act · A Pattern Language', time: 'Tue', tag: 'Reading', tint: 'violet' },
  { id: 5, title: 'The portfolio is a place', body: 'Less archive, more studio. Let the work move, respond, and explain itself.', time: 'Mon', tag: 'Ideas', tint: 'amber' },
]
const penFor = tag => ({ Product: 0, Design: 1, Life: 2, Reading: 3, Ideas: 0 }[tag] ?? 0)

const paths = {
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5', compose: 'M13.5 5.5 18.5 10.5M4 20l3.5-.8L20 6.7a1.8 1.8 0 0 0 0-2.5l-.2-.2a1.8 1.8 0 0 0-2.5 0L5 16.5 4 20Z',
  back: 'm15 5-7 7 7 7', more: 'M5 12h.01M12 12h.01M19 12h.01', check: 'm5 12 4.5 4.5L19 7', tag: 'M20 13 13 20 4 11V4h7l9 9ZM8 8h.01',
  pin: 'm14 4 6 6-3 1-4 4-1 5-2-2-4-4-2-2 5-1 4-4 1-3Z', folder: 'M3 6h7l2 2h9v11H3Z', chevron: 'm9 6 6 6-6 6', close: 'm6 6 12 12M18 6 6 18',
}
function Icon({ name, size = 21, stroke = 1.8 }) { return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path d={paths[name]} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" /></svg> }
function StatusBar() { return <div className="np-status"><strong>9:41</strong><span className="np-island" /><span className="np-signals"><i /><i /><b /></span></div> }

function NotesList({ onCompose, onOpen }) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const filtered = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (!words.length) return seedNotes
    const aliases = { work: ['design', 'portfolio', 'product'], idea: ['ideas', 'reason'], ideas: ['ideas', 'reason'], todo: ['life', 'pick up', 'call'], books: ['reading', 'pencil'] }
    return seedNotes.map(note => {
      const haystack = `${note.title} ${note.body} ${note.tag}`.toLowerCase()
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 3 : (aliases[word] || []).some(alias => haystack.includes(alias)) ? 1 : -20), 0) + (note.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 0)
      return { note, score }
    }).filter(result => result.score >= 0).sort((a, b) => b.score - a.score).map(result => result.note)
  }, [query])
  const pinned = filtered.filter(note => note.pinned), recent = filtered.filter(note => !note.pinned)
  return <section className="np-screen np-list-screen">
    <header className="np-list-head"><div><span className="np-kicker">My notes</span><h1>Notes</h1></div><button className="np-avatar" type="button" aria-label="Account">PC</button></header>
    <div className="np-search-wrap"><label className="np-search"><Icon name="search" size={17} /><input value={query} onFocus={() => setSearchOpen(true)} onBlur={() => setTimeout(() => setSearchOpen(false), 120)} onChange={event => setQuery(event.target.value)} placeholder="Search words, tags, or moments" />{query ? <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={14} /></button> : <kbd>⌘ K</kbd>}</label>
      {searchOpen && <div className="np-search-popover"><div className="np-search-summary"><strong>{query ? `${filtered.length} ${filtered.length === 1 ? 'note' : 'notes'}` : 'Quick filters'}</strong>{query && <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => setQuery('')}>Clear</button>}</div>{!query && <div className="np-suggestions">{[['work', 'Work'], ['ideas', 'Ideas'], ['todo', 'Tasks'], ['books', 'Reading']].map(([term, label]) => <button type="button" key={term} onMouseDown={event => event.preventDefault()} onClick={() => setQuery(term)}>{label}</button>)}</div>}{query && <span className="np-search-scope">Titles, text and labels</span>}</div>}
    </div>
    <div className="np-filter-row"><button className="is-on" type="button">All notes <span>{seedNotes.length}</span></button><button type="button"><Icon name="folder" size={15} /> Folders</button></div>
    <main className="np-scroll">{pinned.length > 0 && <NoteGroup label="Pinned" notes={pinned} onOpen={onOpen} />}{recent.length > 0 && <NoteGroup label="Recent" notes={recent} onOpen={onOpen} />}{!filtered.length && <div className="np-empty"><Icon name="search" size={26} /><strong>No notes found</strong><span>Try a different word or tag.</span></div>}</main>
    <footer className="np-bottom-bar"><span><strong>{seedNotes.length}</strong> notes</span><button className="np-compose" type="button" onClick={onCompose}><span>New note</span><Icon name="compose" size={17} stroke={2} /></button></footer>
  </section>
}
function NoteGroup({ label, notes, onOpen }) { return <section className="np-group"><div className="np-section-head"><h2>{label}</h2><button type="button">See all</button></div><div className="np-note-grid">{notes.map(note => <button className="np-note" data-tint={note.tint} data-pen={(note.id - 1) % 4} type="button" key={note.id} onClick={() => onOpen(note)}><span className="np-note__mark"><i className="np-pen-3d" aria-hidden="true" /></span><span className="np-note__copy"><strong>{note.title}</strong><p>{note.body}</p><span className="np-note__meta"><span className="np-tag">{note.tag}</span><time>{note.time}</time></span></span><Icon name="chevron" size={15} /></button>)}</div></section> }

function Editor({ draft, setDraft, onBack, onOrganise }) {
  const titleRef = useRef(null)
  useEffect(() => { const timer = setTimeout(() => titleRef.current?.focus(), 220); return () => clearTimeout(timer) }, [])
  const words = draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0
  return <section className="np-screen np-editor" data-pen={penFor(draft.tag)}><header className="np-toolbar"><button type="button" onClick={onBack} aria-label="Back to notes"><Icon name="back" /></button><span>Editing</span><button className="np-done" type="button" onClick={onOrganise}>Done</button></header><div className="np-editor-object" aria-hidden="true"><i className="np-pen-3d" /></div><main className="np-paper"><div className="np-date">Today, 9:41 AM</div><textarea ref={titleRef} className="np-title-input" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="Title" rows="1" /><textarea className="np-body-input" value={draft.body} onChange={event => setDraft({ ...draft, body: event.target.value })} placeholder="Start writing…" /></main><div className="np-editor-meta"><span>{words} {words === 1 ? 'word' : 'words'}</span><span>Saved locally</span></div><div className="np-format"><button type="button"><strong>Aa</strong></button><button type="button"><b>B</b></button><button type="button"><i>I</i></button><button type="button">☷</button><button type="button">✓</button><button type="button">＋</button></div></section>
}
function Organise({ draft, setDraft, onBack, onSave }) {
  const tags = ['Ideas', 'Product', 'Design', 'Life']
  return <section className="np-screen np-organise" data-pen={penFor(draft.tag)}><header className="np-toolbar"><button type="button" onClick={onBack} aria-label="Back to editor"><Icon name="back" /></button><span>Organise</span><button className="np-save" type="button" onClick={onSave}>Save</button></header><main><div className="np-preview-card"><i className="np-pen-3d" aria-hidden="true" /><span className="np-kicker">Preview</span><h2>{draft.title || 'Untitled note'}</h2><p>{draft.body || 'Your note will appear here.'}</p><span className="np-preview-time">Just now</span></div><section className="np-settings"><h3>Keep it findable</h3><button className="np-setting" type="button" onClick={() => setDraft({ ...draft, pinned: !draft.pinned })}><span className="np-setting__icon"><Icon name="pin" /></span><span><strong>Pin note</strong><small>Keep this at the top</small></span><i className={draft.pinned ? 'np-toggle is-on' : 'np-toggle'}><b /></i></button><div className="np-tags"><span><Icon name="tag" size={19} /> Tag</span><div>{tags.map(tag => <button type="button" className={draft.tag === tag ? 'is-on' : ''} key={tag} onClick={() => setDraft({ ...draft, tag })}>{tag}</button>)}</div></div><button className="np-setting" type="button"><span className="np-setting__icon"><Icon name="folder" /></span><span><strong>Move to folder</strong><small>Notes</small></span><Icon name="chevron" size={18} /></button></section></main></section>
}
function Saved({ draft, onDone, onEdit }) { return <section className="np-screen np-saved" data-pen={penFor(draft.tag)}><header className="np-toolbar"><button type="button" onClick={onDone} aria-label="Close"><Icon name="close" /></button><span>Saved</span><button type="button" onClick={onEdit} aria-label="More options"><Icon name="more" /></button></header><main><div className="np-saved-object"><i className="np-pen-3d" aria-hidden="true" /><span><Icon name="check" size={16} stroke={2.2} /></span></div><span className="np-kicker">Saved to Notes</span><h1>{draft.title || 'Untitled note'}</h1><p>{draft.body || 'Your note is ready when you need it.'}</p><div className="np-saved-meta">{draft.pinned && <span><Icon name="pin" size={14} /> Pinned</span>}<span><Icon name="tag" size={14} /> {draft.tag}</span><span>Just now</span></div><button className="np-primary" type="button" onClick={onDone}>Back to all notes</button><button className="np-secondary" type="button" onClick={onEdit}>Keep editing</button></main></section> }

export default function NotepadUI({ screen = 'notes', onScreenChange = () => {} }) {
  const [draft, setDraft] = useState({ title: '', body: '', tag: 'Ideas', pinned: false })
  const go = id => onScreenChange(id)
  const compose = () => { setDraft({ title: '', body: '', tag: 'Ideas', pinned: false }); go('quick-capture') }
  const open = note => { setDraft({ title: note.title, body: note.body, tag: note.tag, pinned: note.pinned }); go('quick-capture') }
  return <div className="notepad"><StatusBar />{screen === 'notes' && <NotesList onCompose={compose} onOpen={open} />}{screen === 'quick-capture' && <Editor draft={draft} setDraft={setDraft} onBack={() => go('notes')} onOrganise={() => go('organise')} />}{screen === 'organise' && <Organise draft={draft} setDraft={setDraft} onBack={() => go('quick-capture')} onSave={() => go('saved')} />}{screen === 'saved' && <Saved draft={draft} onDone={() => go('notes')} onEdit={() => go('quick-capture')} />}</div>
}
export { screens as notepadScreens }
