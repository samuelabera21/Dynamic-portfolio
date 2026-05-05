"use client";

import { useEffect, useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { getAdminDashboard, getAdminPosts, getAdminProjects, getMessages } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { DashboardStats, RecentMessageItem, RecentPostItem, RecentProjectItem } from "@/types/dashboard";
import { Message } from "@/types/message";
import { Post } from "@/types/post";
import { Project } from "@/types/project";

const emptyStats: DashboardStats = {
  totalProjects: 0,
  totalPosts: 0,
  totalMessages: 0,
  unreadMessages: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getToken();
        if (!token) throw new Error("Admin token not found. Please login again.");

        const [dashboardData, messageData, projectData, postData] = await Promise.all([
          getAdminDashboard(token),
          getMessages(token),
          getAdminProjects(token),
          getAdminPosts(token),
        ]);

        setStats(dashboardData);
        setMessages(messageData);
        setProjects(projectData);
        setPosts(postData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const recentMessages = useMemo<RecentMessageItem[]>(
    () =>
      [...messages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          name: item.name,
          message: item.message,
          createdAt: item.createdAt,
        })),
    [messages]
  );

  const recentProjects = useMemo<RecentProjectItem[]>(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map((item) => ({
          id: item.id,
          title: item.title,
          createdAt: item.createdAt,
        })),
    [projects]
  );

  const recentPosts = useMemo<RecentPostItem[]>(
    () =>
      [...posts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map((item) => ({
          id: item.id,
          title: item.title,
          createdAt: item.createdAt,
        })),
    [posts]
  );

  if (loading) {
    return (
      <section className="space-y-4 rounded-2xl bg-slate-50 p-6">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm font-medium text-red-700">Failed to load dashboard data</p>
        <p className="mt-1 text-xs text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <Dashboard
      stats={stats}
      recentMessages={recentMessages}
      recentProjects={recentProjects}
      recentPosts={recentPosts}
    />
  );
}
