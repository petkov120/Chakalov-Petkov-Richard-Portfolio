import { useEffect, useState } from 'react'
import './hydra.css'

const screens = [
  { id: 'splash', label: 'Start', purpose: 'One tap into the game' },
  { id: 'home', label: 'Home', purpose: 'Find the next race at a glance' },
  { id: 'event', label: 'Event', purpose: 'Know the race before you commit' },
  { id: 'garage', label: 'Garage', purpose: 'Pick a car by how it drives' },
  { id: 'race', label: 'Race', purpose: 'Read speed, boost and position instantly' },
  { id: 'results', label: 'Results', purpose: 'See what the race earned' },
]

const art = {
  skyline: { img: '/images/playground/hydra-home-screen.webp', size: 'auto 100%', pos: '50% 0' },
  snow: { img: '/images/playground/hydra-onboarding-2.webp', size: 'auto 150%', pos: '40% 20%' },
  pilot: { img: '/images/playground/hydra-onboarding-race.webp', size: '583px auto', pos: '-445px -108px' },
}

const cars = [
  { id: 'spyder', name: 'Spyder 918', tag: 'Hypercar', color: '#ff2b3a', stats: [94, 82, 88] },
  { id: 'vanta', name: 'Vanta S', tag: 'Grand tourer', color: '#c7ccd6', stats: [88, 95, 74] },
  { id: 'kestrel', name: 'Kestrel GT', tag: 'Track weapon', color: '#ff8a1f', stats: [91, 78, 96] },
]
const STATS = ['Speed', 'Handling', 'Boost']
const TABS = [['home', 'Home'], ['solo', 'Solo'], ['multi', 'Online'], ['cars', 'Cars'], ['progress', 'Rank']]

const Photo = ({ name }) => <div className="hy-photo" style={{ backgroundImage: `url(${art[name].img})`, backgroundSize: art[name].size, backgroundPosition: art[name].pos }} />

function Status() {
  return <header className="hy-status"><span>9:41</span><span>5G ▮▮▮</span></header>
}

function Car({ color }) { // side-on silhouette, tinted per car
  return (
    <svg className="hy-car" viewBox="0 0 320 112" aria-hidden="true" style={{ color }}>
      <ellipse cx="160" cy="100" rx="140" ry="9" fill="#000" opacity=".5" />
      <path d="M10 86V70l12-4v-6l36-2 42-4c20-16 42-24 72-24 32 0 52 10 72 24l46 8c14 4 24 10 24 18v6z" fill="currentColor" />
      <path d="M112 52c14-11 32-17 58-17 26 0 42 7 56 17z" fill="#0b0d14" opacity=".88" />
      <path d="M8 56h44v4H8zM20 56v10M42 56v10" stroke="currentColor" strokeWidth="3" />
      <path d="M236 66h52v3h-52z" fill="#000" opacity=".28" /><path d="M290 70h24v5h-24z" fill="#fff" opacity=".92" /><path d="M10 72h18v4H10z" fill="#ff2b3a" />
      {[82, 246].map(x => <g key={x}><circle cx={x} cy="88" r="19" fill="#07080c" /><circle cx={x} cy="88" r="10" fill="#2a2d38" /><circle cx={x} cy="88" r="3.5" fill="currentColor" /></g>)}
    </svg>
  )
}

function Splash({ onStart }) {
  return (
    <section className="hy-screen hy-splash">
      <Photo name="skyline" />
      <div className="hy-fade hy-fade--bottom" />
      <div className="hy-logo"><span>HYDRA</span><span>RACE</span></div>
      <button className="hy-start" type="button" onClick={onStart}>Tap to start</button>
      <small className="hy-version">Version 1.2.3</small>
    </section>
  )
}

