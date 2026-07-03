import SiteNav from '../components/layout/SiteNav'

const stubEntries = [
  {
    date: 'Jun 2026',
    tag: 'Note',
    title: 'Rebuilding the portfolio as a product archive.',
    excerpt: 'Questions first. Evidence second. Wireframes, decks, and screens, not a screenshot reel.',
  },
  {
    date: 'May 2026',
    tag: 'Experiment',
    title: 'Dark index, light investigation rooms.',
    excerpt: 'Direction 4: vault catalog that opens into paper case files.',
  },
  {
    date: 'Apr 2026',
    tag: 'Research',
    title: 'AI tutoring loops vs chatbot patterns.',
    excerpt: 'What makes an AI teacher different from an AI assistant.',
  },
]

const riseDelays = ['rise-3', 'rise-4', 'rise-5']

export default function NowPage() {
  return (
    <main className="theme-paper min-h-screen">
      <div className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto margin-line">
        <SiteNav theme="paper" current="now" />

        <div className="mb-16 md:mb-20 rise rise-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
            Now
          </p>
          <h1 className="display text-4xl md:text-6xl leading-[1.05] text-balance">
            A living
            <span className="italic text-muted"> notebook.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted max-w-prose text-pretty">
            Current ideas, experiments, and half-formed thoughts. Updated as work happens.
          </p>
        </div>

        <div className="space-y-0">
          {stubEntries.map((entry, i) => (
            <article
              key={entry.title}
              className={`border-t border-rule py-10 md:py-12 rise ${riseDelays[i] ?? 'rise-5'}`}
            >
              <div className="grid md:grid-cols-12 gap-4 md:gap-8">
                <div className="md:col-span-2 font-mono text-xs text-muted space-y-1">
                  <div>{entry.date}</div>
                  <div className="uppercase tracking-wider">{entry.tag}</div>
                </div>
                <div className="md:col-span-10 space-y-3">
                  <h2 className="display text-2xl md:text-3xl leading-tight">
                    {entry.title}
                  </h2>
                  <p className="text-base text-muted leading-relaxed text-pretty max-w-prose">
                    {entry.excerpt}
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div className="border-t border-rule" />
        </div>
      </div>
    </main>
  )
}
