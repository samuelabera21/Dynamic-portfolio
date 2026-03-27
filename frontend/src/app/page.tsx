import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-lg sm:p-12">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="relative max-w-2xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Portfolio CMS
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight sm:text-5xl">
            A clean portfolio experience for sharing your best work.
          </h1>
          <p className="text-sm leading-7 text-blue-50 sm:text-base">
            Explore projects, technologies, and case studies in a fast, responsive interface built for
            public viewing.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/projects"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Projects</p>
          <p className="mt-2 text-sm text-slate-600">Showcase featured and published work in a polished project gallery.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Discovery</p>
          <p className="mt-2 text-sm text-slate-600">Visitors can search and filter projects by title, description, and tech stack.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Details</p>
          <p className="mt-2 text-sm text-slate-600">Each project includes dedicated details with stack badges and external links.</p>
        </div>
      </div>
    </section>
  );
}
