"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/api";
import { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjects({
          search: search || undefined,
          tech: tech || undefined,
        });
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load projects");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(run, 250);
    return () => clearTimeout(timeout);
  }, [search, tech]);

  const techOptions = useMemo(() => {
    const all = projects.flatMap((project) => project.techStack);
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Projects</h1>
        <p className="mt-2 text-sm text-slate-600">Explore published portfolio work with search and technology filters.</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or description"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 md:col-span-2"
        />
        <select
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All technologies</option>
          {techOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading projects...</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {!loading && !error && projects.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">No projects found for the current filters.</p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
