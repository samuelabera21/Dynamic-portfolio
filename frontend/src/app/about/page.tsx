"use client";

import { useEffect, useState } from "react";
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

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [groupedSkills, setGroupedSkills] = useState<GroupedSkills>({});
  const [showSkills, setShowSkills] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

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

  if (loading) return <p className="text-sm text-slate-500">Loading profile...</p>;
  if (error || !profile) return <p className="text-sm font-medium text-red-600">{error ?? "Profile unavailable"}</p>;

  const hasResume = Boolean(profile.resumeUrl);
  const resumeIsHealthy =
    hasResume &&
    (isPdfDataUrl(profile.resumeUrl) || isHttpUrl(profile.resumeUrl));
  const orderedCategories: SkillCategory[] = ["frontend", "backend", "tools"];
  const hasSkills = showSkills && orderedCategories.some((category) => (groupedSkills[category] ?? []).length > 0);

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
    <section className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">About</h1>
        <p className="mt-2 text-sm text-slate-600">Personal profile and background.</p>
      </div>

      <article className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="flex justify-center md:justify-start">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-48 w-48 rounded-2xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
                No avatar
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">{profile.name}</h2>
              <p className="mt-1 text-sm font-semibold text-blue-600">{profile.role}</p>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700">{profile.bio}</p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {profile.location ? `Location: ${profile.location}` : "Location not set"}
              </span>

              {profile.resumeUrl ? (
                <button
                  type="button"
                  onClick={handleResumeDownload}
                  disabled={!resumeIsHealthy}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Download Resume
                </button>
              ) : (
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                  Resume not available
                </span>
              )}
            </div>

            {resumeError ? (
              <p className="text-xs font-medium text-red-600">{resumeError}</p>
            ) : null}

            {hasResume && !resumeIsHealthy ? (
              <p className="text-xs font-medium text-amber-700">
                Resume link format looks invalid. Set a valid PDF URL or upload from admin profile.
              </p>
            ) : null}

            <div>
              <h3 className="text-sm font-semibold text-slate-800">Social Links</h3>
              {profile.socialLinks.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No social links configured.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-3">
                  {profile.socialLinks.map((link, index) => {
                    const label = platformLabel(link.platform);
                    return (
                      <a
                        key={`${link.platform}-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold uppercase text-blue-700">
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

      {hasSkills ? (
        <article className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">Skills</h2>
          <p className="mt-1 text-sm text-slate-600">Grouped technical skills from your portfolio profile.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {orderedCategories.map((category) => {
              const items = groupedSkills[category] ?? [];

              return (
                <div key={category} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">{category}</h3>
                  {items.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-500">No skills listed</p>
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
        </article>
      ) : null}
    </section>
  );
}
