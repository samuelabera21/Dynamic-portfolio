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

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`);
  }

  return res.json() as Promise<T>;
}

export function getHomeServer(): Promise<HomeData> {
  return fetchJson<HomeData>("/home");
}

export function getSettingsServer(): Promise<FeatureFlags> {
  return fetchJson<FeatureFlags>("/settings");
}

export function getPostsServer(): Promise<Post[]> {
  return fetchJson<Post[]>("/posts");
}

export function getProjectsServer(filters: ProjectFilters = {}): Promise<Project[]> {
  return fetchJson<Project[]>(`/projects${toQueryString(filters)}`);
}
