"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getHome, getPosts, getSettings } from "@/lib/api";
import { Post } from "@/types/post";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelativeTime(value: string): string {
  const now = Date.now();
  const then = new Date(value).getTime();
  const minutes = Math.max(1, Math.floor((now - then) / (1000 * 60)));

  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return formatDate(value);
}

function extractFirstImage(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  const src = match?.[1]?.trim();
  if (!src) return null;
  if (/^javascript:/i.test(src)) return null;
  return src;
}

function normalizeText(content: string): string {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[>#*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function previewText(content: string): string {
  const normalized = normalizeText(content);

  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 160)}...`;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorName, setAuthorName] = useState("Samuel Abera");
  const [authorAvatar, setAuthorAvatar] = useState("/favicon.png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [blogEnabled, setBlogEnabled] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [settings, home] = await Promise.all([getSettings(), getHome().catch(() => null)]);
        setBlogEnabled(settings.showBlog);

        if (home?.profile) {
          setAuthorName(home.profile.name || "Samuel Abera");
          setAuthorAvatar(home.profile.avatarUrl || "/favicon.png");
        }

        if (!settings.showBlog) {
          setPosts([]);
          return;
        }

        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const visiblePosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? posts.filter(
          (post) =>
            post.title.toLowerCase().includes(term) ||
            post.content.toLowerCase().includes(term)
        )
      : posts;

    return [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, search]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-10 pt-6 text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-blue-600/12 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl space-y-5 px-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Blog Feed</h1>
          <p className="mt-2 text-sm text-slate-300">Here I share my thoughts, real happenings in technology, and hands-on experience from what I build.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts"
            disabled={!blogEnabled || loading}
            className="w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/70"
          />
        </div>

        {!loading && !error && !blogEnabled ? (
          <p className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-5 text-sm font-medium text-amber-200">
            Blog is currently disabled by the site administrator.
          </p>
        ) : null}

        {loading ? <p className="text-sm text-slate-300">Loading blog posts...</p> : null}
        {error ? <p className="text-sm font-medium text-red-300">{error}</p> : null}

        {!loading && !error && blogEnabled && visiblePosts.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">No posts found.</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post, index) => {
            const media = extractFirstImage(post.content);
            const excerpt = previewText(post.content);
            const fullText = normalizeText(post.content);
            const isLong = fullText.length > 160;

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: Math.min(0.28, (index % 3) * 0.06) }}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1324]/92 shadow-[0_16px_40px_rgba(2,6,16,0.45)]"
              >
                <div className="flex items-start gap-3 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="h-11 w-11 rounded-full border border-white/20 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-white">{authorName}</span>
                      <span className="text-slate-500">{formatRelativeTime(post.createdAt)}</span>
                    </div>

                    <div className="mt-1 flex h-[155px] flex-col">
                      <h2 className="text-xl font-bold leading-8 text-white">{post.title}</h2>
                      <p className="mt-2 flex-1 overflow-hidden text-[15px] leading-7 text-slate-200">{excerpt}</p>
                      {isLong ? (
                        <Link href={`/blog/${post.id}`} className="mt-1 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200">
                          Show more
                        </Link>
                      ) : (
                        <span className="mt-1 inline-block text-sm font-medium opacity-0">Show more</span>
                      )}
                    </div>

                  </div>
                </div>

                {media ? (
                  <div className="mx-4 mb-3 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#09111f]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media}
                      alt={post.title}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="mt-auto flex items-center justify-between px-4 pb-4 text-xs text-slate-400">
                  <span>{formatDate(post.createdAt)}</span>
                  <Link
                    href={`/blog/${post.id}`}
                    className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200 hover:bg-cyan-500/20"
                  >
                    Open Post
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
