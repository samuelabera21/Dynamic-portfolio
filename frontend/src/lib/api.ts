import { Project, ProjectFilters, ProjectPayload } from "@/types/project";
import { Message, MessagePayload } from "@/types/message";
import { Post, PostPayload } from "@/types/post";
import { Profile, ProfilePayload } from "@/types/profile";
import { GroupedSkills, Skill, SkillPayload } from "@/types/skill";
import { HomeData } from "@/types/home";
import { FeatureFlags } from "@/types/settings";
import { DashboardStats } from "@/types/dashboard";

const API_BASE = "/api";

type RequestConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string | null;
  body?: unknown;
  cacheTtlMs?: number;
  skipCache?: boolean;
};

const PUBLIC_CACHE_TTL_MS = 300_000; // 5 minutes
const responseCache = new Map<string, { expiresAt: number; data: unknown }>();
const inflightCache = new Map<string, Promise<unknown>>();

function isCacheableRequest(path: string, method: RequestConfig["method"], token?: string | null, body?: unknown): boolean {
  return method === "GET" && !token && !body && !path.startsWith("/admin");
}

function invalidateCache(prefixes: string[]): void {
  for (const key of responseCache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      responseCache.delete(key);
    }
  }

  for (const key of inflightCache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      inflightCache.delete(key);
    }
  }
}

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { method = "GET", token, body, cacheTtlMs = PUBLIC_CACHE_TTL_MS, skipCache = false } = config;
  const canCache = !skipCache && isCacheableRequest(path, method, token, body);

  if (canCache) {
    const cached = responseCache.get(path);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }

    const inflight = inflightCache.get(path);
    if (inflight) {
      return inflight as Promise<T>;
    }
  }

  const operation = (async () => {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: canCache ? "default" : "no-store",
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const errorBody = await res
          .json()
          .catch(() => ({ message: `Request failed (${res.status})` }));
        throw new Error(errorBody.message ?? `Request failed (${res.status})`);
      }

      const errorText = await res.text().catch(() => "");
      const summary = errorText.trim().slice(0, 200);
      throw new Error(summary || `Request failed (${res.status})`);
    }

    const data = (await res.json()) as T;
    if (canCache) {
      responseCache.set(path, {
        data,
        expiresAt: Date.now() + cacheTtlMs,
      });
    }

    return data;
  })();

  if (canCache) {
    inflightCache.set(path, operation as Promise<unknown>);
  }

  try {
    return await operation;
  } finally {
    if (canCache) {
      inflightCache.delete(path);
    }
  }
}

