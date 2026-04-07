"use client";

import { useEffect, useMemo, useState } from "react";
import { Contact, Download, GitBranch, Mail } from "lucide-react";
import { getHome, getProjects } from "@/lib/api";
import { HomeData } from "@/types/home";
import ResumeProjectCard from "@/components/resume/ProjectCard";
import ResumeSection from "@/components/resume/ResumeSection";
import SkillBadge from "@/components/resume/SkillBadge";
import { Project } from "@/types/project";

const INITIAL_PROJECTS = 4;
const PROJECTS_STEP = 4;

function findSocialUrl(links: { platform: string; url: string }[], keyword: string): string | null {
  const match = links.find((item) => {
    const source = `${item.platform} ${item.url}`.toLowerCase();
    return source.includes(keyword);
  });

  if (!match?.url) return null;
  if (match.url.startsWith("http://") || match.url.startsWith("https://")) return match.url;
  return `https://${match.url}`;
}

function isPdfDataUrl(value: string): boolean {
  return value.startsWith("data:application/pdf;base64,");
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "application/pdf";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export default function ResumePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingResume, setDownloadingResume] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [home, projectData] = await Promise.all([getHome(), getProjects()]);
        setHomeData(home);
        setProjects(projectData.filter((project) => project.published));
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

  const contactLinks = useMemo(() => {
    const social = homeData?.profile.socialLinks ?? [];

    return {
      email: "mailto:samuelabera.dev@gmail.com",
      github: findSocialUrl(social, "github") ?? "https://github.com/samuelabera21",
      linkedin: findSocialUrl(social, "linkedin") ?? "https://linkedin.com/in/samuelabera21",
    };
  }, [homeData]);

  const visibleProjectItems = useMemo(
    () => projects.slice(0, visibleProjects),
    [projects, visibleProjects]
  );

  const hasMoreProjects = visibleProjects < projects.length;

  const handleResumeDownload = async () => {
    const resumeUrl = homeData?.profile?.resumeUrl;
    if (!resumeUrl) return;

    setDownloadingResume(true);

    try {
      if (isPdfDataUrl(resumeUrl)) {
        const pdfBlob = dataUrlToBlob(resumeUrl);
        downloadBlob(pdfBlob, "Samuel_Abera_Resume.pdf");
        return;
      }

      if (isHttpUrl(resumeUrl)) {
        const response = await fetch(resumeUrl);
        if (!response.ok) {
          throw new Error(`Resume download failed (${response.status})`);
        }

        const blob = await response.blob();
        downloadBlob(blob, "Samuel_Abera_Resume.pdf");
        return;
      }

      throw new Error("Resume URL is invalid.");
    } catch (downloadError) {
      const message = downloadError instanceof Error ? downloadError.message : "Failed to download resume.";
      setError(message);
    } finally {
      setDownloadingResume(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-950 px-6 py-16 text-white lg:px-10">
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
      <section className="min-h-screen bg-gray-950 px-6 py-16 text-white lg:px-10">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
          <h1 className="text-2xl font-bold text-white">Resume</h1>
          <p className="mt-3 text-sm text-red-200">{error ?? "Unable to load resume data."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold">Samuel Abera</h1>
          {homeData.profile.resumeUrl ? (
            <button
              type="button"
              onClick={handleResumeDownload}
              disabled={downloadingResume}
              className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 transition hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              {downloadingResume ? "Downloading..." : "Download Resume"}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-500"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <aside className="md:col-span-4 md:sticky md:top-24">
            <ResumeSection title="Summary">
              <p className="text-sm leading-7 text-gray-300">
                I am a software engineering student interested in web development and artificial intelligence.
              </p>

              <div className="mt-4 space-y-2 border-t border-gray-700 pt-4 text-sm">
                <a href={contactLinks.email} className="flex items-center gap-2 text-gray-200 transition hover:text-white">
                  <Mail className="h-4 w-4 text-gray-400" />
                  samuelabera.dev@gmail.com
                </a>
                <a href={contactLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-200 transition hover:text-white">
                  <GitBranch className="h-4 w-4 text-gray-400" />
                  github.com/samuelabera21
                </a>
                <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-200 transition hover:text-white">
                  <Contact className="h-4 w-4 text-gray-400" />
                  linkedin.com/in/samuelabera21
                </a>
              </div>
            </ResumeSection>

            <ResumeSection title="Education">
              <h3 className="text-base font-semibold text-white">BSc in Software Engineering</h3>
              <p className="mt-2 text-sm text-gray-300">Debre Berhan University</p>
              <p className="mt-1 text-sm text-gray-400">Expected Graduate: 2028</p>
            </ResumeSection>

            <ResumeSection title="Skills" className="mb-0">
              {allSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <SkillBadge key={skill} label={skill} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No skills added yet. Add skills from admin panel.</p>
              )}
            </ResumeSection>
          </aside>

          <main className="md:col-span-8">
            <ResumeSection title="Projects" className="mb-0">
              {projects.length > 0 ? (
                <>
                  <div className="space-y-4 border-l border-gray-700 pl-4">
                    {visibleProjectItems.map((project) => (
                      <ResumeProjectCard key={project.id} project={project} />
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {hasMoreProjects ? (
                      <button
                        type="button"
                        onClick={() => setVisibleProjects((count) => count + PROJECTS_STEP)}
                        className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:bg-gray-800"
                      >
                        Load More Projects
                      </button>
                    ) : null}

                    {visibleProjects > INITIAL_PROJECTS ? (
                      <button
                        type="button"
                        onClick={() => setVisibleProjects(INITIAL_PROJECTS)}
                        className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:bg-gray-800"
                      >
                        Show Less
                      </button>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">No projects yet. Add projects from admin panel to show them here.</p>
              )}
            </ResumeSection>
          </main>
        </div>
      </div>
    </section>
  );
}
