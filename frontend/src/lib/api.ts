import { Project, ProjectFilters, ProjectPayload } from "@/types/project";

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
    const errorBody = await res
      .json()
      .catch(() => ({ message: "Unexpected error from API" }));
    throw new Error(errorBody.message ?? "Request failed");
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
