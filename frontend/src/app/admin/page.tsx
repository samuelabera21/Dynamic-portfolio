"use client";

import Link from "next/link";

const stats = [
  { label: "Projects", value: "Managed via API" },
  { label: "Posts", value: "Planned" },
  { label: "Messages", value: "Planned" },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Admin overview for your portfolio CMS workspace.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-slate-900">Quick Action</h2>
        <p className="mt-2 text-sm text-slate-600">Jump directly into project management workflow.</p>
        <Link
          href="/admin/projects"
          className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Manage Projects
        </Link>
      </div>
    </section>
  );
}
