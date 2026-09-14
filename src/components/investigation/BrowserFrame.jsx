import { useState } from 'react'
import './browser-frame.css'

export default function BrowserFrame({ screens = [], label = 'Screens', chrome = 'browser' }) {
  const [activeId, setActiveId] = useState(screens[0]?.id)
  const active = screens.find((screen) => screen.id === activeId) ?? screens[0]

  if (!screens.length) return null

  return (
    <div className={`browser-frame browser-frame--${chrome}`}>
      <div className="browser-frame__rail">
        <p className="browser-frame__rail-label">{label}</p>
        <ol>
          {screens.map((screen, index) => (
            <li key={screen.id}>
              <button
                type="button"
                className="browser-frame__rail-item"
                aria-current={screen.id === active?.id ? 'true' : undefined}
                onClick={() => setActiveId(screen.id)}
              >
                <span className="browser-frame__rail-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{screen.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="browser-frame__viewport">
        <div className="browser-frame__chrome" aria-hidden="true">
          <span className="browser-frame__dot browser-frame__dot--red" />
          <span className="browser-frame__dot browser-frame__dot--yellow" />
          <span className="browser-frame__dot browser-frame__dot--green" />
          <span className="browser-frame__url">{active?.path ?? active?.label}</span>
        </div>
        <div className="browser-frame__stage">
          {active?.src && (
            <img src={active.src} alt={active.alt ?? ''} loading="lazy" decoding="async" />
          )}
        </div>
        {active?.caption && <p className="browser-frame__caption">{active.caption}</p>}
      </div>
    </div>
  )
}
