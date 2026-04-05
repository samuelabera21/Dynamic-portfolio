"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getHome } from "@/lib/api";
import SkillsFlipSection from "@/components/home/SkillsFlipSection";
import { Profile } from "@/types/profile";
import { GroupedSkills, SkillCategory } from "@/types/skill";

type PlatformKey = "github" | "facebook" | "youtube" | "linkedin" | "x" | "telegram" | "whatsapp" | "tiktok" | "instagram" | "website";

function detectPlatform(platform: string, url: string): PlatformKey {
  const source = `${platform} ${url}`.toLowerCase();

  if (source.includes("github") || source.includes("githu")) return "github";
  if (source.includes("facebook") || source.includes("fb")) return "facebook";
  if (source.includes("youtube") || source.includes("youtu.be")) return "youtube";
  if (source.includes("linkedin")) return "linkedin";
  if (source.includes("twitter") || source.includes("x.com")) return "x";
  if (source.includes("telegram") || source.includes("t.me")) return "telegram";
  if (source.includes("whatsapp") || source.includes("wa.me")) return "whatsapp";
  if (source.includes("tiktok") || source.includes("tik tok") || source.includes("tt")) return "tiktok";
  if (source.includes("instagram") || source.includes("insta")) return "instagram";

  return "website";
}

function platformLabel(platform: PlatformKey, fallback: string): string {
  if (platform === "github") return "GitHub";
  if (platform === "facebook") return "Facebook";
  if (platform === "youtube") return "YouTube";
  if (platform === "linkedin") return "LinkedIn";
  if (platform === "x") return "X";
  if (platform === "telegram") return "Telegram";
  if (platform === "whatsapp") return "WhatsApp";
  if (platform === "tiktok") return "TikTok";
  if (platform === "instagram") return "Instagram";

  const cleaned = fallback.trim();
  if (!cleaned) return "Website";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function SocialIcon({ platform }: { platform: PlatformKey }) {
  const common = "h-4 w-4";

  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.3-5.26-1.29-5.26-5.75 0-1.27.46-2.3 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.24 2.87.12 3.17.75.8 1.2 1.83 1.2 3.1 0 4.48-2.7 5.45-5.28 5.74.41.36.78 1.07.78 2.17 0 1.57-.01 2.84-.01 3.23 0 .31.2.67.8.55A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.8-4.66 4.54-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.48 0-1.94.92-1.94 1.86V12h3.3l-.53 3.46h-2.77v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.6 4.6 12 4.6 12 4.6s-7.6 0-9.4.5A3 3 0 0 0 .5 7.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-4.8ZM9.6 15.2V8.8L15.8 12l-6.2 3.2Z" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.38 4.3 5.48v6.26ZM5.3 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.08 20.45H3.5V9h3.57v11.45ZM22.22 0H1.77A1.78 1.78 0 0 0 0 1.78v20.44C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.5L6.38 22H3.28l7.24-8.28L.8 2h6.4l4.42 5.9L18.9 2Zm-1.1 18h1.72L6.27 3.9H4.43L17.8 20Z" />
      </svg>
    );
  }

  if (platform === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M9.9 15.2 9.7 19c.5 0 .7-.2 1-.4l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8L23 3.9c.3-1.2-.4-1.7-1.3-1.4L1.8 10.2c-1.1.4-1.1 1 .2 1.4l5.3 1.7L19.5 6.6c.6-.4 1.2-.2.8.1" />
      </svg>
    );
  }

  if (platform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M12 .5A11.5 11.5 0 0 0 2.2 17.9L1 23.5l5.8-1.1A11.5 11.5 0 1 0 12 .5Zm0 20.8a9.2 9.2 0 0 1-4.7-1.3l-.3-.2-3.4.6.7-3.2-.2-.3A9.3 9.3 0 1 1 12 21.3Zm5-6.7c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a7.6 7.6 0 0 1-2.2-1.3 8.4 8.4 0 0 1-1.6-2c-.2-.4 0-.6.1-.8l.5-.6c.2-.2.2-.4.4-.7s0-.5 0-.7-.7-1.8-1-2.5c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.4 3.4c.2.3 2.4 3.7 5.8 5.2.8.3 1.4.6 1.9.7.8.2 1.5.1 2-.1.6-.1 1.8-.8 2-1.6.2-.8.2-1.5.2-1.6 0-.1-.2-.2-.5-.4Z" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M14 3h2.4c.3 1.7 1.5 3 3.1 3.3v2.6a8.1 8.1 0 0 1-3.1-1v6.6a5.4 5.4 0 1 1-5.5-5.4c.2 0 .4 0 .6.1V12a2.7 2.7 0 1 0 2.5 2.7V3Z" />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
      <path d="M9.5 14.5l5-5" />
      <path d="M10.5 6.5h-3a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3" />
      <path d="M13.5 17.5h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isPdfDataUrl(value: string): boolean {
  return value.startsWith("data:application/pdf;base64,");
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "application/octet-stream";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

function normalizeSocialUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "#";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function preferredSkillScore(name: string): number | null {
  const key = name.trim().toLowerCase();
  const exact: Record<string, number> = {
    html: 100,
    css: 90,
    javascript: 75,
    "java script": 75,
    php: 80,
    "wordpress/cms": 90,
    wordpress: 90,
    photoshop: 55,
  };

  return exact[key] ?? null;
}

function hashedSkillScore(name: string, category: SkillCategory): number {
  let hash = 0;
  const source = `${category}:${name.toLowerCase()}`;

  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) % 9973;
  }

  return 58 + (hash % 40);
}

