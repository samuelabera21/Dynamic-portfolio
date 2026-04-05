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

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
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

  if (loading) return <p className="text-sm text-slate-300">Loading project details...</p>;
  if (error) return <p className="text-sm font-medium text-red-300">{error}</p>;
  if (!project) return <p className="text-sm text-slate-300">Project not found.</p>;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-blue-600/12 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl space-y-5 px-4 sm:px-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          <span aria-hidden="true">←</span>
          Back to Projects
        </Link>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1324]/92 shadow-[0_16px_40px_rgba(2,6,16,0.45)] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-white/10 p-4 lg:sticky lg:top-6 lg:h-fit lg:border-b-0 lg:border-r lg:border-white/10 lg:p-5">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#09111f]">
              <div className="relative aspect-[16/10] w-full">
                {project.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="relative h-full w-full object-contain"
                    />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                    No image available
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-7 lg:h-[74vh]">
            <header className="shrink-0 border-b border-white/10 pb-4">
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-white sm:text-4xl">
                {project.title}
              </h1>
            </header>

            <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#09111f]/50 p-4">
              <h2 className="text-lg font-semibold text-cyan-200">Overview</h2>
              <div className="mt-3 h-full min-h-0 overflow-y-auto pr-2">
                <p className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-200">{project.description}</p>
              </div>
            </section>

            <section className="shrink-0 border-t border-white/10 pt-4">
              <h2 className="text-lg font-semibold text-cyan-200">Tech Stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <h3 className="mt-4 text-sm font-semibold text-cyan-200">Links</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    GitHub
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
                  >
                    Live Demo
                  </a>
                ) : null}
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
