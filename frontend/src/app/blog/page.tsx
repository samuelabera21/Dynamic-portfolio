"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  if (normalized.length <= 220) return normalized;
  return `${normalized.slice(0, 220)}...`;
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

      <div className="relative mx-auto w-full max-w-3xl space-y-5 px-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Blog Feed</h1>
          <p className="mt-2 text-sm text-slate-300">Fresh updates, ideas, and project notes in a social post style.</p>
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

        <div className="space-y-4">
          {visiblePosts.map((post) => {
            const media = extractFirstImage(post.content);
            const excerpt = previewText(post.content);
            const fullText = normalizeText(post.content);
            const isLong = fullText.length > 220;

            return (
              <article key={post.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1324]/92 shadow-[0_16px_40px_rgba(2,6,16,0.45)]">
                <div className="flex items-start gap-3 p-4 sm:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="h-11 w-11 rounded-full border border-white/20 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-white">{authorName}</span>
                      <span className="text-slate-400">@{authorName.toLowerCase().replace(/\s+/g, "_")}</span>
                      <span className="text-slate-500">· {formatRelativeTime(post.createdAt)}</span>
                    </div>

                    <h2 className="mt-1 text-xl font-bold text-white">{post.title}</h2>
                    <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-slate-200">{excerpt}</p>
                    {isLong ? <p className="mt-1 text-sm font-medium text-cyan-300">Show more</p> : null}

                    {media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media}
                        alt={post.title}
                        className="mt-4 h-auto max-h-[520px] w-full rounded-2xl border border-white/10 object-cover"
                      />
                    ) : null}

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{formatDate(post.createdAt)}</span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200 hover:bg-cyan-500/20"
                      >
                        Open Post
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