function toQueryString(filters: ProjectFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.tech) params.set("tech", filters.tech);
  if (typeof filters.featured === "boolean") {
    params.set("featured", String(filters.featured));
  }
  if (filters.includeUnpublished) params.set("includeUnpublished", "true");

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function login(email: string, password: string): Promise<string> {
  const result = await request<{ token: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return result.token;
}

export async function getHome(): Promise<HomeData> {
  return request<HomeData>("/home");
}

export async function getAdminDashboard(token: string): Promise<DashboardStats> {
  return request<DashboardStats>("/admin/dashboard", {
    token,
  });
}

export async function getSettings(): Promise<FeatureFlags> {
  return request<FeatureFlags>("/settings");
}

export async function updateSettings(
  payload: Partial<FeatureFlags>,
  token: string
): Promise<FeatureFlags> {
  const result = await request<FeatureFlags>("/settings", {
    method: "PUT",
    body: payload,
    token,
  });

  invalidateCache(["/settings", "/home"]);
  return result;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  return request<Project[]>(`/projects${toQueryString(filters)}`);
}

export async function getProject(id: string): Promise<Project> {
  return request<Project>(`/projects/${id}`);
}

export async function createProject(
  payload: ProjectPayload,
  token: string
): Promise<Project> {
  const result = await request<Project>("/projects", {
    method: "POST",
    body: payload,
    token,
  });

  invalidateCache(["/projects", "/home"]);
  return result;
}

export async function updateProject(
  id: string,
  payload: Partial<ProjectPayload>,
  token: string
): Promise<Project> {
  const result = await request<Project>(`/projects/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });

  invalidateCache(["/projects", "/home"]);
  return result;
}

export async function deleteProject(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/projects/${id}`, {
    method: "DELETE",
    token,
  });

  invalidateCache(["/projects", "/home"]);
}

export async function sendMessage(payload: MessagePayload): Promise<Message> {
  return request<Message>("/messages", {
    method: "POST",
    body: payload,
  });
}

export async function subscribeNewsletter(email: string): Promise<{ message: string; subscribed: boolean; added: boolean }> {
  return request<{ message: string; subscribed: boolean; added: boolean }>("/settings/newsletter/subscribe", {
    method: "POST",
    body: { email },
  });
}

export async function unsubscribeNewsletter(email: string, token: string): Promise<{ message: string; unsubscribed: boolean }> {
  return request<{ message: string; unsubscribed: boolean }>("/settings/newsletter/unsubscribe", {
    method: "POST",
    body: { email, token },
  });
}

export async function getNewsletterSubscribers(token: string): Promise<{ subscribers: string[]; total: number }> {
  return request<{ subscribers: string[]; total: number }>("/settings/newsletter/subscribers", {
    token,
  });
}

export async function removeNewsletterSubscriber(email: string, token: string): Promise<{ message: string; removed: boolean; total: number }> {
  return request<{ message: string; removed: boolean; total: number }>("/settings/newsletter/subscribers", {
    method: "DELETE",
    token,
    body: { email },
  });
}

export async function getMessages(token: string): Promise<Message[]> {
  return request<Message[]>("/messages", {
    token,
  });
}

export async function markMessageAsRead(id: string, token: string): Promise<Message> {
  return request<Message>(`/messages/${id}`, {
    method: "PUT",
    token,
  });
}

export async function deleteMessage(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/messages/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getPosts(): Promise<Post[]> {
  return request<Post[]>("/posts");
}

export async function getPost(id: string): Promise<Post> {
  return request<Post>(`/posts/${id}`);
}

export async function getAdminPosts(token: string): Promise<Post[]> {
  return request<Post[]>("/posts/admin/all", {
    token,
  });
}

export async function createPost(payload: PostPayload, token: string): Promise<Post> {
  const result = await request<Post>("/posts", {
    method: "POST",
    body: payload,
    token,
  });

  invalidateCache(["/posts", "/home"]);
  return result;
}

export async function updatePost(
  id: string,
  payload: Partial<PostPayload>,
  token: string
): Promise<Post> {
  const result = await request<Post>(`/posts/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });

  invalidateCache(["/posts", "/home"]);
  return result;
}

export async function deletePost(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/posts/${id}`, {
    method: "DELETE",
    token,
  });

  invalidateCache(["/posts", "/home"]);
}

export async function getProfile(): Promise<Profile> {
  return request<Profile>("/profile");
}

export async function updateProfile(
  payload: ProfilePayload,
  token: string
): Promise<Profile> {
  const result = await request<Profile>("/profile", {
    method: "PUT",
    body: payload,
    token,
  });

  invalidateCache(["/profile", "/home"]);
  return result;
}

export async function getSkills(token?: string): Promise<Skill[]> {
  return request<Skill[]>("/skills", {
    token,
  });
}

export async function getGroupedSkills(): Promise<GroupedSkills> {
  return request<GroupedSkills>("/skills/grouped");
}

export async function createSkill(payload: SkillPayload, token: string): Promise<Skill> {
  const result = await request<Skill>("/skills", {
    method: "POST",
    body: payload,
    token,
  });

  invalidateCache(["/skills", "/home"]);
  return result;
}

export async function updateSkill(
  id: string,
  payload: SkillPayload,
  token: string
): Promise<Skill> {
  const result = await request<Skill>(`/skills/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });

  invalidateCache(["/skills", "/home"]);
  return result;
}

export async function deleteSkill(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/skills/${id}`, {
    method: "DELETE",
    token,
  });

  invalidateCache(["/skills", "/home"]);
}
