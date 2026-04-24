import ResumePageClient from "@/app/resume/ResumePageClient";
import { getHomeServer, getProjectsServer } from "@/lib/server-api";
import { HomeData } from "@/types/home";
import { Project } from "@/types/project";

export const revalidate = 60;

type ResumeInitialData = {
  home: HomeData;
  projects: Project[];
};

export default async function ResumePage() {
  let initialData: ResumeInitialData | null = null;
  let initialError: string | null = null;

  try {
    const [home, projects] = await Promise.all([
      getHomeServer(revalidate),
      getProjectsServer({}, revalidate),
    ]);

    initialData = {
      home,
      projects,
    };
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Unable to load resume data";
  }

  return <ResumePageClient initialData={initialData} initialError={initialError} />;
}
