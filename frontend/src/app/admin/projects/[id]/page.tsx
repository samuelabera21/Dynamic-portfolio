"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectForm from "@/components/ProjectForm";
import { getProject, updateProject } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project, ProjectPayload } from "@/types/project";

function normalizeProject(project: Project): ProjectPayload {
  return {
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    techStack: project.techStack,
    featured: project.featured,
    published: project.published,
  };
}

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProject(params.id);
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project. Unpublished projects may require backend admin GET support."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params.id]);

  const handleSubmit = async (payload: ProjectPayload) => {
    const token = getToken();
    if (!token) throw new Error("Admin token missing. Please login again.");

    await updateProject(params.id, payload, token);
    router.push("/admin/projects");
  };

  if (loading) return <p className="text-sm text-slate-500">Loading project...</p>;
  if (error) return <p className="text-sm font-medium text-red-600">{error}</p>;
  if (!project) return <p className="text-sm text-slate-600">Project not found.</p>;

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Edit Project</h1>
        <p className="mt-2 text-sm text-slate-600">Update project details and publish settings.</p>
      </div>
      <ProjectForm initialValue={normalizeProject(project)} submitLabel="Update Project" onSubmit={handleSubmit} />
    </section>
  );
}
