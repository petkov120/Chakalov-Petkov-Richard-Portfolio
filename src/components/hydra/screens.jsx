// Hydra Race: desktop / console screens. The first three are the original designs (shown as drawn);
// the rest extend the same kit: bumper tabs, white-bordered cards, controller prompts, one blue action.
import CarArt, { cars } from './cars'

const IMG = '/images/playground/'
const TABS = ['Home', 'Single player', 'Multiplayer', 'Cars', 'Progress']

const Tabs = ({ active }) => (
  <nav className="hg-tabs"><b>LB</b>{TABS.map(tab => <span key={tab} className={tab === active ? 'is-on' : ''}>{tab}</span>)}<b>RB</b></nav>
)
const Prompts = ({ items = [['A', 'Select'], ['B', 'Back'], ['Y', 'Options']] }) => (
  <div className="hg-prompts">{items.map(([key, label]) => <span key={key}><i>{key}</i>{label}</span>)}</div>
)
const Backdrop = ({ photo, shade = .72 }) => (
  <><div className={`hg-bg hg-bg--${photo}`} /><div className="hg-shade" style={{ opacity: shade }} /></>
)
const Original = ({ src, alt }) => <img className="hg-original" src={IMG + src} alt={alt} />

const Bar = ({ label, value, accent }) => (
  <li><span>{label}</span><i><b style={{ width: `${value}%`, background: accent }} /></i><em>{value}</em></li>
)

function SinglePlayer() {
  const cups = [
    ['Hydra’s Cup', 'Round 3 of 8', 3, 'sky'], ['Alpine Pass', 'Snow · 4 laps', 2, 'snow'], ['Night Harbour', 'City · 3 laps', 1, 'blue'],
    ['Time trial', 'Beat 2:38.00', 0, 'blue'], ['Drift zone', 'Score 40,000', 0, 'dusk'], ['Elite series', 'Finish Cup 8 to unlock', -1, 'dusk'],
  ]
  return (
    <>
      <Backdrop photo="snow" shade={.82} /><Tabs active="Single player" />
      <div className="hg-grid">
        {cups.map(([name, sub, stars, tone]) => (
          <div key={name} className={`hg-card hg-card--${tone}${stars < 0 ? ' is-locked' : ''}`}>
            <h3>{name}</h3><p>{sub}</p>
            {stars >= 0 ? <span className="hg-stars">{[0, 1, 2].map(i => <i key={i} className={i < stars ? 'is-on' : ''}>★</i>)}</span> : <span className="hg-lock">Locked</span>}
          </div>
        ))}
      </div>
      <Prompts />
    </>
  )
}

function CarSelect() {
  const classes = ['All', ...new Set(cars.map(car => car.cls))]
  const picked = cars[0]
  return (
    <>
      <Backdrop photo="snow" shade={.88} /><Tabs active="Cars" />
      <ul className="hg-classes"><li className="hg-classes__title">Class</li>
        {classes.map((name, i) => <li key={name} className={i === 0 ? 'is-on' : ''}><span>{name}</span><em>{i === 0 ? cars.length : cars.filter(car => car.cls === name).length}</em></li>)}
      </ul>
      <div className="hg-cargrid">
        {cars.map(car => (
          <div key={car.name} className={`hg-gcard${car === picked ? ' is-on' : ''}`} style={{ '--tint': car.color }}>
            <b>{car.rating}</b><CarArt type={car.type} color={car.color} /><strong>{car.name}</strong><small>{car.cls}</small>
          </div>
        ))}
      </div>
      <aside className="hg-panel hg-panel--pick">
        <small>{picked.cls}</small><h3>{picked.name}</h3>
        <div className="hg-pick__art" style={{ '--tint': picked.color }}><CarArt type={picked.type} color={picked.color} /></div>
        <ul className="hg-bars"><Bar label="Top speed" value={picked.stats[0]} /><Bar label="Accel" value={picked.stats[1]} /><Bar label="Handling" value={picked.stats[2]} /><Bar label="Boost" value={picked.stats[3]} /></ul>
        <button type="button" className="hg-action">Select car</button>
      </aside>
      <Prompts items={[['A', 'Select'], ['B', 'Back'], ['X', 'Compare'], ['Y', 'Filter']]} />
    </>
  )
}

