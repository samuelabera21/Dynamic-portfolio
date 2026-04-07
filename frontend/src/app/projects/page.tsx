"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/api";
import { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");
  const introText = "Explore selected work with a clean view of real projects, filters, and previews.";
  const introChars = introText.split("");

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
    <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-blue-600/12 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4 }}
            className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl"
          >
            {introChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15, delay: index * 0.01 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300"
          >
            Explore selected work with a clean view of real projects, filters, and previews.
          </motion.p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or description"
            className="rounded-xl border border-white/15 bg-[#0b1730]/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/70 md:col-span-2"
          />
          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#0b1730]/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/70"
          >
            <option value="">All technologies</option>
            {techOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading ? <p className="text-sm text-slate-300">Loading projects...</p> : null}
        {error ? <p className="text-sm font-medium text-red-300">{error}</p> : null}

        {!loading && !error && projects.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">No projects found for the current filters.</p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
