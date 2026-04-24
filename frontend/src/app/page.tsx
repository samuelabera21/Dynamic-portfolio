import HomePageClient from "@/app/HomePageClient";
import { getHomeServer } from "@/lib/server-api";
import { HomeData } from "@/types/home";

export const revalidate = 60;

export default async function HomePage() {
  let initialHomeData: HomeData | null = null;
  let initialError: string | null = null;

  try {
    initialHomeData = await getHomeServer(revalidate);
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Unable to load homepage";
  }

  return <HomePageClient initialHomeData={initialHomeData} initialError={initialError} />;
}
