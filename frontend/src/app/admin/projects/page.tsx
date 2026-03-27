"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { deleteProject, getProjects, updateProject } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project } from "@/types/project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token not found. Please login again.");

      const data = await getProjects({ includeUnpublished: true });
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleValue = async (
    id: string,
    field: "featured" | "published",
    current: boolean
  ) => {
    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      const updated = await updateProject(
        id,
        {
          [field]: !current,
        },
        token
      );

      setProjects((prev) => prev.map((project) => (project.id === id ? updated : project)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update project");
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      await deleteProject(projectToDelete.id, token);
      setProjects((prev) => prev.filter((project) => project.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete project");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">
            Projects Management
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage portfolio projects from one place.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Add Project
        </Link>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Tech Stack</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={5}>
                  Loading projects...
                </td>
              </tr>
            ) : null}

            {!loading && projects.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={5}>
                  No projects returned. Current backend public GET endpoint may only return published entries.
                </td>
              </tr>
            ) : null}

            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{project.title}</td>
                <td className="px-4 py-3 text-slate-600">{project.techStack.join(", ")}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleValue(project.id, "featured", project.featured)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                      project.featured
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {project.featured ? "On" : "Off"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleValue(project.id, "published", project.published)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                      project.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(project)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projectToDelete ? (
        <Modal
          title="Delete Project"
          message={`Are you sure you want to delete \"${projectToDelete.title}\"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setProjectToDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </section>
  );
}
