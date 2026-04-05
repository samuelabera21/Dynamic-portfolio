"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProject } from "@/lib/api";
import { Project } from "@/types/project";

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      setIsOverviewExpanded(false);
      try {
        const data = await getProject(params.id);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch project");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params.id]);

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm text-slate-300">Loading project details...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium text-red-300">{error}</p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm text-slate-300">Project not found.</p>
        </div>
      </section>
    );
  }

  const overviewNeedsCollapse = project.description.trim().length > 900;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-56 h-72 w-72 rounded-full bg-blue-600/12 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-cyan-300/50 hover:text-cyan-100"
        >
          Back to Projects
        </Link>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1324]/90 shadow-[0_14px_38px_rgba(2,6,16,0.55)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_1fr]">
            <div className="group relative min-h-[280px] overflow-hidden border-b border-white/10 bg-[#09111f] lg:min-h-[360px] lg:border-b-0 lg:border-r">
              {project.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl transition duration-500 group-hover:scale-[1.14] group-hover:opacity-35"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="relative h-full w-full object-contain p-5 transition duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1 sm:p-7"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.18),transparent_50%)] opacity-60 transition duration-500 group-hover:opacity-90" />
                  <div className="pointer-events-none absolute -inset-y-10 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition-all duration-700 group-hover:left-[115%] group-hover:opacity-100" />
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                  No image available
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#060c18]/70 to-transparent" />
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <header className="space-y-4">
                <span className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                  Project Detail
                </span>
                <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {project.title}
                </h1>
              </header>

              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-100">Tech Stack</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.length > 0 ? (
                    project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-300">No tech stack listed.</p>
                  )}
                </div>
              </section>

              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-slate-100">Links</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                    >
                      GitHub
                    </a>
                  ) : null}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-cyan-300/35 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Live Demo
                    </a>
                  ) : null}
                  {!project.githubUrl && !project.liveUrl ? (
                    <p className="text-sm text-slate-300">No public links available.</p>
                  ) : null}
                </div>
              </section>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">Overview</h2>
            <div
              className={`relative mt-4 rounded-2xl border border-white/10 bg-[#0a1427]/70 p-5 sm:p-6 ${
                overviewNeedsCollapse && !isOverviewExpanded ? "max-h-[360px] overflow-hidden" : ""
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-200 sm:text-base">
                {project.description}
              </p>
              {overviewNeedsCollapse && !isOverviewExpanded ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1427] via-[#0a1427]/85 to-transparent" />
              ) : null}
            </div>

            {overviewNeedsCollapse ? (
              <button
                type="button"
                onClick={() => setIsOverviewExpanded((prev) => !prev)}
                className="mt-4 inline-flex rounded-lg border border-cyan-300/35 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                {isOverviewExpanded ? "Show less" : "Read full overview"}
              </button>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
