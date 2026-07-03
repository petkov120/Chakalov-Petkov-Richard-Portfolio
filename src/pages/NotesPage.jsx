import NotesMangaPanel from '../components/notes/NotesMangaPanel'
import SiteNav from '../components/layout/SiteNav'
import { notesChapters, notesFinale, notesIntro } from '../data/notes'

const riseDelays = ['rise-3', 'rise-4', 'rise-5', 'rise-6', 'rise-6', 'rise-6']

function NotesProse({ paragraphs }) {
  return (
    <div className="notes-page__prose">
      {paragraphs.map((block) => {
        const isBeat = block.type === 'beat'
        return (
          <p
            key={block.text}
            className={
              isBeat
                ? 'notes-page__beat display text-xl md:text-2xl leading-snug text-vault-text/92 text-pretty'
                : 'notes-page__line text-[1.05rem] md:text-lg text-vault-muted leading-[1.75] text-pretty max-w-prose'
            }
          >
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

export default function NotesPage() {
  return (
    <main className="theme-vault notes-page min-h-screen">
      <div className="px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32 max-w-wide mx-auto">
        <SiteNav theme="vault" current="notes" />

        <header className="notes-page__intro mb-14 md:mb-20 rise rise-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-vault-muted mb-6">
            {notesIntro.eyebrow}
          </p>
          <blockquote className="notes-page__epigraph display text-[1.65rem] md:text-[2rem] italic text-vault-text/88 leading-[1.2] text-balance max-w-2xl mb-8">
            “{notesIntro.epigraph.replace(/^"|"$/g, '')}”
          </blockquote>
          <p className="display text-[2rem] md:text-[2.65rem] text-vault-text leading-[1.08] text-balance max-w-2xl">
            {notesIntro.lead}
          </p>
          <p className="notes-page__intro-lead mt-5 text-[1.05rem] md:text-lg text-vault-muted leading-[1.75] text-pretty max-w-prose">
            {notesIntro.sublead}
          </p>
        </header>

        <div className="space-y-0">
          {notesChapters.map((ch, i) => (
            <article
              key={ch.chapter}
              className={`border-t border-vault-rule py-12 md:py-[4.5rem] rise ${riseDelays[i] ?? 'rise-6'}`}
            >
              <div className="grid md:grid-cols-12 gap-6 md:gap-12">
                <div className="md:col-span-2 md:pt-1">
                  <span className="notes-page__chapter font-mono text-xs text-vault-muted">
                    Ch. {ch.chapter}
                  </span>
                </div>
                <div className="md:col-span-10 space-y-7 md:space-y-8">
                  <h2 className="display text-[1.85rem] md:text-[2.35rem] leading-[1.1] text-balance text-vault-text">
                    {ch.title}
                  </h2>

                  <NotesMangaPanel panel={ch.panel} />

                  <NotesProse paragraphs={ch.paragraphs} />
                </div>
              </div>
            </article>
          ))}

          <article className="border-t border-vault-rule py-12 md:py-[4.5rem] rise rise-6">
            <div className="space-y-8">
              <div className="grid md:grid-cols-12 gap-6 md:gap-12">
                <div className="md:col-span-2 md:pt-1">
                  <span className="notes-page__chapter font-mono text-xs text-vault-muted">
                    {notesFinale.chapter}
                  </span>
                </div>
                <div className="md:col-span-10">
                  <h2 className="display text-[1.85rem] md:text-[2.35rem] leading-[1.1] text-balance text-vault-text">
                    {notesFinale.title}
                  </h2>
                </div>
              </div>

              <NotesMangaPanel panel={notesFinale.panel} />

              <div className="grid md:grid-cols-12 gap-6 md:gap-12">
                <div className="hidden md:block md:col-span-2" aria-hidden />
                <div className="md:col-span-10 space-y-8">
                  <NotesProse paragraphs={notesFinale.paragraphs} />

                  <blockquote className="notes-page__closing-quote">
                    {notesFinale.quote.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </blockquote>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
