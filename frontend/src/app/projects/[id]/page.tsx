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

  if (loading) return <p className="text-sm text-slate-500">Loading project details...</p>;
  if (error) return <p className="text-sm font-medium text-red-600">{error}</p>;
  if (!project) return <p className="text-sm text-slate-600">Project not found.</p>;

  return (
    <section className="space-y-6">
      <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
        Back to Projects
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-72 w-full bg-gradient-to-r from-blue-100 to-cyan-50">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-8 p-6">
          <header>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">
              {project.title}
            </h1>
          </header>

          <section>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{project.description}</p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">
              Tech Stack
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">Links</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  GitHub
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Live Demo
                </a>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
