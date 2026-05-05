import BlogPageClient from "@/app/blog/BlogPageClient";
import { getHomeServer, getPostsServer, getSettingsServer } from "@/lib/server-api";
import { HomeData } from "@/types/home";
import { Post } from "@/types/post";
import { FeatureFlags } from "@/types/settings";

type BlogInitialData = {
  settings: FeatureFlags;
  home: HomeData | null;
  posts: Post[];
};

export default async function BlogPage() {
  let initialData: BlogInitialData | null = null;
  let initialError: string | null = null;

  try {
    const [settings, home] = await Promise.all([
      getSettingsServer(),
      getHomeServer().catch(() => null),
    ]);

    const blogVisible = settings.showBlog ?? true;
    const posts = blogVisible ? await getPostsServer() : [];

    initialData = {
      settings,
      home,
      posts,
    };
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Unable to load blog posts";
  }

  return <BlogPageClient initialData={initialData} initialError={initialError} />;
}
