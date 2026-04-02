"use client";

import { useEffect, useMemo, useState } from "react";
import { getNewsletterSubscribers, removeNewsletterSubscriber } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingEmail, setSavingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const total = useMemo(() => subscribers.length, [subscribers]);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");

      const data = await getNewsletterSubscribers(token);
      setSubscribers(data.subscribers);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timeout);
  }, [toast]);

  const handleExport = () => {
    if (subscribers.length === 0) return;

    const csv = ["email", ...subscribers].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast("CSV exported");
  };

  const handleRemove = async (email: string) => {
    const token = getToken();
    if (!token) {
      setError("Admin token missing. Please login again.");
      return;
    }

    const confirmed = window.confirm(`Remove ${email} from the newsletter list?`);
    if (!confirmed) return;

    setSavingEmail(email);
    setError(null);

    try {
      await removeNewsletterSubscriber(email, token);
      setSubscribers((current) => current.filter((item) => item !== email));
      setToast("Subscriber removed");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to remove subscriber");
    } finally {
      setSavingEmail(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Newsletter Subscribers</h1>
          <p className="mt-2 text-sm text-slate-600">View, export, and manage newsletter subscribers.</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchSubscribers}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={subscribers.length === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export CSV
          </button>
        </div>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Subscribers</h2>
            <p className="text-sm text-slate-600">Total: {total}</p>
          </div>
        </div>

        {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={2}>
                    Loading subscribers...
                  </td>
                </tr>
              ) : null}

              {!loading && subscribers.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={2}>
                    No subscribers yet.
                  </td>
                </tr>
              ) : null}

              {subscribers.map((email) => (
                <tr key={email} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{email}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleRemove(email)}
                      disabled={savingEmail === email}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingEmail === email ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-md">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
