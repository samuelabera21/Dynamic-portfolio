export default function ResumePage() {
  return (
    <section className="min-h-screen bg-[#05070d] text-slate-100">
      <div className="border-b border-white/10 bg-black/70">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 lg:px-10">
          <h1 className="text-center font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">Resume</h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-8 text-slate-300 sm:text-base">
            Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio
            voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.
          </p>
        </div>
      </div>

      <div className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-4 text-sm font-semibold lg:px-10">
          <span className="text-emerald-400">Home</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-200">Resume</span>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
        <article>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Summary</h2>

          <div className="mt-6 border-l-2 border-emerald-400/80 pl-5">
            <h3 className="text-lg font-bold uppercase tracking-wide text-white">Brandon Johnson</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Innovative and deadline-driven Graphic Designer with 3+ years of experience designing and developing
              user-centered digital/print marketing material from initial concept to final, polished deliverable.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-200 marker:text-emerald-400">
              <li>Portland par 127, Orlando, FL</li>
              <li>(123) 456-7891</li>
              <li>alice.barkley@example.com</li>
            </ul>
          </div>

          <h2 className="mt-10 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Education</h2>

          <div className="mt-6 space-y-8">
            <div className="border-l-2 border-emerald-400/80 pl-5">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Master of Fine Arts &amp; Graphic Design</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">2015 - 2016</p>
              <p className="mt-2 text-sm italic text-slate-300">Rochester Institute of Technology, Rochester, NY</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit. Ea vero voluptatum qui
                ut dignissimos deleniti nerada porti sand markend.
              </p>
            </div>

            <div className="border-l-2 border-emerald-400/80 pl-5">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Bachelor of Fine Arts &amp; Graphic Design</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">2010 - 2014</p>
              <p className="mt-2 text-sm italic text-slate-300">Rochester Institute of Technology, Rochester, NY</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis et quis Eius vel ratione eius
                unde vitae rerum voluptates asperiores voluptatem Earum molestiae consequatur neque etlon sader mart
                dila.
              </p>
            </div>
          </div>
        </article>

        <article>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Professional Experience</h2>

          <div className="mt-6 space-y-8">
            <div className="border-l-2 border-emerald-400/80 pl-5">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Senior graphic design specialist</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">2019 - Present</p>
              <p className="mt-2 text-sm italic text-slate-300">Experion, New York, NY</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300 marker:text-emerald-400">
                <li>Lead in the design, development, and implementation of the graphic, layout, and production communication materials.</li>
                <li>Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.</li>
                <li>Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design.</li>
                <li>Oversee the efficient use of production project budgets ranging from $2,000 - $25,000.</li>
              </ul>
            </div>

            <div className="border-l-2 border-emerald-400/80 pl-5">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">Graphic design specialist</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">2017 - 2018</p>
              <p className="mt-2 text-sm italic text-slate-300">Stepping Stone Advertising, New York, NY</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300 marker:text-emerald-400">
                <li>Developed numerous marketing programs (logos, brochures, infographics, presentations, and advertisements).</li>
                <li>Managed up to 5 projects or tasks at a given time while under pressure.</li>
                <li>Recommended and consulted with clients on the most appropriate graphic design direction.</li>
                <li>Created 4+ design presentations and proposals a month for clients and account managers.</li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <footer className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 text-center lg:px-10">
          <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Personal</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
            Et aut eum quis fuga eos sunt ipsa nihil. Labore corporis magni eligendi fuga maxime saepe commodi placeat.
          </p>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            Copyright Personal All Rights Reserved
          </p>
        </div>
      </footer>
    </section>
  );
}
