// Shown while a route chunk downloads on client-rendered loads; prerendered pages paint their real HTML instead.
export default function RouteSkeleton() {
  return (
    <div className="route-skeleton" role="status" aria-live="polite">
      <span className="route-skeleton__sr">Loading page</span>
      <div className="route-skeleton__nav" aria-hidden="true">
        <i className="route-skeleton__brand" />
        <span>
          <i /><i /><i /><i />
        </span>
      </div>
      <div className="route-skeleton__body" aria-hidden="true">
        <i className="route-skeleton__eyebrow" />
        <i className="route-skeleton__title" />
        <i className="route-skeleton__line" />
        <i className="route-skeleton__line route-skeleton__line--short" />
        <span className="route-skeleton__chips">
          <i /><i /><i />
        </span>
        <i className="route-skeleton__plate" />
      </div>
    </div>
  )
}