function Cars() {
  const list = cars.slice(0, 5)
  return (
    <>
      <Backdrop photo="sky" shade={.55} /><Tabs active="Cars" />
      <div className="hg-showcase"><small>Hypercar · Class S</small><h2>Spyder 918</h2></div>
      <aside className="hg-panel hg-panel--stats">
        <h3>Performance</h3>
        <ul className="hg-bars"><Bar label="Top speed" value={94} /><Bar label="Acceleration" value={88} /><Bar label="Handling" value={82} /><Bar label="Boost" value={90} /></ul>
        <h3>Upgrades</h3>
        <div className="hg-tags"><span>Engine III</span><span>Turbo II</span><span>Tyres — Slick</span><span>Livery — Ember</span></div>
        <button type="button" className="hg-action">Select car</button>
      </aside>
      <div className="hg-strip">{list.map((car, i) => <div key={car.name} className={`hg-chip${i === 0 ? ' is-on' : ''}`}><CarArt type={car.type} color={car.color} /><span>{car.name}</span></div>)}</div>
      <Prompts items={[['A', 'Select'], ['B', 'Back'], ['Y', 'Tune']]} />
    </>
  )
}

function Lobby() {
  const rows = [['Samy', 'Spyder 918', true], ['Ife D.', 'Vanta S', true], ['Tola A.', 'Kestrel GT', true], ['Nia O.', 'Aero R', false], ['Dayo K.', 'Spyder 918', true], ['Ada E.', 'Nomad X', true], ['Kunle B.', 'Vanta S', false], ['Open slot', '', null]]
  const tracks = [['Hong Kong Harbour', 5], ['Alpine Pass', 2], ['Night Harbour', 0]]
  return (
    <>
      <Backdrop photo="snow" shade={.84} /><Tabs active="Multiplayer" />
      <section className="hg-panel hg-panel--lobby">
        <header><h3>Lobby</h3><span>7 / 8 players</span><em>Starting in 0:12</em></header>
        <ul className="hg-rows">{rows.map(([name, car, ready], i) => (
          <li key={name} className={ready === null ? 'is-open' : ''}><b>{i + 1}</b><i>{name[0]}</i><strong>{name}</strong><span>{car}</span>
            <em className={ready ? 'is-ready' : ''}>{ready === null ? 'Waiting…' : ready ? 'Ready' : 'Choosing'}</em></li>
        ))}</ul>
      </section>
      <aside className="hg-panel hg-panel--vote">
        <h3>Track vote</h3>
        {tracks.map(([name, votes]) => <div key={name} className="hg-vote"><span>{name}</span><i><b style={{ width: `${votes * 18}%` }} /></i><em>{votes}</em></div>)}
        <button type="button" className="hg-action">Ready</button>
      </aside>
      <Prompts items={[['A', 'Ready'], ['B', 'Leave'], ['Y', 'Options']]} />
    </>
  )
}

function Hud() {
  const standings = [['Tola A.', '+0.0'], ['Ife D.', '+1.4'], ['Samy', '+2.9'], ['Dayo K.', '+3.7'], ['Ada E.', '+5.2']]
  return (
    <>
      <div className="hg-bg hg-bg--hud" /><div className="hg-shade hg-shade--hud" />
      <div className="hg-hud hg-hud--pos"><small>Position</small><strong>3<sup>/8</sup></strong></div>
      <div className="hg-hud hg-hud--lap"><small>Lap</small><strong>2<sup>/3</sup></strong><small>Time</small><strong>1:48.22</strong></div>
      <svg className="hg-minimap" viewBox="0 0 120 120" aria-hidden="true"><path d="M24 80C10 56 26 24 60 20s58 16 42 50-50 40-78 10z" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="5" /><circle cx="86" cy="30" r="6" fill="#2f7bff" /><circle cx="102" cy="52" r="5" fill="#fff" /></svg>
      <div className="hg-nitro"><small>Nitro</small><i><b /></i></div>
      <div className="hg-speedo"><svg viewBox="0 0 420 230" aria-hidden="true"><path d="M30 210A180 180 0 0 1 390 210" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="14" strokeLinecap="round" /><path d="M30 210A180 180 0 0 1 300 55" fill="none" stroke="#ff7a1a" strokeWidth="14" strokeLinecap="round" /></svg><strong>187</strong><span>km/h</span><em>5</em></div>
      <ul className="hg-standings">{standings.map(([name, gap], i) => <li key={name} className={name === 'Samy' ? 'is-you' : ''}><b>{i + 1}</b>{name}<em>{gap}</em></li>)}</ul>
    </>
  )
}

