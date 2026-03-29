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
};

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { method = "GET", token, body } = config;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
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

  return res.json() as Promise<T>;
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
  return request<FeatureFlags>("/settings", {
    method: "PUT",
    body: payload,
    token,
  });
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
  return request<Project>("/projects", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function updateProject(
  id: string,
  payload: Partial<ProjectPayload>,
  token: string
): Promise<Project> {
  return request<Project>(`/projects/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export async function deleteProject(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/projects/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function sendMessage(payload: MessagePayload): Promise<Message> {
  return request<Message>("/messages", {
    method: "POST",
    body: payload,
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
  return request<Post>("/posts", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function updatePost(
  id: string,
  payload: Partial<PostPayload>,
  token: string
): Promise<Post> {
  return request<Post>(`/posts/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export async function deletePost(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/posts/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getProfile(): Promise<Profile> {
  return request<Profile>("/profile");
}

export async function updateProfile(
  payload: ProfilePayload,
  token: string
): Promise<Profile> {
  return request<Profile>("/profile", {
    method: "PUT",
    body: payload,
    token,
  });
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
  return request<Skill>("/skills", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function updateSkill(
  id: string,
  payload: SkillPayload,
  token: string
): Promise<Skill> {
  return request<Skill>(`/skills/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export async function deleteSkill(id: string, token: string): Promise<void> {
  await request<{ message: string }>(`/skills/${id}`, {
    method: "DELETE",
    token,
  });
}
