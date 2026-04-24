"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/api";
import { Project } from "@/types/project";

type ProjectsPageClientProps = {
  initialProjects?: Project[];
  initialError?: string | null;
};

export default function ProjectsPageClient({
  initialProjects = [],
  initialError = null,
}: ProjectsPageClientProps) {
  const fallbackProjects: Project[] = [
    {
      id: "fallback-project-1",
      title: "Portfolio Performance Refresh",
      description: "A production-minded frontend update focused on faster navigation, graceful fallbacks, and better perceived speed during backend outages.",
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      techStack: ["Next.js", "TypeScript", "ISR", "UX"],
      featured: true,
      published: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "fallback-project-2",
      title: "Backend Resilience Layer",
      description: "Shared caching, compression, and outage handling to keep the portfolio responsive while external limits recover.",
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      techStack: ["Express", "Prisma", "Caching", "Compression"],
      featured: true,
      published: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "fallback-project-3",
      title: "Static Fallback Experience",
      description: "A fallback design that preserves the public site structure, content hierarchy, and professional feel when live data is temporarily unavailable.",
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      techStack: ["Fallback UI", "Accessibility", "Design System"],
      featured: false,
      published: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const filterProjects = (source: Project[], searchValue: string, techValue: string) => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    const normalizedTech = techValue.trim().toLowerCase();

    return source.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        [project.title, project.description, ...project.techStack].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );
      const matchesTech = !normalizedTech || project.techStack.some((item) => item.toLowerCase() === normalizedTech);

      return matchesSearch && matchesTech;
    });
  };

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");
  const [offlineMode, setOfflineMode] = useState(Boolean(initialError));
  const introText = "Selected projects, simple filters, and quick previews.";
  const introChars = introText.split("");

  useEffect(() => {
    if (offlineMode) {
      setProjects(filterProjects(fallbackProjects, search, tech));
      setLoading(false);
      return;
    }

    if (!search && !tech) {
      setProjects(initialProjects);
      setLoading(false);
      return;
    }

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
        setOfflineMode(true);
        setError(err instanceof Error ? err.message : "Unable to load projects");
        setProjects(filterProjects(fallbackProjects, search, tech));
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(run, 250);
    return () => clearTimeout(timeout);
  }, [search, tech, initialProjects, offlineMode]);

  const techOptions = useMemo(() => {
    const source = offlineMode ? filterProjects(fallbackProjects, search, tech) : projects;
    const all = source.flatMap((project) => project.techStack);
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [projects, offlineMode, search, tech]);

  const visibleProjects = offlineMode ? filterProjects(fallbackProjects, search, tech) : projects;
  const showOfflineBanner = offlineMode || Boolean(error);

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
            className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl"
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

        {showOfflineBanner ? (
          <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.45)]">
            <p className="text-sm font-semibold text-amber-100">Project data is temporarily offline.</p>
            <p className="mt-2 text-sm leading-7 text-amber-100/80">
              The page is showing polished fallback projects for now. When Neon becomes available again, this view will automatically return to the live backend project list.
            </p>
          </div>
        ) : null}

        {!loading && !showOfflineBanner && visibleProjects.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">No projects found for the current filters.</p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) =>
            offlineMode ? (
              <article
                key={project.id}
                className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1324]/92 shadow-[0_14px_34px_rgba(2,6,16,0.45)]"
              >
                <div className="flex-1 p-5">
                  <div className="mb-3 inline-flex rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-amber-100">
                    FALLBACK
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-8 text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((techItem) => (
                      <span
                        key={`${project.id}-${techItem}`}
                        className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <ProjectCard key={project.id} project={project} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
