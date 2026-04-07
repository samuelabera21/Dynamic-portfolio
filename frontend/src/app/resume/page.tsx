"use client";

import { useEffect, useMemo, useState } from "react";
import { getHome } from "@/lib/api";
import { HomeData } from "@/types/home";

type PlatformKey = "x" | "facebook" | "instagram" | "linkedin" | "github" | "youtube" | "telegram" | "whatsapp" | "tiktok" | "website";

function normalizeSocialUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "#";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function detectPlatform(platform: string, url: string): PlatformKey {
  const source = `${platform} ${url}`.toLowerCase();

  if (source.includes("twitter") || source.includes("x.com") || source.includes("x ")) return "x";
  if (source.includes("facebook") || source.includes("fb")) return "facebook";
  if (source.includes("instagram") || source.includes("insta")) return "instagram";
  if (source.includes("linkedin")) return "linkedin";
  if (source.includes("github") || source.includes("githu")) return "github";
  if (source.includes("youtube") || source.includes("youtu.be") || source.includes("yt")) return "youtube";
  if (source.includes("telegram") || source.includes("t.me")) return "telegram";
  if (source.includes("whatsapp") || source.includes("wa.me")) return "whatsapp";
  if (source.includes("tiktok") || source.includes("tik tok") || source.includes("tt")) return "tiktok";

  return "website";
}

function platformLabel(platform: PlatformKey, fallback: string): string {
  if (platform === "x") return "X";
  if (platform === "facebook") return "Facebook";
  if (platform === "instagram") return "Instagram";
  if (platform === "linkedin") return "LinkedIn";
  if (platform === "github") return "GitHub";
  if (platform === "youtube") return "YouTube";
  if (platform === "telegram") return "Telegram";
  if (platform === "whatsapp") return "WhatsApp";
  if (platform === "tiktok") return "TikTok";

  const cleaned = fallback.trim();
  if (!cleaned) return "Website";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function SocialIcon({ platform }: { platform: PlatformKey }) {
  if (platform === "x") return <span aria-hidden="true" className="text-sm leading-none">X</span>;

  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.3-5.26-1.29-5.26-5.75 0-1.27.46-2.3 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.24 2.87.12 3.17.75.8 1.2 1.83 1.2 3.1 0 4.48-2.7 5.45-5.28 5.74.41.36.78 1.07.78 2.17 0 1.57-.01 2.84-.01 3.23 0 .31.2.67.8.55A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.38 4.3 5.48v6.26ZM5.3 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.08 20.45H3.5V9h3.57v11.45ZM22.22 0H1.77A1.78 1.78 0 0 0 0 1.78v20.44C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.6 4.6 12 4.6 12 4.6s-7.6 0-9.4.5A3 3 0 0 0 .5 7.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-4.8ZM9.6 15.2V8.8L15.8 12l-6.2 3.2Z" />
      </svg>
    );
  }

  if (platform === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M9.9 15.2 9.7 19c.5 0 .7-.2 1-.4l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8L23 3.9c.3-1.2-.4-1.7-1.3-1.4L1.8 10.2c-1.1.4-1.1 1 .2 1.4l5.3 1.7L19.5 6.6c.6-.4 1.2-.2.8.1" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.8-4.66 4.54-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.48 0-1.94.92-1.94 1.86V12h3.3l-.53 3.46h-2.77v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M9.5 14.5l5-5" />
      <path d="M10.5 6.5h-3a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3" />
      <path d="M13.5 17.5h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

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

    const unique = new Map<string, string>();

    Object.values(homeData.skills)
      .flat()
      .map((skill) => skill.trim())
      .filter(Boolean)
      .forEach((skill) => {
        const normalized = skill.toLowerCase();
        if (!unique.has(normalized)) {
          unique.set(normalized, skill);
        }
      });

    return Array.from(unique.values());
  }, [homeData]);

  const summarySocial = useMemo(() => {
    if (!homeData?.profile?.socialLinks) return [];

    return homeData.profile.socialLinks
      .filter((link) => link.url.trim())
      .map((link) => {
        const normalizedUrl = normalizeSocialUrl(link.url);
        const platform = detectPlatform(link.platform, link.url);

        return {
          platform,
          label: platformLabel(platform, link.platform),
          url: normalizedUrl,
        };
      });
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

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="mailto:samuelabera.dev@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-[#09152a] text-cyan-100">
                  @
                </span>
                Email
              </a>

              {summarySocial.map((item) => (
                <a
                  key={`${item.label}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-[#09152a] text-cyan-100">
                    <SocialIcon platform={item.platform} />
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <h2 className="mt-10 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Education</h2>

          <div className="mt-6 space-y-8">
            <div className="border-l-2 border-emerald-400/80 pl-5">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">BSc in Software Engineering</h3>
              <p className="mt-2 text-sm italic text-slate-300">Debre Berhan University</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Expected Graduate: 2028</p>
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
