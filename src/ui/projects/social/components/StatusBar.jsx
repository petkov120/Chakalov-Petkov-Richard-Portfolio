export default function StatusBar() {
  return (
    <div className="x-status">
      <b>10:11</b>
      <i />
      <span>
        <svg className="x-status__signal" viewBox="0 0 17 12" aria-hidden="true">
          <rect x="0" y="8" width="3.1" height="4" rx="0.7" fill="currentColor" />
          <rect x="4.6" y="5.4" width="3.1" height="6.6" rx="0.7" fill="currentColor" />
          <rect x="9.2" y="2.8" width="3.1" height="9.2" rx="0.7" fill="currentColor" />
          <rect x="13.8" y="0.4" width="3.1" height="11.6" rx="0.7" fill="currentColor" />
        </svg>
        <em>5G</em>
        <svg className="x-status__battery" viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.6" y="0.6" width="22.5" height="11.8" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <rect x="2.3" y="2.3" width="16.6" height="8.4" rx="1.3" fill="currentColor" />
          <path d="M24.6 4.2c1.1.6 1.1 4 0 4.6v-4.6z" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}
