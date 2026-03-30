"use client";

import Link from "next/link";
import { RecentMessageItem, RecentPostItem, RecentProjectItem } from "@/types/dashboard";

type Props = {
  messages: RecentMessageItem[];
  projects: RecentProjectItem[];
  posts: RecentPostItem[];
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function preview(text: string): string {
  const cleaned = text.trim();
  if (cleaned.length <= 72) return cleaned;
  return `${cleaned.slice(0, 72)}...`;
}

export default function RecentActivity({ messages, projects, posts }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">Recent Activity</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Recent Messages</h3>
            <Link href="/admin/messages" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? <p className="text-sm text-slate-500">No recent messages.</p> : null}
            {messages.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="mt-1 text-xs text-slate-600">{preview(item.message)}</p>
                <p className="mt-2 text-[11px] font-medium text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Recent Projects</h3>
            <Link href="/admin/projects" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? <p className="text-sm text-slate-500">No recent projects.</p> : null}
            {projects.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="mt-2 text-[11px] font-medium text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Recent Posts</h3>
            <Link href="/admin/posts" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {posts.length === 0 ? <p className="text-sm text-slate-500">No recent posts.</p> : null}
            {posts.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="mt-2 text-[11px] font-medium text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
