import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'

export const COMPOSE_PRESET = 'The best interfaces don’t ask for attention. They return it.'

const LETTER_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]
const NUMBER_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['ABC', '.', ',', '?', '!', "'", '⌫'],
]
const SUGGESTIONS = ['I', 'The', 'I’m']

export default function Composer({ ready = false, onCancel, onChange, onPublish }) {
  const fieldRef = useRef(null)
  const [text, setText] = useState(ready ? COMPOSE_PRESET : '')
  const [shifted, setShifted] = useState(true)
  const [numeric, setNumeric] = useState(false)
  const remaining = Math.max(0, 280 - text.length)
  const canPost = text.trim().length > 0

  useEffect(() => {
    if (!ready || text.trim() !== '') return
    setText(COMPOSE_PRESET)
    onChange?.(COMPOSE_PRESET)
  }, [ready])

  useEffect(() => {
    fieldRef.current?.focus()
  }, [])

  const updateText = (next, caret) => {
    const clipped = next.slice(0, 280)
    setText(clipped)
    onChange?.(clipped)
    window.requestAnimationFrame(() => {
      const field = fieldRef.current
      if (!field) return
      const pos = caret ?? clipped.length
      field.focus()
      field.setSelectionRange(pos, pos)
    })
  }

  const insert = (chunk) => {
    const field = fieldRef.current
    const start = field?.selectionStart ?? text.length
    const end = field?.selectionEnd ?? text.length
    updateText(text.slice(0, start) + chunk + text.slice(end), start + chunk.length)
  }

  const handleKey = (key) => {
    if (key === '⇧') {
      setShifted((value) => !value)
      return
    }
    if (key === '123' || key === 'ABC') {
      setNumeric((value) => !value)
      return
    }
    if (key === '⌫') {
      const field = fieldRef.current
      const start = field?.selectionStart ?? text.length
      const end = field?.selectionEnd ?? text.length
      if (start !== end) {
        updateText(text.slice(0, start) + text.slice(end), start)
        return
      }
      updateText(text.slice(0, Math.max(0, start - 1)) + text.slice(end), Math.max(0, start - 1))
      return
    }
    if (key === 'space') {
      insert(' ')
      return
    }
    if (key === 'return') {
      insert('\n')
      return
    }
    const glyph = shifted ? key : key.toLowerCase()
    insert(glyph)
    if (shifted && key.length === 1 && /[A-Z]/i.test(key)) setShifted(false)
  }

  const insertSuggestion = (word) => {
    const needsSpace = text.length > 0 && !text.endsWith(' ') && !text.endsWith('\n')
    insert(`${needsSpace ? ' ' : ''}${word} `)
  }

  const pressKey = (event, key) => {
    event.preventDefault()
    handleKey(key)
  }

  const pressSuggestion = (event, word) => {
    event.preventDefault()
    insertSuggestion(word)
  }

  return (
    <div className="x-compose">
      <header>
        <button type="button" onClick={onCancel}>Cancel</button>
        <strong>New post</strong>
        <button type="button" className={canPost ? 'is-ready' : ''} onClick={canPost ? onPublish : undefined} disabled={!canPost}>Post</button>
      </header>
      <main>
        <Avatar tone="ink" initials="PC" />
        <div className="x-compose__field">
          <button type="button" className="x-compose__audience">Everyone⌄</button>
          <textarea
            ref={fieldRef}
            className={`x-compose__copy${canPost ? ' has-copy' : ''}`}
            value={text}
            placeholder="What’s happening?"
            maxLength={280}
            rows={4}
            aria-label="Post text"
            onChange={(event) => updateText(event.target.value, event.target.selectionStart)}
          />
          <span>◎ Everyone can reply</span>
        </div>
      </main>
      <div className="x-compose__tools">
        <span aria-hidden="true">▧</span>
        <span aria-hidden="true">◉</span>
        <span aria-hidden="true">GIF</span>
        <span aria-hidden="true">⌁</span>
        <i />
        <b>{remaining}</b>
      </div>
      <div className="x-keyboard">
        <div className="x-suggestions">
          {SUGGESTIONS.map((word) => (
            <button type="button" key={word} tabIndex={-1} onMouseDown={(event) => pressSuggestion(event, word)}>{word}</button>
          ))}
        </div>
        {(numeric ? NUMBER_ROWS : LETTER_ROWS).map((row) => (
          <div key={row.join('')} className={row[0] === '⇧' || row[0] === 'ABC' ? 'x-keyboard__shift-row' : undefined}>
            {row.map((key) => (
              <button
                type="button"
                key={key}
                className={key === '⇧' && shifted ? 'is-shifted' : key === '⌫' || key === '⇧' || key === 'ABC' ? 'is-modifier' : undefined}
                tabIndex={-1}
                onMouseDown={(event) => pressKey(event, key)}
              >
                {key === '⇧' || key === '⌫' || key === 'ABC' || numeric ? key : shifted ? key : key.toLowerCase()}
              </button>
            ))}
          </div>
        ))}
        <div className="x-keyboard__last">
          <button type="button" tabIndex={-1} onMouseDown={(event) => pressKey(event, numeric ? 'ABC' : '123')}>{numeric ? 'ABC' : '123'}</button>
          <button type="button" tabIndex={-1} onMouseDown={(event) => pressKey(event, 'space')}>space</button>
          <button type="button" tabIndex={-1} onMouseDown={(event) => pressKey(event, 'return')}>return</button>
        </div>
      </div>
    </div>
  )
}
