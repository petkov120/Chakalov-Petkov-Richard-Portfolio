export default function About() {
  return (
    <section id="about" className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="rule mb-16" />

      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            About
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-5 space-y-5 text-lg md:text-xl leading-relaxed text-pretty">
          <p>I'm a product designer who codes.</p>
          <p>
            I started in design and grew into the codebase because the work
            demanded it. I'm most useful at early stage companies where one
            person needs to own the brand, the system, and the shipped features
            and where the product is technical enough that designers usually
            flinch.
          </p>
          <p className="text-muted">
            Lagos. Open to senior design engineer or founding designer roles
            globally.
          </p>
        </div>
      </div>
    </section>
  )
}