function Home({ onEvent, onGarage }) {
  const [tab, setTab] = useState('home')
  const pick = id => { setTab(id); if (id === 'cars') onGarage() }
  return (
    <section className="hy-screen hy-home">
      <div className="hy-profile">
        <span className="hy-avatar" style={{ backgroundImage: `url(${art.pilot.img})`, backgroundSize: art.pilot.size, backgroundPosition: art.pilot.pos }} />
        <div><strong>Samy</strong><span className="hy-xp"><i style={{ width: '64%' }} /></span><small>Level 14 · 3,120 / 4,800 XP</small></div>
        <span className="hy-coins">◆ 12,480</span>
      </div>
      <button className="hy-card hy-card--cup" type="button" onClick={onEvent}>
        <span className="hy-card__photo" style={{ backgroundImage: `url(${art.snow.img})`, backgroundSize: art.snow.size, backgroundPosition: art.snow.pos }} />
        <span className="hy-fade hy-fade--card" />
        <span className="hy-card__body"><small>Season 1 · Round 3 of 8</small><strong>Hydra’s Cup</strong><em>Closes in 02:14:09</em></span>
        <span className="hy-card__go" aria-hidden="true">›</span>
      </button>
      <div className="hy-pair">
        <button className="hy-card hy-card--multi" type="button"><span className="hy-card__body"><small><b className="hy-live" />1,284 racing now</small><strong>Multiplayer</strong></span></button>
        <button className="hy-card hy-card--daily" type="button"><span className="hy-card__body"><small>Resets in 6h</small><strong>Daily run</strong><em>+500 ◆</em></span></button>
      </div>
      <div className="hy-recent"><h2>Last races</h2><ul>
        <li><b>1st</b>Hong Kong Harbour<em>2:41.22</em></li>
        <li><b>3rd</b>Alpine Pass<em>3:12.80</em></li>
      </ul></div>
      <nav className="hy-tabs" aria-label="Game menu">
        {TABS.map(([id, label]) => <button key={id} type="button" aria-current={tab === id || undefined} onClick={() => pick(id)}>{label}</button>)}
      </nav>
    </section>
  )
}

function Event({ car, level, setLevel, onBack, onGarage, onRace }) {
  return (
    <section className="hy-screen hy-event">
      <div className="hy-hero"><Photo name="skyline" /><div className="hy-fade hy-fade--bottom" />
        <button className="hy-back" type="button" onClick={onBack}>‹ Home</button>
        <div className="hy-hero__title"><small>Round 3 · Night</small><h2>Hong Kong<br />Harbour</h2></div>
      </div>
      <dl className="hy-facts"><div><dt>Laps</dt><dd>3</dd></div><div><dt>Distance</dt><dd>9.4 km</dd></div><div><dt>Rivals</dt><dd>7</dd></div></dl>
      <div className="hy-seg" role="radiogroup" aria-label="Difficulty">
        {['Rookie', 'Pro', 'Elite'].map(name => <button key={name} type="button" role="radio" aria-checked={level === name} onClick={() => setLevel(name)}>{name}</button>)}
      </div>
      <ul className="hy-rewards"><li><b>+2,400 ◆</b> for 1st</li><li><b>+900 XP</b></li><li><b>Livery</b> “Ember”</li></ul>
      <button className="hy-carrow" type="button" onClick={onGarage}><Car color={car.color} /><span><small>Your car</small><strong>{car.name}</strong></span><em>Change ›</em></button>
      <div className="hy-dock"><button className="hy-primary hy-race" type="button" onClick={onRace}>Race</button></div>
    </section>
  )
}

function Garage({ car, setCar, onBack, onSelect }) {
  return (
    <section className="hy-screen hy-garage">
      <button className="hy-back" type="button" onClick={onBack}>‹ Event</button>
      <div className="hy-stage" style={{ '--tint': car.color }}><Car color={car.color} /></div>
      <div className="hy-name"><small>{car.tag}</small><h2>{car.name}</h2></div>
      <ul className="hy-bars">{STATS.map((label, i) => <li key={label}><span>{label}</span><i><b style={{ width: `${car.stats[i]}%`, background: car.color }} /></i><em>{car.stats[i]}</em></li>)}</ul>
      <div className="hy-chips" role="radiogroup" aria-label="Cars">
        {cars.map(item => <button key={item.id} className="hy-chip" type="button" role="radio" aria-checked={item.id === car.id} onClick={() => setCar(item)}><Car color={item.color} /><span>{item.name}</span></button>)}
      </div>
      <div className="hy-dock"><button className="hy-primary hy-select" type="button" onClick={onSelect}>Select {car.name}</button></div>
    </section>
  )
}

