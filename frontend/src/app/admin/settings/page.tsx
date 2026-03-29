"use client";

import { useEffect, useMemo, useState } from "react";
import { getSettings, updateSettings } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { FeatureFlagKey, FeatureFlags } from "@/types/settings";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const defaultFlags: FeatureFlags = {
  showProjects: true,
  showSkills: true,
  showBlog: true,
  availableForHire: true,
};

const rows: Array<{ key: FeatureFlagKey; label: string; description: string }> = [
  {
    key: "showProjects",
    label: "Show Projects",
    description: "Display featured projects on the homepage",
  },
  {
    key: "showSkills",
    label: "Show Skills",
    description: "Display skills section on homepage",
  },
  {
    key: "showBlog",
    label: "Show Blog",
    description: "Enable blog visibility on public site",
  },
  {
    key: "availableForHire",
    label: "Available for Hire",
    description: "Show hiring availability badge in hero section",
  },
];

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<FeatureFlagKey | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setToast(null);

      try {
        const data = await getSettings();
        setFlags({ ...defaultFlags, ...data });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load settings";
        setToast({ type: "error", message });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 2400);

    return () => clearTimeout(timeout);
  }, [toast]);

  const isDisabled = useMemo(() => loading || Boolean(savingKey), [loading, savingKey]);

  const handleToggle = async (key: FeatureFlagKey) => {
    if (isDisabled) return;

    const token = getToken();
    if (!token) {
      setToast({ type: "error", message: "Admin token missing. Please login again." });
      return;
    }

    const previous = flags;
    const nextValue = !flags[key];

    setSavingKey(key);
    setFlags((current) => ({
      ...current,
      [key]: nextValue,
    }));

    try {
      const updated = await updateSettings({ [key]: nextValue }, token);
      setFlags((current) => ({ ...current, ...updated }));
      setToast({ type: "success", message: "Settings updated successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update settings";
      setFlags(previous);
      setToast({ type: "error", message: message || "Failed to update settings" });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Feature Flags</h1>
        <p className="mt-2 text-sm text-slate-600">Control what appears on your public portfolio.</p>
      </div>

      <article className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={`flag-skeleton-${index}`} className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
              ))
            : rows.map((row) => {
                const enabled = flags[row.key];
                const rowLoading = savingKey === row.key;

                return (
                  <div
                    key={row.key}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">{row.label}</h2>
                      <p className="mt-1 text-xs text-slate-600">{row.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(row.key)}
                      disabled={isDisabled}
                      aria-pressed={enabled}
                      aria-label={row.label}
                      className={`relative h-7 w-14 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        enabled ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          enabled ? "translate-x-8" : "translate-x-1"
                        }`}
                      />
                      <span className="sr-only">{enabled ? "On" : "Off"}</span>
                    </button>

                    {rowLoading ? <span className="text-xs font-medium text-slate-500">Updating...</span> : null}
                  </div>
                );
              })}
        </div>
      </article>

      {toast ? (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 rounded-lg border px-4 py-2 text-sm font-semibold shadow-md ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </section>
  );
}