function skillScore(name: string, category: SkillCategory): number {
  const preferred = preferredSkillScore(name);
  if (preferred !== null) return preferred;
  return hashedSkillScore(name, category);
}

function interestList(): string[] {
  return [
    "Frontend Architecture",
    "Backend API Design",
    "System Design",
    "Machine Learning Applications",
    "MLOps and Model Serving",
    "AI Product Engineering",
    "Data Visualization",
    "Cloud Native Workflows",
    "DevOps Automation",
    "Cybersecurity Basics",
    "Open Source Collaboration",
    "Technical Writing",
  ];
}

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groupedSkills, setGroupedSkills] = useState<GroupedSkills>({});
  const [showSkills, setShowSkills] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [skillBarsVisible, setSkillBarsVisible] = useState(false);
  const skillSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const home = await getHome();
        setProfile(home.profile);
        setGroupedSkills(home.skills ?? {});
        setShowSkills(home.showSkills ?? true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    const node = skillSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setSkillBarsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const orderedCategories: SkillCategory[] = ["frontend", "backend", "tools"];

  const flatSkills = useMemo(() => {
    return orderedCategories.flatMap((category) => {
      return (groupedSkills[category] ?? []).map((name) => ({
        category,
        name,
        score: skillScore(name, category),
      }));
    });
  }, [groupedSkills]);

  const splitSkillColumns = useMemo(() => {
    const midpoint = Math.ceil(flatSkills.length / 2);
    return [flatSkills.slice(0, midpoint), flatSkills.slice(midpoint)];
  }, [flatSkills]);

  const interests = interestList();

  if (loading) return <p className="text-sm text-slate-500">Loading profile...</p>;
  if (error || !profile) return <p className="text-sm font-medium text-red-600">{error ?? "Profile unavailable"}</p>;

  const hasResume = Boolean(profile.resumeUrl);
  const resumeIsHealthy =
    hasResume &&
    (isPdfDataUrl(profile.resumeUrl) || isHttpUrl(profile.resumeUrl));
  const hasSkills = showSkills && orderedCategories.some((category) => (groupedSkills[category] ?? []).length > 0);
  const templateFacts = [
    { label: "Birthday", value: "1 May 1995" },
    { label: "Website", value: "www.example.com" },
    { label: "Phone", value: "+123 456 7890" },
    { label: "City", value: profile.location ?? "Ethiopia" },
    { label: "Age", value: "30" },
    { label: "Degree", value: "Master" },
    { label: "Email", value: "email@example.com" },
    { label: "Freelance", value: profile.available ? "Available" : "Not available" },
  ];

  const handleResumeDownload = () => {
    if (!profile.resumeUrl) return;

    setResumeError(null);

    try {
      if (isPdfDataUrl(profile.resumeUrl)) {
        const blob = dataUrlToBlob(profile.resumeUrl);
        const objectUrl = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = "resume.pdf";
        anchor.click();

        URL.revokeObjectURL(objectUrl);
        return;
      }

      if (isHttpUrl(profile.resumeUrl)) {
        window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
        return;
      }

      setResumeError("Resume link is invalid. Please update it from admin profile.");
    } catch {
      setResumeError("Could not open resume. Please try again.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#060c18] pb-14 pt-10 text-slate-100 sm:pb-20">
      <div className="pointer-events-none absolute -left-32 top-8 h-72 w-72 rounded-full bg-cyan-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-80px] top-[260px] h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-10 lg:px-12">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.45)] backdrop-blur-xl sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Samuel Abera</p>
              <h2 className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">{profile.name}</h2>
              <p className="mt-2 text-sm font-semibold text-emerald-300">{profile.role}</p>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-8 text-slate-200">{profile.bio}</p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="grid gap-8 md:grid-cols-[330px_1fr] md:items-start">
              <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-[#020409] md:h-full md:min-h-[460px]">
                <Image
                  src="/ab.png"
                  alt="About portrait"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 330px"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white">UI/UX Designer & Web Developer.</h2>
                  <p className="mt-4 text-lg italic leading-8 text-slate-200">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {templateFacts.map((fact) => (
                    <div key={fact.label} className="flex items-center gap-2 text-sm text-slate-200">
                      <span className="inline-flex h-5 w-5 items-center justify-center text-emerald-300">›</span>
                      <span>
                        <strong className="text-white">{fact.label}:</strong> {fact.value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-base leading-8 text-slate-300">
                  Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt officia tempore. Et eius omnis. Cupiditate ut dicta maxime officiis quidem quia. Sed et consectetur qui quia repellendus itaque neque.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                {profile.location ? `Location: ${profile.location}` : "Location not set"}
              </span>

              {profile.resumeUrl ? (
                <button
                  type="button"
                  onClick={handleResumeDownload}
                  disabled={!resumeIsHealthy}
                  className="rounded-xl border border-cyan-300/40 bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Download Resume
                </button>
              ) : (
                <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                  Resume not available
                </span>
              )}
            </div>

            {resumeError ? (
              <p className="mt-3 text-xs font-medium text-red-300">{resumeError}</p>
            ) : null}

            {hasResume && !resumeIsHealthy ? (
              <p className="mt-2 text-xs font-medium text-amber-300">
                Resume link format looks invalid. Set a valid PDF URL or upload from admin profile.
              </p>
            ) : null}

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-100">Social Links</h3>
              {profile.socialLinks.length === 0 ? (
                <p className="mt-2 text-sm text-slate-300">No social links configured.</p>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {profile.socialLinks.map((link, index) => {
                    const platform = detectPlatform(link.platform, link.url);
                    const label = platformLabel(platform, link.platform);
                    return (
                      <a
                        key={`${link.platform}-${index}`}
                        href={normalizeSocialUrl(link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-icon-hover inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/10 text-blue-200"
                        aria-label={label}
                        title={label}
                      >
                        <SocialIcon platform={platform} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </article>

        {hasSkills ? (
          <article
            ref={skillSectionRef}
            className="rounded-3xl border border-white/10 bg-[#040912]/80 p-5 shadow-[0_20px_40px_rgba(2,7,18,0.45)] sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Skills</p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-bold text-white">My Skills</h2>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {splitSkillColumns.map((column, columnIndex) => (
                <div key={`skill-column-${columnIndex}`} className="space-y-5">
                  {column.map((item) => (
                    <div key={`${item.category}-${item.name}`}>
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-slate-200">
                        <span>{item.name}</span>
                        <span>{item.score}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all duration-[1400ms]"
                          style={{ width: skillBarsVisible ? `${item.score}%` : "0%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <SkillsFlipSection skills={groupedSkills} />
            </div>
          </article>
        ) : null}

        <article className="rounded-3xl border border-white/10 bg-[#020610]/85 p-5 shadow-[0_20px_40px_rgba(2,6,16,0.45)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Features</p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-bold text-white">I&apos;m Interested In</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {interests.map((interest) => (
              <div
                key={interest}
                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-emerald-400/10"
              >
                <p className="font-semibold text-slate-100 transition group-hover:text-emerald-200">{interest}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