function Results() {
  const rows = [['Samy', 'Spyder 918', '2:41.22', '—'], ['Tola A.', 'Kestrel GT', '2:42.60', '+1.38'], ['Ife D.', 'Vanta S', '2:44.05', '+2.83'], ['Dayo K.', 'Spyder 918', '2:45.91', '+4.69'], ['Ada E.', 'Nomad X', '2:47.30', '+6.08'], ['Nia O.', 'Aero R', '2:49.12', '+7.90']]
  return (
    <>
      <Backdrop photo="sky" shade={.84} />
      <section className="hg-panel hg-panel--board">
        <header><small>Hydra’s Cup · Round 3</small><h2>Final standings</h2></header>
        <table className="hg-table"><tbody>{rows.map(([name, car, time, gap], i) => <tr key={name} className={i === 0 ? 'is-you' : ''}><td>{i + 1}</td><td>{name}</td><td>{car}</td><td>{time}</td><td>{gap}</td></tr>)}</tbody></table>
      </section>
      <aside className="hg-winner"><div className="hg-pilot" /><div><small>You finished</small><strong>1<sup>st</sup></strong></div>
        <ul><li><b>+2,400</b> coins</li><li><b>+900</b> XP</li><li><b>Ember</b> livery unlocked</li></ul></aside>
      <Prompts items={[['A', 'Continue'], ['Y', 'Rematch']]} />
    </>
  )
}

function Progress() {
  const rounds = ['Rookie', 'Street', 'Harbour', 'Alpine', 'Night', 'Circuit', 'Pro', 'Final']
  const rewards = [['Livery', 'Ember'], ['Car', 'Spyder 918'], ['Upgrade', 'Boost IV'], ['Frame', 'Gold lap']]
  return (
    <>
      <Backdrop photo="snow" shade={.86} /><Tabs active="Progress" />
      <div className="hg-level"><small>Season 1</small><h2>Level 14</h2><i><b /></i><span>3,120 / 4,800 XP</span></div>
      <ol className="hg-ladder">{rounds.map((name, i) => <li key={name} className={i < 2 ? 'is-done' : i === 2 ? 'is-now' : ''}><i>{i + 1}</i><span>{name}</span></li>)}</ol>
      <div className="hg-rewards">{rewards.map(([kind, name]) => <div key={name}><small>{kind}</small><strong>{name}</strong></div>)}</div>
      <Prompts />
    </>
  )
}

export const hydraScreens = [
  { id: 'start', label: 'Start', note: 'Original design', purpose: 'One image, one logo, and nothing between the player and the game.', render: () => <Original src="hydra-home-screen.webp" alt="Hydra Race start screen" /> },
  { id: 'menu', label: 'Main menu', note: 'Original design', purpose: 'Three choices over a living scene. Continue is the only blue button.', render: () => <Original src="hydra-onboarding-2.webp" alt="Hydra Race main menu: Continue, Options, Exit" /> },
  { id: 'home', label: 'Home', note: 'Original design', purpose: 'Bumper tabs across the top, featured races as large cards, the driver standing in the garage.', render: () => <Original src="hydra-onboarding-race.webp" alt="Hydra Race home screen with featured races" /> },
  { id: 'single', label: 'Single player', purpose: 'Every event is a card with its progress. Locked ones say what unlocks them.', render: SinglePlayer },
  { id: 'select', label: 'Car select', purpose: 'Twelve cars across nine classes. Filter by type, read a rating at a glance, and pick without leaving the grid.', render: CarSelect },
  { id: 'cars', label: 'Car detail', purpose: 'A car is four numbers and a livery. The strip below keeps the whole garage in reach.', render: Cars },
  { id: 'lobby', label: 'Multiplayer lobby', purpose: 'Who is ready, what they drive, and which track is winning the vote.', render: Lobby },
  { id: 'hud', label: 'Race HUD', purpose: 'Speed is the largest thing on screen. Position, lap and the map stay at the edges so the road stays clear.', render: Hud },
  { id: 'results', label: 'Results', purpose: 'The result first, the rewards second, the full standings for anyone who wants them.', render: Results },
  { id: 'progress', label: 'Progress', purpose: 'Where you are in the season, what is next, and what it unlocks.', render: Progress },
]
