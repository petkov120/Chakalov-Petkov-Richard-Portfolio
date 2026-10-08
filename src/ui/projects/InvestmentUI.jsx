import { useEffect, useState } from 'react'
import './investment.css'
import { investmentScreens as screens } from './investmentScreens'

const holdings = [
  { ticker: 'DANGCEM', volume: '1.2M', cap: '₦10.4T', name: 'Dangote Cement', mark: 'DC', image: '/images/investment/holdings/dangote-cement.png', price: 612.5, change: 2.4, shares: 420, cost: 548.2, seed: 7, why: 'Cement volumes held through the quarter. The move is the price, not a new position.' },
  { ticker: 'MTNN', volume: '8.6M', cap: '₦5.2T', name: 'MTN Nigeria', mark: 'MT', image: '/images/investment/holdings/mtn-nigeria.png', price: 248, change: 1.6, shares: 8400, cost: 231.5, seed: 19, why: 'Data revenue carried the week. The price is higher, and the holding is the same.' },
  { ticker: 'GTCO', volume: '14.1M', cap: '₦1.6T', name: 'Guaranty Trust', mark: 'GT', image: '/images/investment/holdings/gtco.png', price: 54.8, change: -0.6, shares: 12000, cost: 57.1, seed: 31, why: 'The bank gave a little back after a strong month. You still hold the same shares.' },
  { ticker: 'SEPLAT', volume: '310K', cap: '₦2.9T', name: 'Seplat Energy', mark: 'SE', image: '/images/investment/holdings/seplat-energy.png', price: 4890, change: 4.3, shares: 240, cost: 4210, seed: 43, why: 'Energy prices firmed. The gain is on the shares you already own.' },
]

const CASH = 648800
const BUY_SHARES = 40
const BROKER_FEE = 123
const CSCS_FEE = 25
const value = (item) => item.shares * item.price
const bookValue = holdings.reduce((sum, item) => sum + value(item), 0)
const contribution = (item) => value(item) * (item.change / (100 + item.change))
const dayMove = holdings.reduce((sum, item) => sum + contribution(item), 0)
const total = bookValue + CASH
const dayPercent = (dayMove / (total - dayMove)) * 100
const leader = [...holdings].sort((a, b) => contribution(b) - contribution(a))[0]

const naira = (amount, digits = 0) => `₦${amount.toLocaleString('en-NG', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
})}`
const money = (amount) => naira(amount, amount % 1 ? 2 : 0)
const signed = (amount) => `${amount >= 0 ? '+' : '−'}${naira(Math.abs(Math.round(amount)))}`

const quoteFor = (asset) => {
  const spend = BUY_SHARES * asset.price
  const fee = BROKER_FEE + CSCS_FEE
  return {
    spend,
    fee,
    cashAfter: CASH - spend - fee,
    sharesAfter: asset.shares + BUY_SHARES,
    positionAfter: (asset.shares + BUY_SHARES) * asset.price,
    value: value(asset),
    gain: asset.shares * (asset.price - asset.cost),
    gainPercent: ((asset.price - asset.cost) / asset.cost) * 100,
  }
}

// Deterministic tick walk: a market line should look sampled, not smoothed.
const walk = (seed, count, up) => {
  let x = seed * 9973
  let level = 50
  return Array.from({ length: count }, (_, index) => {
    x = (x * 9301 + 49297) % 233280
    const r = x / 233280 - 0.5
    const jump = index % 17 === 9 ? r * 22 : 0
    level += r * 4.2 + jump + (up ? 0.32 : -0.32)
    return level
  })
}

const plot = (points, width, height, pad) => {
  const min = Math.min(...points)
  const span = Math.max(...points) - min || 1
  return points.map((point, index) => [
    (index / (points.length - 1)) * width,
    pad + (1 - (point - min) / span) * (height - pad * 2),
  ])
}

const stepPath = (coords) => coords.map(([x, y], index) => (index ? `H${x.toFixed(1)} V${y.toFixed(1)}` : `M${x} ${y.toFixed(1)}`)).join(' ')

const ranges = ['1D', '1W', '1M', '3M', 'YTD', '1Y']
const rangeLength = { '1D': 78, '1W': 70, '1M': 64, '3M': 72, YTD: 84, '1Y': 96 }

const paths = {
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 6l6 6-6 6',
  caret: 'M7 10l5 5 5-5',
  check: 'M5 12.5 10 17.5 19 7.5',
  close: 'M6 6l12 12M18 6 6 18',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  eyeOff: 'M4 4l16 16M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.4 7.1A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4-.9M9.9 9.9a3 3 0 0 0 4.2 4.2',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0',
  star: 'M12 4l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7Z',
  share: 'M12 15V4M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
  info: 'M12 11v5M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  copy: 'M9 9h10v10H9zM15 9V5H5v10h4',
  erase: 'M9 6h11v12H9l-6-6 6-6ZM12.5 9.5l5 5M17.5 9.5l-5 5',
  plus: 'M12 5v14M5 12h14',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
  arrowUp: 'M7 17 17 7M9 7h8v8',
  arrowDown: 'M7 7l10 10M17 9v8H9',
  portfolio: 'M4 6h16v13H4zM4 10h16M9 6V4h6v2',
  markets: 'M5 20V12M10 20V6M15 20v-9M20 20V9',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  inbox: 'M4 13h4l1.5 3h5L16 13h4M4 13l2.5-7h11L20 13v6H4Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  bank: 'M4 10h16M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18M12 3.5 20 8H4Z',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM3 10h18M7 15h3',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2',
  wallet: 'M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5ZM16 13.5h.01',
  shield: 'M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6Z',
  lightbulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z',
  settings: 'M4 7h10M18 7h2M4 17h2M10 17h10M16 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5Z',
  trend: 'M4 17l6-6 4 4 6-7M14 8h6v6',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h.01',
  coins: 'M9 10a5 3 0 1 0 0-.01M4 10v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4M14 7.5c2.6.3 6 1.4 6 3v4c0 1.7-2.2 3-5 3',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5Z',
  faceid: 'M8 4H6a2 2 0 0 0-2 2v2M16 4h2a2 2 0 0 1 2 2v2M8 20H6a2 2 0 0 1-2-2v-2M16 20h2a2 2 0 0 0 2-2v-2M9 9v1.5M15 9v1.5M12 9v4h-1M9.5 15.5a3.5 3.5 0 0 0 5 0',
}

