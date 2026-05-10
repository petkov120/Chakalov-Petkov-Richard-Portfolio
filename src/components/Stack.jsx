import StackList from './StackList'

export default function Stack() {
  return (
    <section id="stack" className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="rule mb-16 md:mb-20" />

      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
            Stack
          </div>
          <p className="font-mono text-xs text-muted leading-relaxed max-w-[14rem]">
            What I use day to day, and what I reach for when speed matters.
          </p>
        </div>

        <div className="md:col-span-7 md:col-start-5 space-y-8 text-base md:text-lg leading-relaxed">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
              Design
            </div>
            <StackList items={[{ name: 'Figma', slug: 'figma' }]} />
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
              Ship
            </div>
            <StackList
              items={[
                { name: 'Cursor', slug: 'cursor', note: 'primary IDE' },
                { name: 'React', slug: 'react' },
                { name: 'Tailwind CSS', slug: 'tailwind' },
                { name: 'Vite', slug: 'vite' },
                { name: 'Git', slug: 'git' },
              ]}
            />
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Explore
            </div>
            <p className="text-pretty text-muted">
              V0 and Lovable for fast high-fidelity UI and flow exploration, then
              production work lives in Cursor and the repo.
            </p>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Supporting
            </div>
            <p className="text-pretty text-muted">
              Python for data scripts. Django for quick login flows and simple
              APIs. Engineers handle anything production critical.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
