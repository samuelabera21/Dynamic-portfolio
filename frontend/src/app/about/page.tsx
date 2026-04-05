"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getHome } from "@/lib/api";
import { Profile } from "@/types/profile";
import { GroupedSkills, SkillCategory } from "@/types/skill";

function platformLabel(value: string): string {
  return value.trim().toLowerCase();
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
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">About</p>
          <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl">Personal profile and background</h1>
        </header>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.45)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
            <div className="flex justify-center md:justify-start">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-56 w-56 rounded-2xl border border-white/15 object-cover shadow-[0_12px_26px_rgba(0,0,0,0.35)]"
                />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-white/15 bg-[#0b1730]/80 text-sm font-medium text-slate-300">
                  No avatar
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Samuel Abera</p>
                <h2 className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">{profile.name}</h2>
                <p className="mt-2 text-sm font-semibold text-emerald-300">{profile.role}</p>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-8 text-slate-200">{profile.bio}</p>

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
                <p className="text-xs font-medium text-red-300">{resumeError}</p>
              ) : null}

              {hasResume && !resumeIsHealthy ? (
                <p className="text-xs font-medium text-amber-300">
                  Resume link format looks invalid. Set a valid PDF URL or upload from admin profile.
                </p>
              ) : null}

              <div>
                <h3 className="text-sm font-semibold text-slate-100">Social Links</h3>
                {profile.socialLinks.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-300">No social links configured.</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {profile.socialLinks.map((link, index) => {
                      const label = platformLabel(link.platform);
                      return (
                        <a
                          key={`${link.platform}-${index}`}
                          href={normalizeSocialUrl(link.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0b1730]/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:text-cyan-200"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-300/45 bg-cyan-500/15 text-[10px] font-bold uppercase text-cyan-100">
                            {label[0] ?? "s"}
                          </span>
                          {label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-[#030711]/80 p-5 shadow-[0_20px_45px_rgba(3,7,17,0.45)] sm:p-8">
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

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold text-white">Skills</h3>
              <p className="mt-1 text-sm text-slate-300">Grouped technical skills from your portfolio profile.</p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {orderedCategories.map((category) => {
                  const items = groupedSkills[category] ?? [];

                  return (
                    <div key={category} className="rounded-xl border border-white/10 bg-[#0b1730]/55 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{category}</h4>
                      {items.length === 0 ? (
                        <p className="mt-2 text-xs text-slate-300">No skills listed</p>
                      ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {items.map((item) => (
                            <span
                              key={`${category}-${item}`}
                              className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
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
