const screens = [
  { id: 'portfolio', label: 'Portfolio', purpose: 'Understand the current position' },
  { id: 'asset-detail', label: 'Asset detail', purpose: 'Understand why performance changed' },
  { id: 'order', label: 'Order', purpose: 'Choose an amount with confidence' },
  { id: 'review', label: 'Review', purpose: 'Verify the decision before committing' },
  { id: 'confirmed', label: 'Confirmed', purpose: 'Know exactly what changed' },
]

export default function InvestmentUI({ screen }) {
  const current = screens.find((item) => item.id === screen) ?? screens[0]

  return (
    <div className="ui-canvas ui-canvas--investment">
      <div className="ui-canvas__status"><span>9:41</span><i /><span>•••</span></div>
      <main className="ui-canvas__blank">
        <span className="ui-canvas__project">Investment</span>
        <div>
          <span className="ui-canvas__number">{String(screens.indexOf(current) + 1).padStart(2, '0')}</span>
          <h2>{current.label}</h2>
          <p>{current.purpose}</p>
        </div>
        <small>Replace this neutral canvas in InvestmentUI.jsx</small>
      </main>
    </div>
  )
}

export { screens as investmentScreens }
