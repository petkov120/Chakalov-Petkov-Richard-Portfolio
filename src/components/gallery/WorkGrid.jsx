import './work-grid.css'

function WorkGridList({ items }) {
  return (
    <ul className="work-grid__list">
      {items.map((item, index) => (
        <li key={item.id} className="work-grid__item" style={{ '--tilt': index % 2 === 0 ? '-0.6deg' : '0.5deg' }}>
          <a href={item.href} className="work-grid__card" aria-label={`View ${item.name}`}>
            <figure>
              <img src={item.src} alt={item.alt ?? ''} loading="lazy" decoding="async" />
              <figcaption>
                <strong>{item.name}</strong>
                <em>{item.blurb ?? item.field}</em>
              </figcaption>
            </figure>
          </a>
        </li>
      ))}
    </ul>
  )
}

// When `title` is omitted, only the bare list renders — the caller owns the
// section wrapper and header (e.g. to add a filter toggle above the grid).
export default function WorkGrid({ id, kicker, title, note, items }) {
  if (!title) return <WorkGridList items={items} />

  return (
    <section className="work-grid" aria-labelledby={id}>
      <header className="work-grid__header">
        {kicker && <p className="work-grid__kicker">{kicker}</p>}
        <h2 id={id}>{title}</h2>
        {note && <p className="work-grid__note">{note}</p>}
      </header>
      <WorkGridList items={items} />
    </section>
  )
}
