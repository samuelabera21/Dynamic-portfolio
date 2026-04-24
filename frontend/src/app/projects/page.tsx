import ProjectsPageClient from "@/app/projects/ProjectsPageClient";
import { getProjectsServer } from "@/lib/server-api";
import { Project } from "@/types/project";

export const revalidate = 60;

export default async function ProjectsPage() {
  let initialProjects: Project[] = [];
  let initialError: string | null = null;

  try {
    initialProjects = await getProjectsServer({}, revalidate);
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Unable to load projects";
  }

  return <ProjectsPageClient initialProjects={initialProjects} initialError={initialError} />;
}