function Icon({ name, size = 20, stroke = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Status() {
  return (
    <header className="ngx-status">
      <span>9:41</span>
      <i aria-hidden="true" />
      <span className="ngx-status__icons" aria-hidden="true">
        <svg viewBox="0 0 18 12" width="17" height="11"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg viewBox="0 0 16 12" width="15" height="11"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0ZM3.4 6.9a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0ZM1 4.5a9.9 9.9 0 0 1 14 0l-1.4 1.4a7.9 7.9 0 0 0-11.2 0Z" /></svg>
        <span className="ngx-battery"><i /></span>
      </span>
    </header>
  )
}

function HomeIndicator() {
  return <span className="ngx-indicator" aria-hidden="true" />
}

function Logo({ mini = false }) {
  return (
    <span className={`ngx-brand${mini ? ' ngx-brand--mini' : ''}`} aria-hidden="true">
      <img src="/images/nera/nera-logo-3d.png" alt="" draggable="false" />
    </span>
  )
}

// Large figures: the ₦ sits smaller and raised so the digits read first; decimals recede.
function Money({ amount, digits = 2, hidden = false }) {
  if (hidden) return <span className="ngx-money"><span className="ngx-money__cur">₦</span>••••••</span>
  const [whole, fraction] = amount.toLocaleString('en-NG', { minimumFractionDigits: digits, maximumFractionDigits: digits }).split('.')
  return (
    <span className="ngx-money">
      <span className="ngx-money__cur">₦</span>{whole}{fraction && <span className="ngx-money__dec">.{fraction}</span>}
    </span>
  )
}

function Tile({ asset, size = 'md' }) {
  return (
    <span className={`ngx-tile ngx-tile--${size}`}>
      {asset.image ? <img src={asset.image} alt="" draggable="false" /> : asset.mark}
    </span>
  )
}

function Delta({ amount, percent, suffix }) {
  const up = (percent ?? amount) >= 0
  return (
    <span className={`ngx-delta${up ? ' is-up' : ' is-down'}`}>
      <Icon name={up ? 'arrowUp' : 'arrowDown'} size={12} stroke={2.2} />
      {amount !== undefined && <>{naira(Math.abs(Math.round(amount)))} </>}
      {percent !== undefined && (amount !== undefined ? `(${Math.abs(percent).toFixed(2)}%)` : `${Math.abs(percent).toFixed(2)}%`)}
      {suffix && <span className="ngx-delta__suffix">{suffix}</span>}
    </span>
  )
}

function IconButton({ name, label, onClick, pressed, dot = false }) {
  return (
    <button className="ngx-icon" type="button" aria-label={label} aria-pressed={pressed} onClick={onClick}>
      <Icon name={name} size={18} />
      {dot && <b aria-hidden="true" />}
    </button>
  )
}

function Topbar({ title, onBack, backLabel, trailing }) {
  return (
    <div className="ngx-topbar">
      <IconButton name="back" label={backLabel} onClick={onBack} />
      {title && <strong className="ngx-topbar__title">{title}</strong>}
      <span className="ngx-topbar__trail">{trailing}</span>
    </div>
  )
}

function Action({ children, onClick, tone = 'ink', icon, disabled }) {
  return (
    <button className={`ngx-action ngx-action--${tone}`} type="button" onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}

function Rows({ rows, className = '' }) {
  return (
    <dl className={`ngx-rows ${className}`}>
      {rows.map(([label, content, extra]) => (
        <div key={label} className={extra === 'total' ? 'is-total' : ''}>
          <dt>{label}{extra === 'info' && <Icon name="info" size={13} />}</dt>
          <dd>{content}</dd>
        </div>
      ))}
    </dl>
  )
}

function Chart({ seed, up, range, height = 150 }) {
  // Leave room on the right so the live dot never kisses the card edge.
  const coords = plot(walk(seed + range.length * 7, rangeLength[range], up), 328, height, 12)
  const base = coords[Math.floor(coords.length * 0.12)][1]
  const [endX, endY] = coords.at(-1)
  return (
    <svg className={`ngx-chart${up ? '' : ' is-down'}`} viewBox={`0 0 340 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" x2="340" y1={base} y2={base} className="ngx-chart__base" />
      <path d={stepPath(coords)} className="ngx-chart__line" />
      <circle cx={endX} cy={endY} r="3" className="ngx-chart__dot" />
    </svg>
  )
}

function Ranges({ range, onChange, tools = false }) {
  return (
    <div className="ngx-ranges">
      <div role="group" aria-label="Range">
        {ranges.map((item) => (
          <button key={item} type="button" className={item === range ? 'is-on' : ''} aria-pressed={item === range} onClick={() => onChange(item)}>{item}</button>
        ))}
      </div>
      {tools && <span className="ngx-ranges__tools"><Icon name="settings" size={15} /></span>}
    </div>
  )
}

function Welcome({ onEnter, onSignup }) {
  const [launching, setLaunching] = useState(false)
  const launch = () => {
    if (launching) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onEnter()
      return
    }
    setLaunching(true)
    window.setTimeout(onEnter, 1000)
  }

  return (
    <section className={`ngx-screen ngx-onboard${launching ? ' is-launching' : ''}`}>
      <div className="ngx-onboard__lockup">
        <button
          className="ngx-launch"
          type="button"
          aria-label="Launch Nera"
          onClick={launch}
          onAnimationEnd={(event) => {
            if (event.animationName === 'ngx-rocket') onEnter()
          }}
        >
          <Logo />
          <span className="ngx-launch__flame" aria-hidden="true" />
        </button>
        <h2>Nera</h2>
        <p>Invest in Nigerian stocks, and understand every move.</p>
      </div>
      <ul className="ngx-card ngx-points">
        <li><Icon name="markets" size={18} /><span><strong>Every NGX stock</strong><small>Start from ₦1,000. No account minimum.</small></span></li>
        <li><Icon name="lightbulb" size={18} /><span><strong>Why it moved</strong><small>A plain-language note on every price change.</small></span></li>
        <li><Icon name="shield" size={18} /><span><strong>Held for you</strong><small>Shares sit in your name at the CSCS.</small></span></li>
      </ul>
      <div className="ngx-onboard__foot">
        <Action tone="brand" onClick={onSignup}>Get started</Action>
        <button className="ngx-link" type="button" onClick={launch}>Log in</button>
      </div>
      <HomeIndicator />
    </section>
  )
}

const tabs = [
  { id: 'portfolio', label: 'Portfolio', icon: 'portfolio' },
  { id: 'markets', label: 'Markets', icon: 'markets' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox' },
  { id: 'me', label: 'Account', icon: 'user' },
]

function Portfolio({ onOpen, onAddCash }) {
  const [view, setView] = useState('return')
  const [range, setRange] = useState('1D')
  const [hidden, setHidden] = useState(false)
  const [insight, setInsight] = useState(true)
  const [seen, setSeen] = useState(false)
  const [notice, setNotice] = useState('')
  const toggle = (id) => setNotice((current) => (current === id ? '' : id))
  const mask = (text) => (hidden ? '••••••' : text)
  const allocation = [...holdings.map((item) => ({ key: item.ticker, label: item.name, amount: value(item), asset: item })), { key: 'cash', label: 'Cash', amount: CASH }]
    .sort((a, b) => b.amount - a.amount)

  return (
    <section className="ngx-screen ngx-screen--home">
      <div className="ngx-scroll">
        <div className="ngx-topbar">
          <p className="ngx-market"><b aria-hidden="true" />NGX open · closes 2:30 pm</p>
          <span className="ngx-topbar__trail">
            <IconButton name={hidden ? 'eyeOff' : 'eye'} label={hidden ? 'Show balances' : 'Hide balances'} pressed={hidden} onClick={() => setHidden((state) => !state)} />
            <IconButton name="bell" label="Alerts" dot={!seen} onClick={() => setSeen(true)} />
          </span>
        </div>

        <div className="ngx-hero">
          <p className="ngx-hero__label">Total value</p>
          <p className="ngx-total"><Money amount={total} hidden={hidden} /></p>
          <p className="ngx-today"><Delta amount={hidden ? undefined : dayMove} percent={dayPercent} /> <span>today</span></p>
        </div>

        <div className="ngx-quick">
          <button type="button" className="is-primary" onClick={() => onOpen(leader.ticker)}><span><Icon name="up" size={20} stroke={2} /></span>Invest</button>
          <button type="button" onClick={onAddCash}><span><Icon name="plus" size={20} stroke={2} /></span>Add cash</button>
          <button type="button" aria-pressed={notice === 'withdraw'} onClick={() => toggle('withdraw')}><span><Icon name="down" size={20} stroke={2} /></span>Withdraw</button>
          <button type="button" aria-pressed={notice === 'more'} onClick={() => toggle('more')}><span><Icon name="dots" size={20} stroke={2.6} /></span>More</button>
        </div>
        {notice && (
          <p className="ngx-notice">
            <Icon name="info" size={15} />
            {notice === 'withdraw' ? 'Withdrawals reach your bank in 1 working day. Free up to 4 a month.' : 'Statements, tax documents and settings live in Account.'}
          </p>
        )}

        <div className="ngx-card ngx-summary">
          <div className="ngx-tabs" role="tablist" aria-label="Portfolio view">
            {[['return', 'Return'], ['value', 'Account value'], ['allocation', 'Allocation']].map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={view === id} className={view === id ? 'is-on' : ''} onClick={() => setView(id)}>{label}</button>
            ))}
          </div>

          {view === 'allocation' ? (
            <ul className="ngx-alloc">
              {allocation.map((item) => {
                const share = (item.amount / total) * 100
                return (
                  <li key={item.key}>
                    <span className="ngx-alloc__label">{item.label}<b>{share.toFixed(1)}%</b></span>
                    <span className="ngx-alloc__bar"><i style={{ width: `${share}%` }} /></span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <>
              <Chart seed={view === 'return' ? 5 : 11} up range={range} height={132} />
              <Ranges range={range} onChange={setRange} />
            </>
          )}
        </div>

        <button className="ngx-card ngx-line" type="button" onClick={onAddCash}>
          <span>Buying power</span>
          <strong>{mask(naira(CASH))}</strong>
          <Icon name="chevron" size={16} />
        </button>

        {insight && (
          <div className="ngx-promo">
            <button className="ngx-promo__close" type="button" aria-label="Dismiss" onClick={() => setInsight(false)}><Icon name="close" size={14} /></button>
            <strong>{leader.name} did most of the work</strong>
            <p>{mask(signed(contribution(leader)))} of today’s {mask(signed(dayMove))} came from one holding.</p>
            <button className="ngx-promo__link" type="button" onClick={() => onOpen(leader.ticker)}>See why <Icon name="chevron" size={13} stroke={2.2} /></button>
          </div>
        )}

        <div className="ngx-section">
          <h3>Holdings</h3>
          <span>{mask(naira(bookValue))}</span>
        </div>
        <ul className="ngx-card ngx-list">
          {holdings.map((item) => (
            <li key={item.ticker}>
              <button className="ngx-row" type="button" onClick={() => onOpen(item.ticker)}>
                <Tile asset={item} />
                <span className="ngx-row__main">
                  <strong>{item.ticker}</strong>
                  <small>{item.shares.toLocaleString('en-NG')} shares</small>
                </span>
                <span className="ngx-row__side">
                  <strong>{mask(naira(value(item), 2))}</strong>
                  <Delta percent={item.change} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <nav className="ngx-tabbar" aria-label="Sections">
        <div>
          {tabs.map((item) => (
            <button key={item.id} type="button" className={item.id === 'portfolio' ? 'is-on' : ''} aria-current={item.id === 'portfolio' ? 'page' : undefined}>
              <Icon name={item.icon} size={18} stroke={item.id === 'portfolio' ? 2.1 : 1.7} />
              {item.label}
            </button>
          ))}
        </div>
        <HomeIndicator />
      </nav>
    </section>
  )
}

function Asset({ asset, quote, onBack, onInvest }) {
  const [range, setRange] = useState('1D')
  const [starred, setStarred] = useState(false)
  const up = asset.change > 0
  const moveAmount = asset.price - asset.price / (1 + asset.change / 100)

  return (
    <section className="ngx-screen ngx-screen--asset">
      <Topbar
        backLabel="Portfolio"
        onBack={onBack}
        trailing={<>
          <IconButton name="star" label="Watchlist" pressed={starred} onClick={() => setStarred((state) => !state)} />
          <IconButton name="share" label="Share" />
        </>}
      />

      <div className="ngx-scroll ngx-scroll--asset">
        <div className="ngx-card ngx-summary">
          <div className="ngx-quote">
            <Tile asset={asset} size="lg" />
            <span><strong>{asset.name}</strong><small>{asset.ticker} · NGX</small></span>
          </div>
          <p className="ngx-total ngx-total--asset"><Money amount={asset.price} /></p>
          <p className="ngx-today"><Delta amount={moveAmount} percent={asset.change} /> <span>today</span></p>

          <Chart seed={asset.seed} up={up} range={range} height={128} />
          <Ranges range={range} onChange={setRange} />
        </div>

        <div className="ngx-card ngx-note">
          <p className="ngx-note__head"><Icon name="lightbulb" size={15} /> Why it moved <small>Updated 10:24</small></p>
          <p>{asset.why}</p>
        </div>

        <h3 className="ngx-subhead">Your position</h3>
        <Rows className="ngx-card" rows={[
          ['Shares', asset.shares.toLocaleString('en-NG')],
          ['Market value', naira(quote.value, 2)],
          ['Average cost', naira(asset.cost, 2)],
          ['Total return', <span className={quote.gain >= 0 ? 'is-up' : 'is-down'}>{signed(quote.gain)} ({quote.gainPercent.toFixed(2)}%)</span>],
        ]} />

        <h3 className="ngx-subhead">Stats</h3>
        <dl className="ngx-card ngx-grid">
          <div><dt>Open</dt><dd>{naira(asset.price / (1 + asset.change / 200), 2)}</dd></div>
          <div><dt>Day high</dt><dd>{naira(asset.price * 1.006, 2)}</dd></div>
          <div><dt>Volume</dt><dd>{asset.volume}</dd></div>
          <div><dt>Market cap</dt><dd>{asset.cap}</dd></div>
        </dl>
      </div>

      <div className="ngx-dock ngx-dock--bar">
        <Action onClick={onInvest}>Buy {asset.ticker}</Action>
      </div>
      <HomeIndicator />
    </section>
  )
}

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'erase']

function Keypad({ onPress, set }) {
  return (
    <div className="ngx-keypad" aria-hidden={onPress ? undefined : 'true'}>
      {(set ?? (onPress ? cashKeys : keys)).map((key, index) => {
        if (!key) return <span key={`blank-${index}`} aria-hidden="true" />
        const label = key === 'erase' ? <Icon name="erase" size={22} stroke={1.6} /> : key
        return onPress
          ? <button key={key} type="button" aria-label={key === 'erase' ? 'Delete' : key} onClick={() => onPress(key)}>{label}</button>
          : <span key={key}>{label}</span>
      })}
    </div>
  )
}

function Order({ asset, quote, onBack, onReview }) {
  const [inShares, setInShares] = useState(false)
  return (
    <section className="ngx-screen ngx-screen--sheet">
      <Topbar title={`Buy ${asset.ticker}`} backLabel={asset.name} onBack={onBack} trailing={<span className="ngx-step">1/2</span>} />

      <div className="ngx-card ngx-ticket">
        <button className="ngx-segment" type="button" onClick={() => setInShares((state) => !state)}>
          <span className={inShares ? '' : 'is-on'}>Naira</span>
          <span className={inShares ? 'is-on' : ''}>Shares</span>
        </button>
        <p className="ngx-amount">
          {inShares ? <>{BUY_SHARES}<small>shares</small></> : <Money amount={quote.spend} digits={quote.spend % 1 ? 2 : 0} />}
          <i className="ngx-caret" aria-hidden="true" />
        </p>
        <p className="ngx-amount__hint">{inShares ? money(quote.spend) : `${BUY_SHARES} shares`} at {naira(asset.price, 2)} · market order</p>
      </div>

      <Rows className="ngx-card" rows={[
        ['Buying power', naira(CASH)],
        ['After this order', naira(Math.round(quote.cashAfter))],
      ]} />

      <Keypad />
      <div className="ngx-dock"><Action onClick={onReview}>Review order</Action></div>
      <HomeIndicator />
    </section>
  )
}

function Review({ asset, quote, onBack, onConfirm }) {
  return (
    <section className="ngx-screen ngx-screen--sheet">
      <Topbar title="Review order" backLabel="Amount" onBack={onBack} trailing={<span className="ngx-step">2/2</span>} />

      <div className="ngx-card ngx-quote ngx-quote--review">
        <Tile asset={asset} size="lg" />
        <span><strong>Buy {BUY_SHARES} {asset.ticker}</strong><small>{asset.name} · market order</small></span>
      </div>

      <Rows className="ngx-card" rows={[
        ['Shares', String(BUY_SHARES)],
        ['Est. price per share', naira(asset.price, 2)],
        ['Amount', money(quote.spend)],
        ['Broker fee', naira(BROKER_FEE), 'info'],
        ['CSCS fee', naira(CSCS_FEE), 'info'],
        ['Pay from', 'Buying power'],
        ['Est. total', money(quote.spend + quote.fee), 'total'],
      ]} />

      <p className="ngx-fine">
        After this order you’ll hold {quote.sharesAfter.toLocaleString('en-NG')} shares ({naira(quote.positionAfter)}). Market orders fill at the best available NGX price and settle in 2 working days.
      </p>

      <div className="ngx-dock">
        <Action tone="brand" icon="faceid" onClick={onConfirm}>Confirm order</Action>
      </div>
      <HomeIndicator />
    </section>
  )
}

const settlement = [['Placed', 'Today, 10:31'], ['Matched', 'Thu'], ['Settled', 'Fri']]

function Done({ title, sub, children, actions }) {
  return (
    <section className="ngx-screen ngx-screen--sheet ngx-screen--done">
      <div className="ngx-done">
        <span className="ngx-done__mark">
          {Array.from({ length: 10 }, (_, index) => <i key={index} style={{ '--a': `${index * 36 + 18}deg` }} aria-hidden="true" />)}
          <span><Icon name="check" size={34} stroke={2.4} /></span>
        </span>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <div className="ngx-card ngx-receipt">{children}</div>
      <div className="ngx-dock ngx-dock--pair">{actions}</div>
      <HomeIndicator />
    </section>
  )
}

function Confirmed({ asset, quote, onDone }) {
  const [copied, setCopied] = useState(false)
  return (
    <Done
      title="Order placed"
      sub={`You’ll hold ${quote.sharesAfter.toLocaleString('en-NG')} shares of ${asset.name} once it fills.`}
      actions={<>
        <Action tone="quiet" icon="share">Share</Action>
        <Action onClick={onDone}>Done</Action>
      </>}
    >
      <ol className="ngx-progress">
        {settlement.map(([label, when], index) => (
          <li key={label} className={index === 0 ? 'is-done' : ''}>
            <b aria-hidden="true" />
            <strong>{label}</strong>
            <small>{when}</small>
          </li>
        ))}
      </ol>
      <Rows rows={[
        ['Order', `Buy ${BUY_SHARES} ${asset.ticker}`],
        ['Est. total', money(quote.spend + quote.fee)],
        ['Buying power left', naira(Math.round(quote.cashAfter))],
        ['Reference', (
          <button className="ngx-copy" type="button" onClick={() => setCopied(true)}>
            NRA-{asset.mark}-0417 <Icon name={copied ? 'check' : 'copy'} size={13} />
          </button>
        )],
      ]} />
    </Done>
  )
}

const methods = [
  { id: 'transfer', label: 'Bank transfer', detail: 'From any Nigerian bank', icon: 'bank', eta: 'Instant', fee: () => 0 },
  { id: 'card', label: 'Debit card', detail: 'Verve •• 4021', icon: 'card', eta: 'Instant', fee: (amount) => Math.min(Math.round(amount * 0.015), 2000) },
  { id: 'ussd', label: 'USSD', detail: 'Dial from your bank line', icon: 'phone', eta: 'Within 5 min', fee: () => 50 },
]
const topUps = [10000, 50000, 100000, 250000]
const cashKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'erase']
const MAX_TOP_UP = 5000000

function AddCash({ onBack, onInvest }) {
  const [amount, setAmount] = useState(50000)
  const [method, setMethod] = useState('transfer')
  const [picking, setPicking] = useState(false)
  const [sent, setSent] = useState(false)
  const chosen = methods.find((item) => item.id === method)
  const fee = chosen.fee(amount)
  const tooMuch = amount > MAX_TOP_UP
  const ready = amount >= 1000 && !tooMuch

  const press = (key) => {
    setAmount((current) => {
      if (key === 'erase') return Math.floor(current / 10)
      const next = Number(`${current || ''}${key}`)
      return next > MAX_TOP_UP * 10 ? current : next
    })
  }

  if (sent) {
    return (
      <Done
        title={`${naira(amount)} added`}
        sub={chosen.eta === 'Instant' ? 'It’s in your buying power now.' : 'It lands within 5 minutes. We’ll notify you.'}
        actions={<>
          <Action tone="quiet" onClick={onBack}>Done</Action>
          <Action onClick={onInvest}>Invest it</Action>
        </>}
      >
        <Rows rows={[
          ['From', chosen.label],
          ['Fee', fee ? naira(fee) : 'Free'],
          ['Buying power', naira(CASH + amount), 'total'],
        ]} />
      </Done>
    )
  }

  return (
    <section className="ngx-screen ngx-screen--sheet">
      <Topbar title="Add cash" backLabel="Portfolio" onBack={onBack} />

      <div className="ngx-card ngx-ticket">
        <p className={`ngx-amount${amount ? '' : ' is-empty'}${tooMuch ? ' is-over' : ''}${amount >= 10000000 ? ' is-long' : ''}`}>
          <Money amount={amount} digits={0} />
          <i className="ngx-caret" aria-hidden="true" />
        </p>
        <p className={`ngx-amount__hint${tooMuch ? ' is-over' : ''}`}>
          {tooMuch ? `Max ${naira(MAX_TOP_UP)} per top-up` : amount < 1000 ? 'Minimum ₦1,000' : `${fee ? `${naira(fee)} fee` : 'No fee'} · ${chosen.eta.toLowerCase()}`}
        </p>
        <div className="ngx-chips">
          {topUps.map((option) => (
            <button key={option} type="button" className={option === amount ? 'is-on' : ''} onClick={() => setAmount(option)}>₦{option / 1000}k</button>
          ))}
        </div>
      </div>

      <button className="ngx-card ngx-line ngx-line--method" type="button" onClick={() => setPicking(true)}>
        <span className="ngx-line__icon"><Icon name={chosen.icon} size={17} /></span>
        <span><strong>{chosen.label}</strong><small>{chosen.detail}</small></span>
        <span className="ngx-line__action">Change</span>
      </button>

      <Keypad onPress={press} />
      <div className="ngx-dock">
        <Action tone="brand" disabled={!ready} onClick={() => ready && setSent(true)}>{ready ? `Add ${naira(amount)}` : tooMuch ? 'Over the top-up limit' : 'Enter an amount'}</Action>
      </div>
      <HomeIndicator />

      {picking && (
        <div className="ngx-overlay" onClick={() => setPicking(false)}>
          <div className="ngx-picker" role="dialog" aria-label="Pay with" onClick={(event) => event.stopPropagation()}>
            <span className="ngx-grabber" aria-hidden="true" />
            <div className="ngx-picker__bar">
              <strong>Pay with</strong>
              <IconButton name="close" label="Close" onClick={() => setPicking(false)} />
            </div>
            <ul>
              {methods.map((item) => {
                const itemFee = item.fee(amount)
                return (
                  <li key={item.id}>
                    <button type="button" className={`ngx-method${item.id === method ? ' is-on' : ''}`} aria-pressed={item.id === method} onClick={() => { setMethod(item.id); setPicking(false) }}>
                      <span className="ngx-line__icon"><Icon name={item.icon} size={17} /></span>
                      <span><strong>{item.label}</strong><small>{item.eta} · {itemFee ? `${naira(itemFee)} fee` : 'Free'}</small></span>
                      <b className="ngx-radio" aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="ngx-fine">Cash is held with our custodian bank and is never lent out.</p>
            <HomeIndicator />
          </div>
        </div>
      )}
    </section>
  )
}

const signupSteps = ['phone', 'code', 'bvn', 'goal', 'pin']
const digitKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'erase']
const goals = [
  { id: 'grow', icon: 'trend', label: 'Grow my money', detail: 'Long-term, through good and bad weeks' },
  { id: 'goal', icon: 'target', label: 'A specific goal', detail: 'A home, school fees, a wedding' },
  { id: 'income', icon: 'coins', label: 'Dividend income', detail: 'Steady payouts from strong companies' },
  { id: 'explore', icon: 'compass', label: 'Just exploring', detail: 'Learn how the market moves first' },
]
const PERSON = { first: 'Tunde', last: 'Bakare', born: '14 Mar 1994' }

const groupPhone = (digits) => [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].filter(Boolean).join(' ')
const groupBvn = (digits) => [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8)].filter(Boolean).join(' ')

function Signup({ onExit, onDone, onAddCash }) {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(30)
  const [bvn, setBvn] = useState('')
  const [checking, setChecking] = useState('idle')
  const [goal, setGoal] = useState('')
  const [pin, setPin] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [mismatch, setMismatch] = useState(false)
  const index = signupSteps.indexOf(step)

  useEffect(() => {
    if (step !== 'code' || seconds === 0) return undefined
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [step, seconds])

  // The code moves on by itself once all six digits are in, the way SMS autofill feels.
  useEffect(() => {
    if (step !== 'code' || code.length < 6) return undefined
    const timer = window.setTimeout(() => setStep('bvn'), 450)
    return () => window.clearTimeout(timer)
  }, [step, code])

  useEffect(() => {
    if (checking !== 'running') return undefined
    const timer = window.setTimeout(() => setChecking('matched'), 1400)
    return () => window.clearTimeout(timer)
  }, [checking])

  useEffect(() => {
    if (step !== 'pin' || pin.length < 4) return undefined
    const timer = window.setTimeout(() => {
      if (!firstPin) {
        setFirstPin(pin)
        setPin('')
      } else if (pin === firstPin) {
        setStep('done')
      } else {
        setMismatch(true)
        setPin('')
        setFirstPin('')
      }
    }, 260)
    return () => window.clearTimeout(timer)
  }, [step, pin, firstPin])

  const type = (setter, max) => (key) => {
    setMismatch(false)
    setter((value) => (key === 'erase' ? value.slice(0, -1) : value.length >= max ? value : value + key))
  }

  const back = () => {
    if (step === 'phone') return onExit()
    if (step === 'bvn' && checking === 'matched') return setChecking('idle')
    if (step === 'pin' && firstPin) { setFirstPin(''); setPin(''); return undefined }
    setStep(signupSteps[index - 1])
    return undefined
  }

  if (step === 'done') {
    return (
      <section className="ngx-screen ngx-screen--sheet ngx-screen--done ngx-signup">
        <div className="ngx-done">
          <span className="ngx-done__mark">
            {Array.from({ length: 10 }, (_, dot) => <i key={dot} style={{ '--a': `${dot * 36 + 18}deg` }} aria-hidden="true" />)}
            <span><Icon name="check" size={34} stroke={2.4} /></span>
          </span>
          <h2>You’re all set, {PERSON.first}</h2>
          <p>Your account is open. Add cash whenever you’re ready to make your first investment.</p>
        </div>
        <div className="ngx-dock ngx-dock--stack">
          <Action tone="brand" onClick={onDone}>Start investing</Action>
          <button className="ngx-link" type="button" onClick={onAddCash}>Add cash first</button>
        </div>
        <HomeIndicator />
      </section>
    )
  }

  return (
    <section className="ngx-screen ngx-screen--sheet ngx-signup">
      <div className="ngx-topbar">
        <IconButton name="back" label="Back" onClick={back} />
        <ol className="ngx-steps" aria-label={`Step ${index + 1} of ${signupSteps.length}`}>
          {signupSteps.map((item, position) => <li key={item} className={position <= index ? 'is-on' : ''} />)}
        </ol>
        <span className="ngx-step">{index + 1}/{signupSteps.length}</span>
      </div>

      {step === 'phone' && (
        <>
          <div className="ngx-signup__head">
            <h2>What’s your phone number?</h2>
            <p>We’ll text you a code to confirm it’s yours.</p>
          </div>
          <div className={`ngx-field${phone ? ' is-filled' : ''}`}>
            <span className="ngx-field__prefix">+234</span>
            <span className="ngx-field__value">{phone ? groupPhone(phone) : '803 000 0000'}<i className="ngx-caret" aria-hidden="true" /></span>
          </div>
          <p className="ngx-fine">By continuing you agree to Nera’s Terms and Privacy Policy.</p>
          <Keypad onPress={type(setPhone, 10)} set={digitKeys} />
          <div className="ngx-dock"><Action disabled={phone.length < 10} onClick={() => { setStep('code'); setSeconds(30); setCode('') }}>Continue</Action></div>
        </>
      )}

      {step === 'code' && (
        <>
          <div className="ngx-signup__head">
            <h2>Enter the 6-digit code</h2>
            <p>Sent to +234 {groupPhone(phone)}. <button className="ngx-inline" type="button" onClick={() => setStep('phone')}>Edit</button></p>
          </div>
          <div className="ngx-otp" aria-label="Verification code">
            {Array.from({ length: 6 }, (_, slot) => (
              <span key={slot} className={`${code[slot] ? 'is-filled' : ''}${slot === code.length ? ' is-active' : ''}`}>{code[slot] ?? ''}</span>
            ))}
          </div>
          <p className="ngx-resend">
            {seconds > 0
              ? <>Resend code in 0:{String(seconds).padStart(2, '0')}</>
              : <button className="ngx-inline" type="button" onClick={() => setSeconds(30)}>Resend code</button>}
          </p>
          <Keypad onPress={type(setCode, 6)} set={digitKeys} />
        </>
      )}

      {step === 'bvn' && (
        <>
          <div className="ngx-signup__head">
            <h2>Verify your identity</h2>
            <p>Your BVN confirms it’s really you. It gives no access to your bank account.</p>
          </div>
          {checking === 'matched' ? (
            <div className="ngx-card ngx-match">
              <span className="ngx-match__avatar">{PERSON.first[0]}{PERSON.last[0]}</span>
              <span><strong>{PERSON.first} {PERSON.last}</strong><small>Born {PERSON.born}</small></span>
              <span className="ngx-match__ok"><Icon name="check" size={14} stroke={2.6} /></span>
            </div>
          ) : (
            <div className={`ngx-field${bvn ? ' is-filled' : ''}${checking === 'running' ? ' is-busy' : ''}`}>
              <span className="ngx-field__prefix">BVN</span>
              <span className="ngx-field__value">{bvn ? groupBvn(bvn) : '2234 5678 901'}{checking === 'idle' && <i className="ngx-caret" aria-hidden="true" />}</span>
              {checking === 'running' && <span className="ngx-spinner" aria-label="Checking" />}
            </div>
          )}
          <p className="ngx-fine ngx-fine--icon"><Icon name="lock" size={14} />{checking === 'matched' ? 'Is this you? We’ll use these details for your CSCS account.' : 'Dial *565*0# on your registered line if you don’t know it.'}</p>
          {checking === 'matched' ? (
            <div className="ngx-dock ngx-dock--stack">
              <Action onClick={() => setStep('goal')}>Yes, that’s me</Action>
              <button className="ngx-link" type="button" onClick={() => { setChecking('idle'); setBvn('') }}>Not me</button>
            </div>
          ) : (
            <>
              <Keypad onPress={checking === 'idle' ? type(setBvn, 11) : () => {}} set={digitKeys} />
              <div className="ngx-dock"><Action disabled={bvn.length < 11 || checking === 'running'} onClick={() => setChecking('running')}>{checking === 'running' ? 'Checking…' : 'Verify'}</Action></div>
            </>
          )}
        </>
      )}

      {step === 'goal' && (
        <>
          <div className="ngx-signup__head">
            <h2>What are you investing for?</h2>
            <p>It shapes the ideas we show you. You can change it later.</p>
          </div>
          <ul className="ngx-choices">
            {goals.map((item) => (
              <li key={item.id}>
                <button type="button" className={`ngx-choice${goal === item.id ? ' is-on' : ''}`} aria-pressed={goal === item.id} onClick={() => setGoal(item.id)}>
                  <span className="ngx-line__icon"><Icon name={item.icon} size={18} /></span>
                  <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                  <b className="ngx-radio" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="ngx-dock"><Action disabled={!goal} onClick={() => { setStep('pin'); setPin(''); setFirstPin('') }}>Continue</Action></div>
        </>
      )}

      {step === 'pin' && (
        <>
          <div className="ngx-signup__head">
            <h2>{firstPin ? 'Confirm your PIN' : 'Create a 4-digit PIN'}</h2>
            <p className={mismatch ? 'is-down' : ''}>{mismatch ? 'Those didn’t match. Try again.' : 'You’ll use it to confirm every trade.'}</p>
          </div>
          <div className={`ngx-pin${mismatch ? ' is-wrong' : ''}`} aria-label={`${pin.length} of 4 digits entered`}>
            {Array.from({ length: 4 }, (_, slot) => <i key={slot} className={slot < pin.length ? 'is-filled' : ''} />)}
          </div>
          <Keypad onPress={type(setPin, 4)} set={digitKeys} />
        </>
      )}
      <HomeIndicator />
    </section>
  )
}

export default function InvestmentUI({ screen, onScreenChange = () => {} }) {
  const [ticker, setTicker] = useState('DANGCEM')
  const asset = holdings.find((item) => item.ticker === ticker) ?? holdings[0]
  const quote = quoteFor(asset)
  const go = (id) => onScreenChange(id)
  const open = (next) => {
    setTicker(next)
    go('asset-detail')
  }

  return (
    <div className={`ngx${screen === 'portfolio' ? ' ngx--brand' : ''}${screen === 'welcome' || screen === 'signup' ? ' ngx--plain' : ''}`}>
      <Status />
      {screen === 'welcome' && <Welcome onEnter={() => go('portfolio')} onSignup={() => go('signup')} />}
      {screen === 'signup' && <Signup onExit={() => go('welcome')} onDone={() => go('portfolio')} onAddCash={() => go('add-cash')} />}
      {screen === 'portfolio' && <Portfolio onOpen={open} onAddCash={() => go('add-cash')} />}
      {screen === 'add-cash' && <AddCash onBack={() => go('portfolio')} onInvest={() => open(leader.ticker)} />}
      {screen === 'asset-detail' && <Asset asset={asset} quote={quote} onBack={() => go('portfolio')} onInvest={() => go('order')} />}
      {screen === 'order' && <Order asset={asset} quote={quote} onBack={() => go('asset-detail')} onReview={() => go('review')} />}
      {screen === 'review' && <Review asset={asset} quote={quote} onBack={() => go('order')} onConfirm={() => go('confirmed')} />}
      {screen === 'confirmed' && <Confirmed asset={asset} quote={quote} onDone={() => go('portfolio')} />}
    </div>
  )
}

export { screens as investmentScreens }
