import { useState } from 'react'
import './investment.css'

const screens = [
  { id: 'welcome', label: 'Onboarding', purpose: 'Meet Nera before the portfolio' },
  { id: 'portfolio', label: 'Portfolio', purpose: 'Understand the current position' },
  { id: 'asset-detail', label: 'Asset detail', purpose: 'Understand why performance changed' },
  { id: 'order', label: 'Order', purpose: 'Choose an amount with confidence' },
  { id: 'review', label: 'Review', purpose: 'Verify the decision before committing' },
  { id: 'confirmed', label: 'Confirmed', purpose: 'Know exactly what changed' },
]

const holdings = [
  { ticker: 'DANGCEM', name: 'Dangote Cement', mark: 'DC', tone: 'forest', price: 612.5, change: 2.4, shares: 420, since: 'up ₦14.20 since Monday', why: 'Cement volumes held through the quarter. The move is the price, not a new position.' },
  { ticker: 'MTNN', name: 'MTN Nigeria', mark: 'MT', tone: 'ink', price: 248, change: 1.6, shares: 8400, since: 'up ₦3.90 since Monday', why: 'Data revenue carried the week. The price is higher, and the holding is the same.' },
  { ticker: 'GTCO', name: 'Guaranty Trust', mark: 'GT', tone: 'stone', price: 54.8, change: -0.6, shares: 12000, since: 'down ₦0.33 since Monday', why: 'The bank gave a little back after a strong month. You still hold the same shares.' },
  { ticker: 'SEPLAT', name: 'Seplat Energy', mark: 'SE', tone: 'sand', price: 4890, change: 4.3, shares: 240, since: 'up ₦210 since Monday', why: 'Energy prices firmed. The gain is on the shares you already own.' },
]

const CASH = 648800
const BUY_SHARES = 40
const BROKER_FEE = 123
const CSCS_FEE = 25
const bookValue = holdings.reduce((sum, item) => sum + item.shares * item.price, 0)
const dayMove = holdings.reduce((sum, item) => sum + item.shares * item.price * (item.change / 100), 0)
const total = bookValue + CASH
const dayPercent = (dayMove / total) * 100

const naira = (amount, digits = 0) => `₦${amount.toLocaleString('en-NG', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
})}`

const heroFigure = (amount) => amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const quoteFor = (asset) => {
  const spend = BUY_SHARES * asset.price
  const fee = BROKER_FEE + CSCS_FEE
  return {
    spend,
    fee,
    cashAfter: CASH - spend - fee,
    sharesAfter: asset.shares + BUY_SHARES,
    positionAfter: (asset.shares + BUY_SHARES) * asset.price,
    value: asset.shares * asset.price,
  }
}

const moveLabel = (change) => `${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}%`

function Status({ light }) {
  return (
    <header className={`ngx-status${light ? ' ngx-status--light' : ''}`}>
      <span>9:41</span>
      <i aria-hidden="true" />
      {light ? <span /> : <span className="ngx-status__market"><b aria-hidden="true" />NGX · open</span>}
    </header>
  )
}

