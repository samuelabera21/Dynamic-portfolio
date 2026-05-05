import HomePageClient from "@/app/HomePageClient";
import { getHomeServer } from "@/lib/server-api";
import { HomeData } from "@/types/home";

export default async function HomePage() {
  let initialHomeData: HomeData | null = null;
  let initialError: string | null = null;

  try {
    initialHomeData = await getHomeServer();
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Unable to load homepage";
  }

  return <HomePageClient initialHomeData={initialHomeData} initialError={initialError} />;
}
