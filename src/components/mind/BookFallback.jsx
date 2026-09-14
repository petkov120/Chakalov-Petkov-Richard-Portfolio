import { Component, useRef } from 'react'
import { useDialog } from './motion'

export class ReaderBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export default function BookFallback({ book, onClose }) {
  const ref = useRef(null)
  useDialog(ref, onClose)
  return <dialog ref={ref} className="mind-dialog mind-book-fallback" aria-labelledby="mind-fallback-title">
    <header className="mind-dialog__header"><h2 id="mind-fallback-title" className="mind-label">{book.title} / Reading edition</h2><button className="mind-text-button" onClick={onClose} autoFocus>Close book ×</button></header>
    <div className="mind-book-fallback__pages">{book.pages.map((page, index) => <article key={page.label}><span className="mind-label">{page.label}</span><h3>{page.title}</h3><p>{page.body}</p>{page.facts && <dl>{page.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>}{page.image && <figure><img src={page.image} alt={page.alt} loading="lazy" /><figcaption>{page.caption}</figcaption></figure>}{page.items && <ul>{page.items.map(item => <li key={item}>{item}</li>)}</ul>}{page.metrics && <dl>{page.metrics.map(metric => <div key={metric.value}><dt>{metric.value}</dt><dd>{metric.detail}</dd></div>)}</dl>}{page.note && <p className="mind-note">{page.note}</p>}{page.link && <a href={page.link.href}>{page.link.label} ↗</a>}<footer className="mind-label">{index + 1} / {book.pages.length}</footer></article>)}</div>
  </dialog>
}
