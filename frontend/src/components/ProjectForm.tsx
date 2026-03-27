"use client";

import { FormEvent, useState } from "react";
import { ProjectPayload } from "@/types/project";

type Props = {
  initialValue?: ProjectPayload;
  submitLabel: string;
  onSubmit: (value: ProjectPayload) => Promise<void>;
};

const defaultValue: ProjectPayload = {
  title: "",
  description: "",
  imageUrl: "",
  githubUrl: "",
  liveUrl: "",
  techStack: [],
  featured: false,
  published: true,
};

function parseTechStack(input: string): string[] {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export default function ProjectForm({ initialValue, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<ProjectPayload>(initialValue ?? defaultValue);
  const [techInput, setTechInput] = useState((initialValue?.techStack ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        ...form,
        techStack: parseTechStack(techInput),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-semibold text-slate-700">
          Title
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-semibold text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm font-semibold text-slate-700">
            Image URL
          </label>
          <input
            id="imageUrl"
            value={form.imageUrl ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="mb-1 block text-sm font-semibold text-slate-700">
            GitHub URL
          </label>
          <input
            id="githubUrl"
            value={form.githubUrl ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, githubUrl: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="liveUrl" className="mb-1 block text-sm font-semibold text-slate-700">
          Live URL
        </label>
        <input
          id="liveUrl"
          value={form.liveUrl ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, liveUrl: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="tech" className="mb-1 block text-sm font-semibold text-slate-700">
          Tech Stack (comma separated)
        </label>
        <input
          id="tech"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="React, TypeScript, Prisma"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
          />
          Published
        </label>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
