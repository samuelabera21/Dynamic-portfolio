import AboutPageClient from "@/app/about/AboutPageClient";
import { getHomeServer, getProjectsServer } from "@/lib/server-api";
import { HomeData } from "@/types/home";
import { Project } from "@/types/project";

export const revalidate = 60;

type AboutInitialData = {
  home: HomeData;
  projects: Project[];
};

export default async function AboutPage() {
  let initialData: AboutInitialData | null = null;
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
    initialError = error instanceof Error ? error.message : "Unable to load profile";
  }

  return <AboutPageClient initialData={initialData} initialError={initialError} />;
}
