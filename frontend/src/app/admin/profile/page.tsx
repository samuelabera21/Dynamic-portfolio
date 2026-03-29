"use client";

import { useEffect, useMemo, useState } from "react";
import { getProfile, updateProfile } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ProfilePayload } from "@/types/profile";

type SocialInput = {
  platform: string;
  url: string;
};

const defaultForm: ProfilePayload = {
  name: "",
  role: "",
  bio: "",
  avatarUrl: "",
  resumeUrl: "",
  location: "",
  available: true,
  socialLinks: [],
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read selected file."));
    reader.readAsDataURL(file);
  });
}

export default function AdminProfilePage() {
  const [form, setForm] = useState<ProfilePayload>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getProfile();
        setForm({
          name: profile.name,
          role: profile.role,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          resumeUrl: profile.resumeUrl,
          location: profile.location ?? "",
          available: profile.available,
          socialLinks: profile.socialLinks.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const profilePreview = useMemo(() => {
    if (!form.avatarUrl) return null;
    return form.avatarUrl;
  }, [form.avatarUrl]);

  const updateSocialLink = (index: number, value: Partial<SocialInput>) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, currentIndex) =>
        currentIndex === index ? { ...link, ...value } : link
      ),
    }));
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setError(null);
      const value = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, avatarUrl: value }));
      setAvatarFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to process avatar file");
    }
  };

  const handleResumeUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setError(null);
      const value = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, resumeUrl: value }));
      setResumeFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to process resume file");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");

      const payload: ProfilePayload = {
        ...form,
        location: form.location?.trim() || "",
        socialLinks: form.socialLinks.filter(
          (item) => item.platform.trim() && item.url.trim()
        ),
      };

      const updated = await updateProfile(payload, token);
      setSuccess("Profile updated successfully.");
      setForm({
        name: updated.name,
        role: updated.role,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
        resumeUrl: updated.resumeUrl,
        location: updated.location ?? "",
        available: updated.available,
        socialLinks: updated.socialLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading profile settings...</p>;

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Profile Management</h1>
        <p className="mt-2 text-sm text-slate-600">Manage personal branding content used across Home and About pages.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[640px] space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">Basic Info</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
              <input
                id="role"
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="mb-1 block text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                className="min-h-40 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-7 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-semibold text-slate-700">Location</label>
              <input
                id="location"
                value={form.location ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
              />
              Available for hire
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">Media</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="avatarUrl" className="mb-1 block text-sm font-semibold text-slate-700">Avatar URL</label>
              <input
                id="avatarUrl"
                value={form.avatarUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <label htmlFor="avatarFile" className="mt-3 block text-xs font-semibold text-slate-600">
                Or upload avatar from local machine
              </label>
              <input
                id="avatarFile"
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              {avatarFileName ? (
                <p className="mt-1 text-xs text-slate-500">Selected file: {avatarFileName}</p>
              ) : null}
            </div>

            {profilePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profilePreview} alt="Avatar preview" className="h-28 w-28 rounded-xl border border-slate-200 object-cover" />
            ) : (
              <p className="text-xs text-slate-500">No avatar preview.</p>
            )}

            <div>
              <label htmlFor="resumeUrl" className="mb-1 block text-sm font-semibold text-slate-700">Resume URL</label>
              <input
                id="resumeUrl"
                value={form.resumeUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, resumeUrl: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <label htmlFor="resumeFile" className="mt-3 block text-xs font-semibold text-slate-600">
                Or upload resume from local machine
              </label>
              <input
                id="resumeFile"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => handleResumeUpload(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              {resumeFileName ? (
                <p className="mt-1 text-xs text-slate-500">Selected file: {resumeFileName}</p>
              ) : null}

              {form.resumeUrl ? (
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Preview Resume
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">Social Links</h2>

          <div className="mt-4 space-y-3">
            {form.socialLinks.length === 0 ? (
              <p className="text-sm text-slate-500">No social links yet.</p>
            ) : null}

            {form.socialLinks.map((link, index) => (
              <div key={`social-${index}`} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_2fr_auto]">
                <input
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, { platform: e.target.value })}
                  placeholder="Platform (github, linkedin)"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                  placeholder="https://..."
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSocialLink}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Add Social Link
            </button>
          </div>
        </div>

        {success ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{success}</p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