function Race({ car, onFinish }) {
  const [speed, setSpeed] = useState(168)
  const [boost, setBoost] = useState(100)
  const [nitro, setNitro] = useState(false)
  useEffect(() => {
    const tick = setInterval(() => {
      setSpeed(value => Math.round(nitro ? Math.min(268, value + 9) : 176 + Math.sin(Date.now() / 700) * 18))
      setBoost(value => Math.max(0, Math.min(100, value + (nitro ? -6 : 1.5))))
    }, 120)
    const done = setTimeout(onFinish, 12000)
    return () => { clearInterval(tick); clearTimeout(done) }
  }, [nitro, onFinish])
  useEffect(() => { if (boost <= 0) setNitro(false) }, [boost])
  return (
    <section className={`hy-screen hy-race-hud${nitro ? ' is-nitro' : ''}`}>
      <Photo name="snow" /><div className="hy-streaks" /><div className="hy-fade hy-fade--hud" />
      <div className="hy-top"><div className="hy-pos"><small>Position</small><strong>{nitro ? 2 : 3}<sup>/8</sup></strong></div><div className="hy-lap"><small>Lap</small><strong>2/3</strong></div>
        <svg className="hy-map" viewBox="0 0 60 60" aria-hidden="true"><path id="hy-track" d="M12 40C6 28 14 12 30 10s26 8 20 24-24 22-38 6z" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3" /><circle r="3.4" fill="#ff2b3a"><animateMotion dur="7s" repeatCount="indefinite"><mpath href="#hy-track" /></animateMotion></circle></svg></div>
      <div className="hy-speedo"><strong>{speed}</strong><span>km/h</span></div>
      <div className="hy-boost" aria-label={`Boost ${Math.round(boost)}%`}><i style={{ width: `${boost}%`, background: nitro ? '#ff8a1f' : car.color }} /></div>
      <button className="hy-nitro" type="button" aria-pressed={nitro} onClick={() => setNitro(value => !value && boost > 5)}>Nitro</button>
    </section>
  )
}

function Results({ car, onAgain, onHome }) {
  return (
    <section className="hy-screen hy-results">
      <Photo name="skyline" /><div className="hy-fade hy-fade--results" />
      <div className="hy-place"><small>Hydra’s Cup · Round 3</small><strong>1<sup>st</sup></strong><em>{car.name}</em></div>
      <dl className="hy-facts hy-facts--solid"><div><dt>Time</dt><dd>2:41.22</dd></div><div><dt>Best lap</dt><dd>0:52.1</dd></div><div><dt>Top speed</dt><dd>241</dd></div></dl>
      <ul className="hy-earned"><li><b>+2,400 ◆</b><small>Coins</small></li><li><b>+900</b><small>XP</small></li><li><b>Ember</b><small>Livery unlocked</small></li></ul>
      <div className="hy-dock hy-dock--two"><button className="hy-ghost" type="button" onClick={onHome}>Home</button><button className="hy-primary" type="button" onClick={onAgain}>Race again</button></div>
    </section>
  )
}

export default function HydraUI({ screen, onScreenChange = () => {} }) {
  const [car, setCar] = useState(cars[0])
  const [level, setLevel] = useState('Pro')
  const go = id => onScreenChange(id)
  return (
    <div className="hy">
      <Status />
      {screen === 'splash' && <Splash onStart={() => go('home')} />}
      {screen === 'home' && <Home onEvent={() => go('event')} onGarage={() => go('garage')} />}
      {screen === 'event' && <Event car={car} level={level} setLevel={setLevel} onBack={() => go('home')} onGarage={() => go('garage')} onRace={() => go('race')} />}
      {screen === 'garage' && <Garage car={car} setCar={setCar} onBack={() => go('event')} onSelect={() => go('event')} />}
      {screen === 'race' && <Race car={car} onFinish={() => go('results')} />}
      {screen === 'results' && <Results car={car} onAgain={() => go('race')} onHome={() => go('home')} />}
    </div>
  )
}

export { screens as hydraScreens }
