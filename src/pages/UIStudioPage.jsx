import { useEffect, useMemo, useState } from 'react'
import { uiProjects } from '../ui/projectRegistry'
import '../ui/studio.css'

export default function UIStudioPage() {
  const [projectId, setProjectId] = useState(uiProjects[0].id)
  const [screenIndex, setScreenIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const project = useMemo(
    () => uiProjects.find((item) => item.id === projectId) ?? uiProjects[0],
    [projectId],
  )
  const screen = project.screens[screenIndex] ?? project.screens[0]
  const Preview = project.Component

  useEffect(() => {
    setScreenIndex(0)
    setIsPlaying(false)
  }, [projectId])

  useEffect(() => {
    if (!isPlaying) return undefined
    if (project.screens[screenIndex]?.id === 'splash') return undefined
    const timer = window.setTimeout(() => {
      setScreenIndex((index) => (index + 1) % project.screens.length)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [isPlaying, screenIndex, project.screens])

  return (
    <main className="ui-studio">
      <header className="ui-studio__header">
        <div>
          <span className="ui-studio__eyebrow">Local interaction workbench</span>
          <h1>UI studio</h1>
        </div>
        <a href="/">Return to portfolio</a>
      </header>

      <div className="ui-studio__layout">
        <aside className="ui-studio__sidebar">
          <section>
            <h2>Projects</h2>
            <nav aria-label="UI projects">
              {uiProjects.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === project.id ? 'is-active' : ''}
                  onClick={() => setProjectId(item.id)}
                >
                  <span>0{index + 1}</span>{item.name}
                </button>
              ))}
            </nav>
          </section>

          <section className="ui-studio__instructions">
            <h2>Working file</h2>
            <code>src/ui/projects/{project.name}UI.jsx</code>
            <p>Edit the component and save. Vite refreshes the phone preview immediately.</p>
          </section>
        </aside>

        <section className="ui-studio__stage" aria-label={`${project.name} preview`}>
          <div className="ui-studio__phone">
            <div className="ui-studio__phone-screen" key={project.id}>
              <Preview
                screen={screen.id}
                onScreenChange={(screenId) => {
                  const nextIndex = project.screens.findIndex((item) => item.id === screenId)
                  if (nextIndex >= 0) setScreenIndex(nextIndex)
                }}
              />
            </div>
          </div>
        </section>

        <aside className="ui-studio__controls">
          <section>
            <div className="ui-studio__section-head">
              <h2>Sequence</h2>
              <button type="button" onClick={() => setIsPlaying((value) => !value)}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
            <ol>
              {project.screens.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={index === screenIndex ? 'is-active' : ''}
                    onClick={() => {
                      setScreenIndex(index)
                      setIsPlaying(false)
                    }}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{item.label}</strong><small>{item.purpose}</small></div>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <section className="ui-studio__export-note">
            <h2>When it is ready</h2>
            <p>Record the phone canvas and save the final MP4 as:</p>
            <code>ui/{project.id}/final.mp4</code>
          </section>
        </aside>
      </div>
    </main>
  )
}
