"use client";

import { useEffect, useMemo, useState } from "react";
import { getHome } from "@/lib/api";
import { HomeData } from "@/types/home";

function formatMonthYear(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function shortProjectSummary(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= 160) return compact;
  return `${compact.slice(0, 157)}...`;
}

export default function ResumePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getHome();
        setHomeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load resume data");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const allSkills = useMemo(() => {
    if (!homeData?.skills) return [];
    return Object.values(homeData.skills).flat();
  }, [homeData]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#05070d] px-6 py-16 text-slate-100 lg:px-10">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="h-10 w-40 animate-pulse rounded bg-white/10" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-96 animate-pulse rounded-2xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !homeData) {
    return (
      <section className="min-h-screen bg-[#05070d] px-6 py-16 text-slate-100 lg:px-10">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
          <h1 className="text-2xl font-bold text-white">Resume</h1>
          <p className="mt-3 text-sm text-red-200">{error ?? "Unable to load resume data."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#05070d] text-slate-100">
      <div className="border-b border-white/10 bg-black/70">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 lg:px-10">
          <h1 className="text-center font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">Resume</h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
        <article>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Summary</h2>

          <div className="mt-6 border-l-2 border-emerald-400/80 pl-5">
            <h3 className="text-lg font-bold uppercase tracking-wide text-white">Samuel Abera</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              I am a software engineering student interested in web development and artificial intelligence.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-200 marker:text-emerald-400">
              <li>Email: samuelabera.dev@gmail.com</li>
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/samuelabera21/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  github.com/samuelabera21
                </a>
              </li>
              <li>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/samuelabera21/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  linkedin.com/in/samuelabera21
                </a>
              </li>
            </ul>
          </div>

          <h2 className="mt-10 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Education</h2>

          <div className="mt-6 space-y-8">
            <div className="border-l-2 border-emerald-400/80 pl-5">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">BSc in Software Engineering</h3>
              <p className="mt-2 text-sm italic text-slate-300">Debre Berhan University</p>
            </div>
          </div>

          <h2 className="mt-10 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Skills</h2>
          <div className="mt-6 border-l-2 border-emerald-400/80 pl-5">
            {allSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                No skills yet. Add skills from admin panel and they will appear here automatically.
              </p>
            )}
          </div>
        </article>

        <article>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Projects</h2>

          <div className="mt-6 space-y-8">
            {homeData.featuredProjects.length > 0 ? (
              homeData.featuredProjects.map((project) => (
                <div key={project.id} className="border-l-2 border-emerald-400/80 pl-5">
                  <h3 className="text-base font-bold uppercase tracking-wide text-white">{project.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {formatMonthYear(project.createdAt)}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-300">{shortProjectSummary(project.description)}</p>

                  {project.techStack.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={`${project.id}-${tech}`}
                          className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <a
                      href={`/projects/${project.id}`}
                      className="rounded-lg border border-cyan-300/35 bg-cyan-500/10 px-3 py-1.5 font-semibold text-cyan-100 hover:bg-cyan-500/20"
                    >
                      Full Details
                    </a>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 font-semibold text-slate-100 hover:bg-white/10"
                      >
                        GitHub
                      </a>
                    ) : null}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-100 hover:bg-emerald-500/20"
                      >
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="border-l-2 border-emerald-400/80 pl-5">
                <p className="text-sm leading-7 text-slate-300">
                  No projects yet. Add projects from admin panel and featured projects will show here automatically.
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