function Arrow({ down }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={down ? 'M12 5v14M7 14l5 5 5-5' : 'M12 19V5M7 10l5-5 5 5'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Pill({ change }) {
  const up = change > 0
  return <span className={`ngx-pill${up ? ' ngx-pill--up' : ' ngx-pill--down'}`}>{moveLabel(change)}</span>
}

function Action({ children, onClick }) {
  return <button className="ngx-action" type="button" onClick={onClick}>{children}</button>
}

function Back({ label, onClick }) {
  return <button className="ngx-back" type="button" onClick={onClick}>{label}</button>
}

function Logo({ mini = false }) {
  return (
    <span className={`ngx-brand${mini ? ' ngx-brand--mini' : ''}`} aria-hidden="true">
      <img src="/images/nera/nera-logo-3d.png" alt="" draggable="false" />
    </span>
  )
}

function Welcome({ onEnter }) {
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
        <p className="ngx-onboard__place">Lagos · NGX</p>
      </div>
    </section>
  )
}

function Orbit({ label, onClick, children }) {
  return (
    <button className="ngx-orbit" type="button" onClick={onClick}>
      <span>{children}</span>
      {label}
    </button>
  )
}

function Portfolio({ onOpen }) {
  const [tab, setTab] = useState('stocks')
  const [notice, setNotice] = useState('')
  const showingCash = tab === 'cash'

  return (
    <section className="ngx-screen ngx-screen--home">
      <div className="ngx-wallet">
        <div className="ngx-wallet__bar">
          <div className="ngx-switch" role="tablist" aria-label="Balance">
            <button type="button" role="tab" aria-selected={tab === 'stocks'} className={tab === 'stocks' ? 'is-on' : ''} onClick={() => setTab('stocks')}>Stocks</button>
            <button type="button" role="tab" aria-selected={tab === 'cash'} className={tab === 'cash' ? 'is-on' : ''} onClick={() => setTab('cash')}>Cash</button>
          </div>
          <button className="ngx-bell" type="button" aria-label="Alerts" aria-pressed={notice === 'alerts'} onClick={() => setNotice((value) => value === 'alerts' ? '' : 'alerts')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </button>
        </div>
        <p className="ngx-wallet__id">
          <Logo mini />
          Nera
          <i aria-hidden="true" />
          {showingCash ? 'Cash' : 'Lagos'}
        </p>
        <p className="ngx-wallet__balance"><small>₦</small>{heroFigure(showingCash ? CASH : total)}</p>
        <p className="ngx-wallet__move">{showingCash ? 'Available to invest' : <><Pill change={dayPercent} /> +{naira(Math.round(dayMove))} today</>}</p>
        <div className="ngx-orbits">
          <Orbit label="Invest" onClick={() => onOpen('DANGCEM')}><Arrow /></Orbit>
          <Orbit label="Cash" onClick={() => setTab('cash')}><Arrow down /></Orbit>
          <Orbit label="More" onClick={() => setNotice((value) => value === 'more' ? '' : 'more')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="18" cy="12" r="1.4" fill="currentColor" /></svg>
          </Orbit>
        </div>
        {notice === 'alerts' && <p className="ngx-wallet__note">NGX is open. Nothing new.</p>}
        {notice === 'more' && <p className="ngx-wallet__note">Lagos · shares settle in 2 working days.</p>}
      </div>
      <div className="ngx-sheet">
        <h3>Holdings</h3>
        <ul>
          {holdings.map((item) => (
            <li key={item.ticker}>
              <button className="ngx-row" type="button" onClick={() => onOpen(item.ticker)}>
                <span className={`ngx-mark ngx-mark--${item.tone}`}>{item.mark}</span>
                <span className="ngx-row__name">
                  <strong>{item.name}</strong>
                  <small>{item.ticker}</small>
                </span>
                <span className="ngx-row__price">
                  <strong>{naira(item.price, 2)}</strong>
                  <Pill change={item.change} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Asset({ asset, quote, onBack, onInvest }) {
  const up = asset.change > 0
  const line = up
    ? 'M0 78 C48 76 72 86 108 64 S168 34 196 46 248 22 320 16'
    : 'M0 24 C46 30 78 28 112 48 S176 86 214 78 268 96 320 92'
  return (
    <section className="ngx-screen ngx-screen--asset">
      <div className="ngx-wallet">
        <Back label="Portfolio" onClick={onBack} />
        <p className="ngx-wallet__id">
          <span className={`ngx-logo ngx-logo--${asset.tone}`}>{asset.mark}</span>
          {asset.ticker}
          <i aria-hidden="true" />
          NGX
        </p>
        <p className="ngx-wallet__balance"><small>₦</small>{heroFigure(asset.price)}</p>
        <p className="ngx-wallet__move"><Pill change={asset.change} /> {asset.since}</p>
        <div className="ngx-orbits">
          <Orbit label="Invest" onClick={onInvest}><Arrow /></Orbit>
        </div>
      </div>
      <div className="ngx-sheet">
        <h2>{asset.name}</h2>
        <figure className="ngx-chart">
          <svg viewBox="0 0 320 108" role="img" aria-label={`${asset.name}, six months`}>
            <defs>
              <linearGradient id={`ngx-fill-${asset.ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={up ? '#9FE870' : '#f6d2cc'} stopOpacity="0.7" />
                <stop offset="100%" stopColor={up ? '#9FE870' : '#f6d2cc'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} V108 H0 Z`} fill={`url(#ngx-fill-${asset.ticker})`} />
            <path d={line} fill="none" stroke={up ? '#163300' : '#7a2218'} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <figcaption>6 months</figcaption>
        </figure>
        <p className="ngx-why">{asset.why}</p>
        <p className="ngx-hold">You hold <strong>{asset.shares.toLocaleString('en-NG')} shares</strong> · {naira(quote.value)}</p>
      </div>
    </section>
  )
}

function Order({ asset, quote, onBack, onReview }) {
  return (
    <section className="ngx-screen">
      <Back label={asset.name} onClick={onBack} />
      <p className="ngx-kicker">Amount</p>
      <p className="ngx-balance">{naira(quote.spend, quote.spend % 1 ? 2 : 0)}</p>
      <div className="ngx-chips" aria-hidden="true">
        <span>{naira(Math.round(quote.spend / 2))}</span>
        <span className="is-selected">{naira(quote.spend, quote.spend % 1 ? 2 : 0)}</span>
        <span>{naira(quote.spend * 2)}</span>
      </div>
      <p className="ngx-note">{naira(Math.round(quote.cashAfter))} left after this</p>
      <dl className="ngx-lines">
        <div><dt>Shares</dt><dd>{BUY_SHARES} at {naira(asset.price, 2)}</dd></div>
        <div><dt>Broker</dt><dd>{naira(BROKER_FEE)}</dd></div>
        <div><dt>CSCS</dt><dd>{naira(CSCS_FEE)}</dd></div>
      </dl>
      <div className="ngx-dock"><Action onClick={onReview}>Review</Action></div>
    </section>
  )
}

function Review({ asset, quote, onBack, onConfirm }) {
  return (
    <section className="ngx-screen">
      <Back label="Amount" onClick={onBack} />
      <p className="ngx-kicker">Review</p>
      <h2>{BUY_SHARES} shares of {asset.name}</h2>
      <dl className="ngx-lines ngx-lines--card">
        <div><dt>Amount</dt><dd>{naira(quote.spend, quote.spend % 1 ? 2 : 0)}</dd></div>
        <div><dt>Fee</dt><dd>{naira(quote.fee)}</dd></div>
        <div><dt>Broker</dt><dd>{naira(BROKER_FEE)}</dd></div>
        <div><dt>CSCS</dt><dd>{naira(CSCS_FEE)}</dd></div>
        <div><dt>Total</dt><dd>{naira(quote.spend + quote.fee, (quote.spend + quote.fee) % 1 ? 2 : 0)}</dd></div>
      </dl>
      <p className="ngx-hold">You will hold <strong>{quote.sharesAfter.toLocaleString('en-NG')} shares</strong> · {naira(quote.positionAfter)}</p>
      <div className="ngx-dock"><Action onClick={onConfirm}>Confirm</Action></div>
    </section>
  )
}

function Confirmed({ asset, quote, onDone }) {
  return (
    <section className="ngx-screen ngx-screen--done">
      <div className="ngx-done">
        <span className="ngx-check" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h2>You now hold {quote.sharesAfter.toLocaleString('en-NG')} shares of {asset.name}.</h2>
        <p>They settle in 2 working days. Cash left is {naira(Math.round(quote.cashAfter))}.</p>
      </div>
      <div className="ngx-dock"><Action onClick={onDone}>Back to portfolio</Action></div>
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
  const light = screen !== 'order' && screen !== 'review' && screen !== 'confirmed'

  return (
    <div className={`ngx${light ? ' ngx--violet' : ''}`}>
      <Status light={light} />
      {screen === 'welcome' && <Welcome onEnter={() => go('portfolio')} />}
      {screen === 'asset-detail' && <Asset asset={asset} quote={quote} onBack={() => go('portfolio')} onInvest={() => go('order')} />}
      {screen === 'order' && <Order asset={asset} quote={quote} onBack={() => go('asset-detail')} onReview={() => go('review')} />}
      {screen === 'review' && <Review asset={asset} quote={quote} onBack={() => go('order')} onConfirm={() => go('confirmed')} />}
      {screen === 'confirmed' && <Confirmed asset={asset} quote={quote} onDone={() => go('portfolio')} />}
      {light && screen !== 'asset-detail' && screen !== 'welcome' && <Portfolio onOpen={open} />}
    </div>
  )
}

export { screens as investmentScreens }
