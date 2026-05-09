const otherWork = [
  {
    title: 'OpenXP',
    subtitle: 'WAEC/JAMB exam prep · Self-initiated',
    description:
      'Two years of iteration on a self-paced exam prep platform for Nigerian secondary students. V1 to V3, full design system, mobile and web. V3 in progress.',
    link: '#',
  },
  {
    title: 'Customer service tooling',
    subtitle: 'Internal tool design',
    description:
      'Agent workflows and ticket triage for a customer service operation.',
    link: '#',
  },
]

export default function OtherWork() {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="rule mb-16" />

      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            Other work
          </div>
        </div>

        <div className="md:col-span-9 space-y-12">
          {otherWork.map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="group block border-b border-rule pb-12 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                <h3 className="display text-3xl md:text-4xl">{item.title}</h3>
                <span className="font-mono text-xs text-muted">{item.subtitle}</span>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-muted max-w-prose">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
