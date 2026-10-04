// Side-on silhouettes, one body shape per type, tinted by the car's colour (currentColor).
// All are drawn in a 320 x 112 box with the road at y = 100 and the nose pointing right.
const dark = '#0b0d14'

const TYPES = {
  // low cab-forward wedge, big wing, side intake
  hypercar: { wheels: [84, 246], r: 18, y: 86,
    body: 'M12 86V66l14-6 62-8 36-12 62-9 50 15 64 20 14 10v10z',
    glass: 'M132 50l56-13 38 13z',
    extra: <><path d="M4 48h42v6H4zM14 54v12M36 54v8" stroke="currentColor" strokeWidth="3" /><path d="M120 68h50v6h-50z" fill={dark} opacity=".5" /><path d="M286 84h30v4h-30z" fill="currentColor" /></> },
  // long bonnet, sweeping fastback
  gt: { wheels: [80, 246], r: 18, y: 86,
    body: 'M10 86V72c0-6 8-8 18-10l68-8c24-20 62-24 88-22 24 2 44 12 62 28l56 10c12 3 16 8 16 16v10z',
    glass: 'M122 52c16-14 38-17 62-16 22 1 36 8 48 18z',
    extra: <path d="M262 62h32v4h-32z" fill={dark} opacity=".45" /> },
  // boxy two-door, flat roof, bonnet scoop, duck-tail
  muscle: { wheels: [86, 240], r: 18, y: 86,
    body: 'M10 86V66c0-4 4-6 10-7l54-3 18-3 20-20h92l30 22 58 8c10 2 24 6 24 16v7z',
    glass: 'M118 52l12-14h78l22 14z',
    extra: <><path d="M10 58h28v5H10z" fill="currentColor" /><path d="M250 54h32l-6-6h-20z" fill={dark} opacity=".6" /><path d="M120 66h104" stroke={dark} strokeWidth="3" opacity=".35" /></> },
  // short tall hatch, huge wing, roof scoop, fog lights
  rally: { wheels: [78, 244], r: 20, y: 84,
    body: 'M10 86V58l14-8 20-4 22-24h104l40 26 70 8c8 2 14 8 14 18v8z',
    glass: 'M84 46l12-18h64l28 18z',
    extra: <><path d="M2 32h54v6H2zM12 38v14M44 38v10" stroke="currentColor" strokeWidth="3" /><path d="M120 18h28v4h-28z" fill="currentColor" /><path d="M296 64h14v6h-14z" fill="#fff" /></> },
  // tall boxy wagon, roof rack, lifted
  suv: { wheels: [84, 242], r: 25, y: 84,
    body: 'M12 84V42c0-6 4-10 10-10h26l14-18h138l36 22 52 8c14 4 24 10 24 22v18z',
    glass: 'M70 32l12-14h118l28 14z',
    extra: <><path d="M74 8h124M88 8v6M184 8v6" stroke="currentColor" strokeWidth="3" /><path d="M304 62h10v20h-10z" fill={dark} opacity=".6" /></> },
  // smooth teardrop, no grille, light bars
  ev: { wheels: [80, 246], r: 18, y: 86,
    body: 'M10 86V72c0-6 14-10 34-14l60-10c26-18 66-20 100-14 28 6 46 18 64 30l30 6c12 3 20 8 20 16v10z',
    glass: 'M110 48c24-14 62-16 90-10 18 4 34 12 46 20z',
    extra: <><path d="M282 66h32v3h-32z" fill="#fff" /><path d="M8 66h18v3H8z" fill="#ff4a4a" /></> },
  // open wheels, halo, front and rear wing
  formula: { wheels: [64, 262], r: 24, y: 80,
    body: 'M80 84c30-14 74-22 108-22l40 4 74 14v10H80z',
    glass: 'M146 64c4-12 22-16 36-10l8 10z',
    extra: <><path d="M8 38h48v6H8zM30 44v30" stroke="currentColor" strokeWidth="3" /><path d="M118 62l12-18h16v20z" fill="currentColor" /><path d="M150 54c10-10 30-12 42 0" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M284 92h34v5h-34z" fill="currentColor" /></> },
  // low coupe, wide flares, giant wing
  drift: { wheels: [80, 246], r: 19, y: 86,
    body: 'M10 86V74c0-6 8-10 20-12l58-6c24-18 56-24 88-20 22 4 42 14 56 28l56 8c12 3 28 8 28 18v10z',
    glass: 'M116 54c16-12 38-16 58-14 18 2 32 10 42 20z',
    extra: <><path d="M2 38h62v7H2zM16 45v17M52 45v14" stroke="currentColor" strokeWidth="3" /><ellipse cx="80" cy="84" rx="30" ry="22" fill="currentColor" /><ellipse cx="246" cy="84" rx="30" ry="22" fill="currentColor" /><path d="M4 82h12v4H4z" fill="#fff" /></> },
  // pickup: tall cab, low open bed, light bar
  truck: { wheels: [72, 250], r: 24, y: 82,
    body: 'M10 84V56h118V50l18-26h62l34 24 50 6c12 2 20 8 20 18v12z',
    glass: 'M152 46l10-18h46l26 18z',
    extra: <><path d="M14 56h110" stroke={dark} strokeWidth="5" opacity=".55" /><path d="M158 14h42v4h-42z" fill="currentColor" /><path d="M2 82h10v5H2z" fill={dark} opacity=".7" /></> },
}

export default function CarArt({ type, color }) {
  const t = TYPES[type]
  return (
    <svg className="hg-car" viewBox="0 0 320 112" aria-hidden="true" style={{ color }}>
      <ellipse cx="160" cy="103" rx="148" ry="8" fill="#000" opacity=".5" />
      <path d={t.body} fill="currentColor" />
      {t.extra}
      <path d={t.glass} fill={dark} opacity=".9" />
      {t.wheels.map(x => <circle key={`a${x}`} cx={x} cy={t.y} r={t.r * 1.2} fill={dark} />)}
      {t.wheels.map(x => <g key={x}><circle cx={x} cy={t.y} r={t.r} fill="#07080c" /><circle cx={x} cy={t.y} r={t.r * .52} fill="#2a2d38" /><circle cx={x} cy={t.y} r={t.r * .18} fill="currentColor" /></g>)}
    </svg>
  )
}

export const cars = [
  { name: 'Spyder 918', cls: 'Hypercar', type: 'hypercar', color: '#ff2b3a', rating: 96, stats: [94, 88, 82, 90] },
  { name: 'Vanta S', cls: 'Hypercar', type: 'hypercar', color: '#c7ccd6', rating: 93, stats: [90, 84, 92, 78] },
  { name: 'Aero GT', cls: 'Grand tourer', type: 'gt', color: '#3a7bff', rating: 88, stats: [86, 78, 84, 70] },
  { name: 'Meridian', cls: 'Grand tourer', type: 'gt', color: '#d9c7a3', rating: 84, stats: [82, 72, 80, 66] },
  { name: 'Bruiser 70', cls: 'Muscle', type: 'muscle', color: '#ff7a1a', rating: 86, stats: [88, 90, 62, 74] },
  { name: 'Mako V8', cls: 'Muscle', type: 'muscle', color: '#52e08a', rating: 82, stats: [84, 86, 58, 70] },
  { name: 'Ridge R', cls: 'Rally', type: 'rally', color: '#4aa3ff', rating: 85, stats: [78, 88, 94, 72] },
  { name: 'Dune X', cls: 'Off-road', type: 'suv', color: '#e0a458', rating: 79, stats: [70, 74, 80, 66] },
  { name: 'Volt E1', cls: 'Electric', type: 'ev', color: '#2de2c8', rating: 90, stats: [88, 96, 86, 92] },
  { name: 'Formula H', cls: 'Open-wheel', type: 'formula', color: '#ff4a4a', rating: 98, stats: [98, 94, 96, 80] },
  { name: 'Drift K', cls: 'Drift', type: 'drift', color: '#b36bff', rating: 83, stats: [80, 82, 98, 76] },
  { name: 'Hauler T', cls: 'Truck', type: 'truck', color: '#ffd23f', rating: 74, stats: [66, 70, 60, 64] },
]
