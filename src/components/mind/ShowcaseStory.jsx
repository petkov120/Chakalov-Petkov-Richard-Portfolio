import { useCallback, useEffect, useRef, useState } from 'react'
import MindPhone from './MindPhone'
import StudioInteractionPreview from './StudioInteractionPreview'
import ScrollZoomBeat from './ScrollZoomBeat'

export default function ShowcaseStory({
  item,
  scrollRoot,
  reduced,
  closing,
  phase,
  replay,
  onReplay,
  screen,
  onScreenChange,
}) {
  const corridorPhone = useRef(null)
  const beatTravel = useRef([])
  const lastBeat = useRef(-1)
  const lastScreen = useRef('')
  const [activeBeat, setActiveBeat] = useState(-1)

  useEffect(() => {
    beatTravel.current = []
    lastBeat.current = -1
    const initial = item.story[0]?.screen || item.posterScreen
    lastScreen.current = initial
    setActiveBeat(-1)
    onScreenChange(initial)
  }, [item.id, item.story, item.posterScreen, onScreenChange])

  const handleTravel = useCallback((index, travel, p) => {
    beatTravel.current[index] = { travel, p }
    let best = -1
    let bestScore = -1
    item.story.forEach((part, i) => {
      const beat = beatTravel.current[i]
      if (!beat || beat.travel < 0.28) return
      const score = beat.travel * (beat.p > 0.08 && beat.p < 0.92 ? 1 : 0.35)
      if (score > bestScore) {
        bestScore = score
        best = i
      }
    })
    if (best >= 0 && item.story[best]?.screen) {
      const next = item.story[best].screen
      if (best !== lastBeat.current) {
        lastBeat.current = best
        setActiveBeat(best)
      }
      if (next !== lastScreen.current) {
        lastScreen.current = next
        onScreenChange(next)
      }
    }
  }, [item.story, onScreenChange])

  const screenMeta = item.screens.find(state => state.id === screen) || item.screens[0]
  const suspended = closing || phase !== 'ready'

  return (
    <section id="showcase-story" className="mind-showcase__story">
      <div className="mind-showcase__story-heading">
        <span className="mind-label">The thinking behind it</span>
        <h2>{item.title}</h2>
        <p className="mind-showcase__story-lead">Scroll each thought. The preview maps to the moment you zoom into.</p>
      </div>

      {item.progress && (
        <p className="mind-showcase__progress">
          <span className="mind-label">In progress</span>
          {item.progress}
        </p>
      )}

      <div className="mind-showcase__corridor">
        <div className="mind-showcase__corridor-aside">
          <div ref={corridorPhone} className="mind-showcase__corridor-phone">
            <MindPhone className="mind-phone--showcase mind-phone--corridor" screenClassName="mind-phone__screen--live">
              <StudioInteractionPreview
                key={`${item.id}-${screen}`}
                item={item}
                initialScreen={screen}
                screenOverride={screen}
                playing={false}
                replayToken={replay}
              />
            </MindPhone>
            <div className="mind-showcase__corridor-caption">
              <span className="mind-label">{activeBeat >= 0 ? `Beat ${String(activeBeat + 1).padStart(2, '0')}` : 'Preview'}</span>
              <strong>{screenMeta.label}</strong>
              <button type="button" onClick={onReplay} aria-label="Replay mapped screen">↻</button>
            </div>
          </div>

          <aside className="mind-showcase__principles">
            <span className="mind-label">What matters</span>
            {item.principles.map((principle, i) => (
              <p key={principle}>
                <span>0{i + 1}</span>
                {principle}
              </p>
            ))}
          </aside>
        </div>

        <div className="mind-showcase__corridor-beats">
          {item.story.map((part, index) => (
            <ScrollZoomBeat
              key={part.title}
              part={part}
              index={index}
              total={item.story.length}
              scrollRoot={scrollRoot}
              reduced={reduced}
              suspended={suspended}
              onTravel={handleTravel}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
