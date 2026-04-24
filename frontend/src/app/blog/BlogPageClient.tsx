"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getHome, getPosts, getSettings } from "@/lib/api";
import { HomeData } from "@/types/home";
import { Post } from "@/types/post";
import { FeatureFlags } from "@/types/settings";

type BlogInitialData = {
  settings: FeatureFlags;
  home: HomeData | null;
  posts: Post[];
};

type BlogPageClientProps = {
  initialData?: BlogInitialData | null;
  initialError?: string | null;
};

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

const fallbackPosts: Post[] = [
  {
    id: "fallback-blog-1",
    title: "Keeping a portfolio usable during backend limits",
    content:
      "This page is showing fallback content while the database transfer limit is exhausted. The live blog will return automatically when Neon becomes available again.",
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-blog-2",
    title: "Faster first load with caching and ISR",
    content:
      "Server wrappers, cache headers, and lightweight client fallbacks help the site feel faster without changing the live content flow when the backend is healthy.",
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-blog-3",
    title: "Why graceful fallbacks matter",
    content:
      "A professional fallback keeps the site readable and useful during outages, instead of showing raw error text or a broken blank page.",
    published: true,
    createdAt: new Date().toISOString(),
  },
];

export default function BlogPageClient({
  initialData = null,
  initialError = null,
}: BlogPageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialData?.posts ?? []);
  const [authorName, setAuthorName] = useState(initialData?.home?.profile?.name || "Samuel Abera");
  const [authorAvatar, setAuthorAvatar] = useState(initialData?.home?.profile?.avatarUrl || "/favicon.png");
  const [loading, setLoading] = useState(!initialData && !initialError);
  const [error, setError] = useState<string | null>(initialError);
  const [search, setSearch] = useState("");
  const [blogEnabled, setBlogEnabled] = useState(initialData?.settings.showBlog ?? true);
  const [offlineMode, setOfflineMode] = useState(Boolean(initialError));
  const introText = "Short notes, technology updates, and real project experience.";
  const introChars = introText.split("");

  useEffect(() => {
    if (initialData) return;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [settings, home] = await Promise.all([getSettings(), getHome().catch(() => null)]);
        const blogVisible = settings.showBlog ?? true;
        setBlogEnabled(blogVisible);

        if (home?.profile) {
          setAuthorName(home.profile.name || "Samuel Abera");
          setAuthorAvatar(home.profile.avatarUrl || "/favicon.png");
        }

        if (!blogVisible) {
          setPosts([]);
          return;
        }

        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setOfflineMode(true);
        setError(err instanceof Error ? err.message : "Unable to load blog posts");
        setBlogEnabled(true);
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [initialData]);

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

  const showOfflineBanner = offlineMode || Boolean(error);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-10 pt-6 text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-blue-600/12 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl space-y-5 px-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xl">
          <motion.h1
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4 }}
            className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl"
          >
            {introChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15, delay: index * 0.01 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
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

        {showOfflineBanner ? (
          <div className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-5 text-sm text-amber-100 shadow-[0_18px_45px_rgba(6,12,24,0.45)]">
            <p className="font-semibold">Blog data is temporarily unavailable.</p>
            <p className="mt-2 leading-7 text-amber-100/80">
              You are seeing fallback posts for now. The live blog will automatically return when the database comes back online.
            </p>
          </div>
        ) : null}

        {!loading && !showOfflineBanner && blogEnabled && visiblePosts.length === 0 ? (
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
                      {!offlineMode && isLong ? (
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
                    <div className="relative aspect-[4/5] w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={media}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                  </div>
                ) : null}

                <div className="mt-auto flex items-center justify-between px-4 pb-4 text-xs text-slate-400">
                  <span>{formatDate(post.createdAt)}</span>
                  {!offlineMode ? (
                    <Link
                      href={`/blog/${post.id}`}
                      className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200 hover:bg-cyan-500/20"
                    >
                      Open Post
                    </Link>
                  ) : (
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold text-slate-400">
                      Fallback
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
