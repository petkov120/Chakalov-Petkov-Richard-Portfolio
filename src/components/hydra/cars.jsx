const CAR_ASSET = '/images/playground/cars/'

export default function CarArt({ car, type, color }) {
  const src = car?.src ?? cars.find(item => item.type === type)?.src

  return (
    <span className="hg-car hg-car--rendered" style={{ '--car-color': color ?? car?.color }}>
      <img src={CAR_ASSET + src?.replace(/\.png$/, '.webp')} alt="" aria-hidden="true" />
      <i aria-hidden="true" />
    </span>
  )
}

export const cars = [
  { name: 'Spyder 918', cls: 'Hypercar', type: 'hypercar', src: 'hydra-red-hypercar.png', color: '#ff2b3a', rating: 96, stats: [94, 88, 82, 90] },
  { name: 'Vanta S', cls: 'Hypercar', type: 'hypercar', src: 'hydra-silver-gt.png', color: '#c7ccd6', rating: 93, stats: [90, 84, 92, 78] },
  { name: 'Aero GT', cls: 'Grand tourer', type: 'gt', src: 'hydra-silver-gt.png', color: '#3a7bff', rating: 88, stats: [86, 78, 84, 70] },
  { name: 'Meridian', cls: 'Grand tourer', type: 'gt', src: 'hydra-silver-gt.png', color: '#d9c7a3', rating: 84, stats: [82, 72, 80, 66] },
  { name: 'Bruiser 70', cls: 'Muscle', type: 'muscle', src: 'hydra-orange-muscle.png', color: '#ff7a1a', rating: 86, stats: [88, 90, 62, 74] },
  { name: 'Mako V8', cls: 'Muscle', type: 'muscle', src: 'hydra-orange-muscle.png', color: '#52e08a', rating: 82, stats: [84, 86, 58, 70] },
  { name: 'Ridge R', cls: 'Rally', type: 'rally', src: 'hydra-blue-rally.png', color: '#4aa3ff', rating: 85, stats: [78, 88, 94, 72] },
  { name: 'Dune X', cls: 'Off-road', type: 'suv', src: 'hydra-blue-rally.png', color: '#e0a458', rating: 79, stats: [70, 74, 80, 66] },
  { name: 'Volt E1', cls: 'Electric', type: 'ev', src: 'hydra-silver-gt.png', color: '#2de2c8', rating: 90, stats: [88, 96, 86, 92] },
  { name: 'Formula H', cls: 'Open-wheel', type: 'formula', src: 'hydra-red-hypercar.png', color: '#ff4a4a', rating: 98, stats: [98, 94, 96, 80] },
  { name: 'Drift K', cls: 'Drift', type: 'drift', src: 'hydra-orange-muscle.png', color: '#b36bff', rating: 83, stats: [80, 82, 98, 76] },
  { name: 'Hauler T', cls: 'Truck', type: 'truck', src: 'hydra-blue-rally.png', color: '#ffd23f', rating: 74, stats: [66, 70, 60, 64] },
]
