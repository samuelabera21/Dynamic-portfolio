"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHome } from "@/lib/api";
import { HomeData } from "@/types/home";
import { SkillCategory } from "@/types/skill";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Home() {
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
        setError(err instanceof Error ? err.message : "Unable to load homepage");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      </section>
    );
  }

  if (error || !homeData) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">Homepage Data Unavailable</h1>
        <p className="mt-2 text-sm font-medium text-red-600">{error ?? "Could not load homepage data."}</p>
        <p className="mt-1 text-sm text-slate-600">Try refreshing the page. If the issue continues, check backend GET /home response.</p>
      </section>
    );
  }

  const {
    profile,
    featuredProjects,
    skills,
    showProjects = true,
    showSkills = true,
    availableForHire = true,
  } = homeData;
  const orderedCategories: SkillCategory[] = ["frontend", "backend", "tools"];
  const hasSkills = orderedCategories.some((category) => (skills[category] ?? []).length > 0);
  const hasFeaturedProjects = featuredProjects.length > 0;

  return (
    <section className="space-y-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 p-8 text-white shadow-lg sm:p-12">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">Software Portfolio</p>
            {profile.available && availableForHire ? (
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Available for hire
              </span>
            ) : null}

            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="text-base font-semibold text-blue-100">{profile.role}</p>
            <p className="text-sm leading-7 text-blue-50 sm:text-base">{profile.bio}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              {showProjects ? (
                <Link
                  href="#featured-projects"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                >
                  View Projects
                </Link>
              ) : null}
              <Link
                href="/contact"
                className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-44 w-44 rounded-full border-4 border-white/60 object-cover shadow-2xl"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-white/60 bg-white/20 text-4xl font-bold text-white shadow-lg">
                {initials(profile.name) || "P"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">About</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">Who I Am</h2>
            </div>
            <Link href="/about" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
              Full story
            </Link>
          </div>

          <p className="text-sm leading-7 text-slate-600">{profile.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {profile.role}
            </span>
            {profile.location ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {profile.location}
              </span>
            ) : null}
          </div>

          {profile.socialLinks.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.socialLinks.slice(0, 4).map((link, index) => (
                <a
                  key={`${link.platform}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          ) : null}
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-6 text-white shadow-sm sm:p-8">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">Contact</p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold">Let’s Build Something Real</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-blue-100">
              Have a project, internship, or collaboration idea? I am open to meaningful software engineering work and real-world product development.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                Send Message
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                About Me
              </Link>
            </div>
          </div>
        </article>
      </div>

      {showProjects ? (
        <div id="featured-projects" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Portfolio Highlights</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">Featured Projects</h2>
            </div>
            <Link href="/projects" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
              View all projects
            </Link>
          </div>

          {hasFeaturedProjects ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-50 p-3">
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="text-sm font-medium text-slate-500">No image available</div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">{project.title}</h3>
                    <p className="line-clamp-3 text-sm text-slate-600">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={`${project.id}-${tech}`}
                          className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          GitHub
                        </a>
                      ) : null}

                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                          Live Demo
                        </a>
                      ) : null}

                      <Link
                        href={`/projects/${project.id}`}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No featured projects available yet.</p>
          )}
        </div>
      ) : null}

      {showSkills && hasSkills ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Tech Stack</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">Skills by Category</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {orderedCategories.map((category) => {
              const items = skills[category] ?? [];

              return (
                <div key={category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">{category}</h3>

                  {items.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-500">No skills listed</p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span
                          key={`${category}-${item}`}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
