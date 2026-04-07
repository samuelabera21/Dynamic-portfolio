"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { createSkill, deleteSkill, getSkills, updateSkill } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Skill } from "@/types/skill";

type FormValue = {
  name: string;
  category: string;
};

const initialForm: FormValue = {
  name: "",
  category: "frontend",
};

const suggestedCategories = [
  "frontend",
  "backend",
  "tools",
  "mobile",
  "devops",
  "cloud",
  "database",
  "ai-ml",
  "data-science",
  "cybersecurity",
  "testing",
  "ui-ux",
  "system-design",
  "productivity",
];

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<FormValue>(initialForm);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const sortedSkills = useMemo(() => {
    const preferredOrder = new Map(suggestedCategories.map((category, index) => [category, index]));

    return [...skills].sort((a, b) => {
      const aCategory = normalizeCategory(a.category);
      const bCategory = normalizeCategory(b.category);
      const aRank = preferredOrder.get(aCategory);
      const bRank = preferredOrder.get(bCategory);

      if (aRank !== undefined && bRank !== undefined && aRank !== bRank) return aRank - bRank;
      if (aRank !== undefined && bRank === undefined) return -1;
      if (aRank === undefined && bRank !== undefined) return 1;

      const categoryCompare = aCategory.localeCompare(bCategory);
      if (categoryCompare !== 0) return categoryCompare;

      return a.name.localeCompare(b.name);
    });
  }, [skills]);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");
      const data = await getSkills(token);
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingSkillId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");

      const payload = {
        ...form,
        category: normalizeCategory(form.category),
      };

      if (editingSkillId) {
        const updated = await updateSkill(editingSkillId, payload, token);
        setSkills((prev) => prev.map((skill) => (skill.id === editingSkillId ? updated : skill)));
        setSuccess("Skill updated successfully.");
      } else {
        const created = await createSkill(payload, token);
        setSkills((prev) => [created, ...prev]);
        setSuccess("Skill created successfully.");
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category || "frontend",
    });
    setSuccess(null);
    setError(null);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");

      await deleteSkill(skillToDelete.id, token);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillToDelete.id));
      setSkillToDelete(null);
      setSuccess("Skill deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete skill");
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Skills Management</h1>
        <p className="mt-2 text-sm text-slate-600">Create and manage categorized skills shown on Home and About pages.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">
          {editingSkillId ? "Edit Skill" : "Add Skill"}
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="skillName" className="mb-1 block text-sm font-semibold text-slate-700">Skill Name</label>
            <input
              id="skillName"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="skillCategory" className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
            <input
              id="skillCategory"
              list="skill-category-options"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g. frontend, ai-ml, cloud"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              required
            />
            <datalist id="skill-category-options">
              {suggestedCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingSkillId ? "Update" : "Create"}
            </button>

            {editingSkillId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {success ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{success}</p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={3}>
                  Loading skills...
                </td>
              </tr>
            ) : null}

            {!loading && sortedSkills.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={3}>
                  No skills found.
                </td>
              </tr>
            ) : null}

            {sortedSkills.map((skill) => (
              <tr key={skill.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{skill.name}</td>
                <td className="px-4 py-3 text-slate-600">{skill.category}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(skill)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setSkillToDelete(skill)}
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

      {skillToDelete ? (
        <Modal
          title="Delete Skill"
          message={`Delete \"${skillToDelete.name}\"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setSkillToDelete(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </section>
  );
}
