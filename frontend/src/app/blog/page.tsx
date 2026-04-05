"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPosts, getSettings } from "@/lib/api";
import { Post } from "@/types/post";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function extractFirstImage(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  const src = match?.[1]?.trim();
  if (!src) return null;
  if (/^javascript:/i.test(src)) return null;
  return src;
}

function previewText(content: string): string {
  const normalized = content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[>#*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length <= 150) return normalized;
  return `${normalized.slice(0, 150)}...`;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [blogEnabled, setBlogEnabled] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const settings = await getSettings();
        setBlogEnabled(settings.showBlog);

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
    <section className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Blog</h1>
        <p className="mt-2 text-sm text-slate-600">Insights, engineering notes, and project stories.</p>
      </div>

      {!loading && !error && !blogEnabled ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800">
          Blog is currently disabled by the site administrator.
        </p>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or content"
          disabled={!blogEnabled || loading}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading blog posts...</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {!loading && !error && blogEnabled && visiblePosts.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">No posts found.</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <article key={post.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {extractFirstImage(post.content) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={extractFirstImage(post.content) ?? undefined}
                alt={post.title}
                className="h-44 w-full border-b border-slate-200 object-cover"
              />
            ) : null}
            <div className="flex h-full flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{formatDate(post.createdAt)}</p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">{previewText(post.content)}</p>
            <Link
              href={`/blog/${post.id}`}
              className="mt-auto pt-4 text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Read More
            </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
