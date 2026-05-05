import { HomeData } from "@/types/home";
import { Post } from "@/types/post";
import { Project, ProjectFilters } from "@/types/project";
import { FeatureFlags } from "@/types/settings";

const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

function toQueryString(filters: ProjectFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.tech) params.set("tech", filters.tech);
  if (typeof filters.featured === "boolean") params.set("featured", String(filters.featured));
  if (filters.includeUnpublished) params.set("includeUnpublished", "true");

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function fetchJson<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`);
  }

  return res.json() as Promise<T>;
}

export function getHomeServer(revalidate = 300): Promise<HomeData> {
  return fetchJson<HomeData>("/home", revalidate);
}

export function getSettingsServer(revalidate = 300): Promise<FeatureFlags> {
  return fetchJson<FeatureFlags>("/settings", revalidate);
}

export function getPostsServer(revalidate = 300): Promise<Post[]> {
  return fetchJson<Post[]>("/posts", revalidate);
}

export function getProjectsServer(filters: ProjectFilters = {}, revalidate = 300): Promise<Project[]> {
  return fetchJson<Project[]>(`/projects${toQueryString(filters)}`, revalidate);
}
