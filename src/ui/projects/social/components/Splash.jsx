export default function Splash({ onEnter, onDone }) {
  return (
    <button
      className="x-splash"
      type="button"
      onClick={onEnter}
      onAnimationEnd={(event) => {
        if (event.animationName === 'x-splash-unveil') onDone()
      }}
      aria-label="Open X feed"
    >
      <span className="x-splash__atmosphere" aria-hidden="true" />
      <span className="x-splash__beam" aria-hidden="true" />
      <span className="x-splash__stage" aria-hidden="true">
        <span className="x-splash__trail x-splash__trail--one">𝕏</span>
        <span className="x-splash__trail x-splash__trail--two">𝕏</span>
        <span className="x-splash__mark" data-mark="𝕏">𝕏</span>
      </span>
      <span className="x-splash__flash" aria-hidden="true" />
      <small>Tap to enter</small>
    </button>
  )
}
