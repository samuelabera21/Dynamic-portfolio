"use client";

import StatCard from "@/components/Dashboard/StatCard";
import RecentActivity from "@/components/Dashboard/RecentActivity";
import { DashboardStats, RecentMessageItem, RecentPostItem, RecentProjectItem } from "@/types/dashboard";

type Props = {
  stats: DashboardStats;
  recentMessages: RecentMessageItem[];
  recentProjects: RecentProjectItem[];
  recentPosts: RecentPostItem[];
};

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function PostIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

export default function Dashboard({ stats, recentMessages, recentProjects, recentPosts }: Props) {
  return (
    <section className="space-y-8 rounded-2xl bg-slate-50 p-6">
      <header>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Overview of your portfolio activity.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/admin/projects" label="Projects" value={stats.totalProjects} icon={<FolderIcon />} />
        <StatCard href="/admin/posts" label="Blog Posts" value={stats.totalPosts} icon={<PostIcon />} />
        <StatCard href="/admin/messages" label="Messages" value={stats.totalMessages} icon={<MessageIcon />} />
        <StatCard
          href="/admin/messages"
          label="Unread Messages"
          value={stats.unreadMessages}
          icon={<BellIcon />}
          highlight={stats.unreadMessages > 0}
        />
      </div>

      <RecentActivity messages={recentMessages} projects={recentProjects} posts={recentPosts} />
    </section>
  );
}
