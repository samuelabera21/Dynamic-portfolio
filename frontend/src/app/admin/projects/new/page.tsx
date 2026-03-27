"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { createProject } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ProjectPayload } from "@/types/project";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (payload: ProjectPayload) => {
    const token = getToken();
    if (!token) throw new Error("Admin token missing. Please login again.");

    await createProject(payload, token);
    router.push("/admin/projects");
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">
          Create Project
        </h1>
        <p className="mt-2 text-sm text-slate-600">Add a new project entry to your portfolio.</p>
      </div>
      <ProjectForm submitLabel="Create Project" onSubmit={handleSubmit} />
    </section>
  );
}
