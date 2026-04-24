"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Mail } from "lucide-react";
import { jsPDF } from "jspdf";
import { getHome, getProjects } from "@/lib/api";
import { HomeData } from "@/types/home";
import ResumeProjectCard from "@/components/resume/ProjectCard";
import ResumeSection from "@/components/resume/ResumeSection";
import SkillBadge from "@/components/resume/SkillBadge";
import { Project } from "@/types/project";

type ResumeInitialData = {
  home: HomeData;
  projects: Project[];
};

type ResumePageClientProps = {
  initialData?: ResumeInitialData | null;
  initialError?: string | null;
};

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

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.3-5.26-1.29-5.26-5.75 0-1.27.46-2.3 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.24 2.87.12 3.17.75.8 1.2 1.83 1.2 3.1 0 4.48-2.7 5.45-5.28 5.74.41.36.78 1.07.78 2.17 0 1.57-.01 2.84-.01 3.23 0 .31.2.67.8.55A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.38 4.3 5.48v6.26ZM5.3 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.08 20.45H3.5V9h3.57v11.45ZM22.22 0H1.77A1.78 1.78 0 0 0 0 1.78v20.44C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0Z" />
    </svg>
  );
}

function formatProjectDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function sanitizeForPdf(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function toDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read image for PDF."));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function ResumePageClient({
  initialData = null,
  initialError = null,
}: ResumePageClientProps) {
  const [homeData, setHomeData] = useState<HomeData | null>(initialData?.home ?? null);
  const [projects, setProjects] = useState<Project[]>(
    initialData?.projects.filter((project) => project.published) ?? []
  );
  const [visibleProjects, setVisibleProjects] = useState(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(!initialData && !initialError);
  const [error, setError] = useState<string | null>(initialError);
  const [downloadingResume, setDownloadingResume] = useState(false);

  useEffect(() => {
    if (initialData) return;

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
  }, [initialData]);

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

  const summaryText = homeData?.profile.bio?.trim() || "I am a software engineering student interested in web development and artificial intelligence.";

  const hasMoreProjects = visibleProjects < projects.length;

  const handleResumeDownload = async () => {
    if (!homeData) return;

    setDownloadingResume(true);
    setError(null);

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 40;
      let y = 46;
      const headerImageSize = 72;
      const headerImageX = 555 - headerImageSize;
      const headerImageY = 34;

      const headerImage = await toDataUrl("/resume.jpg");
      if (headerImage) {
        doc.addImage(headerImage, "JPEG", headerImageX, headerImageY, headerImageSize, headerImageSize);
        doc.setDrawColor(180, 180, 180);
        doc.rect(headerImageX, headerImageY, headerImageSize, headerImageSize);
      }

      const ensureSpace = (needed = 20) => {
        if (y + needed > pageHeight - 40) {
          doc.addPage();
          y = 46;
        }
      };

      const writeTitle = (text: string) => {
        ensureSpace(28);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(text, marginX, y);
        y += 24;
      };

      const writeSection = (title: string) => {
        ensureSpace(24);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(title, marginX, y);
        y += 10;
        doc.setDrawColor(180, 180, 180);
        doc.line(marginX, y, 555, y);
        y += 16;
      };

      const writeParagraph = (text: string, indent = 0) => {
        const safeText = sanitizeForPdf(text);
        if (!safeText) return;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(safeText, 515 - indent);
        for (const line of lines) {
          ensureSpace(15);
          doc.text(line, marginX + indent, y);
          y += 15;
        }
      };

      const writeLinkLine = (label: string, displayText: string, url: string) => {
        const safeLabel = sanitizeForPdf(label);
        const safeDisplay = sanitizeForPdf(displayText);
        const safeUrl = url.trim();
        if (!safeDisplay || !safeUrl) return;

        ensureSpace(15);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(20, 20, 20);

        const baseX = marginX + 6;
        const prefix = `${safeLabel}: `;
        doc.text(prefix, baseX, y);

        const linkX = baseX + doc.getTextWidth(prefix);
        doc.setTextColor(37, 99, 235);
        doc.textWithLink(safeDisplay, linkX, y, { url: safeUrl });
        doc.setTextColor(20, 20, 20);
        y += 15;
      };

      writeTitle("Samuel Abera");
      y = Math.max(y, headerImageY + headerImageSize + 12);

      writeSection("Summary");
      writeParagraph(summaryText);
      y += 6;
      writeLinkLine("Email", "samuelabera.dev@gmail.com", contactLinks.email);
      writeLinkLine("GitHub", contactLinks.github.replace(/^https?:\/\//, ""), contactLinks.github);
      writeLinkLine("LinkedIn", contactLinks.linkedin.replace(/^https?:\/\//, ""), contactLinks.linkedin);

      y += 6;
      writeSection("Education");
      writeParagraph("BSc in Software Engineering");
      writeParagraph("Debre Berhan University");
      writeParagraph("Expected Graduate: 2028");

      y += 6;
      writeSection("Skills");
      writeParagraph(allSkills.length > 0 ? allSkills.join(", ") : "No skills added yet.");

      y += 6;
      writeSection("Projects");
      if (projects.length === 0) {
        writeParagraph("No projects added yet.");
      } else {
        projects.forEach((project) => {
          ensureSpace(24);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(sanitizeForPdf(project.title) || "Untitled Project", marginX, y);
          y += 15;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(formatProjectDate(project.createdAt), marginX, y);
          y += 14;

          writeParagraph(project.description, 2);

          if (project.techStack.length > 0) {
            writeParagraph(`Tech: ${project.techStack.map((item) => sanitizeForPdf(item)).filter(Boolean).join(", ")}`, 2);
          }

          if (project.githubUrl) {
            writeLinkLine("GitHub", project.githubUrl.replace(/^https?:\/\//, ""), project.githubUrl);
          }
          if (project.liveUrl) {
            writeLinkLine("Live Demo", project.liveUrl.replace(/^https?:\/\//, ""), project.liveUrl);
          }

          y += 8;
        });
      }

      doc.save("Samuel_Abera_Resume.pdf");
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
          <button
            type="button"
            onClick={handleResumeDownload}
            disabled={downloadingResume}
            className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Download className="h-4 w-4" />
            {downloadingResume ? "Downloading..." : "Download Resume"}
          </button>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <aside className="md:col-span-4 md:sticky md:top-24">
            <ResumeSection title="Summary">
              <p className="text-sm leading-7 text-gray-300">
                {summaryText}
              </p>

              <div className="mt-4 space-y-2 border-t border-gray-700 pt-4 text-sm">
                <a href={contactLinks.email} className="flex items-center gap-2 text-gray-200 transition hover:text-white">
                  <Mail className="h-4 w-4 text-gray-400" />
                  samuelabera.dev@gmail.com
                </a>
                <a href={contactLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-200 transition hover:text-white">
                  <GithubIcon className="h-4 w-4 text-gray-400" />
                  github.com/samuelabera21
                </a>
                <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-200 transition hover:text-white">
                  <LinkedinIcon className="h-4 w-4 text-gray-400" />
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
