"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getHome, getPost, getSettings } from "@/lib/api";
import { Post } from "@/types/post";
import ReactMarkdown from "react-markdown";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function markdownUrlTransform(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^javascript:/i.test(trimmed)) return "";
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return "";
}

function extractPrimaryImageAndContent(content: string): { primaryImage: string | null; textContent: string } {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  const src = match?.[1]?.trim();

  if (!src || /^javascript:/i.test(src)) {
    return { primaryImage: null, textContent: content };
  }

  return {
    primaryImage: src,
    textContent: content.replace(match?.[0] ?? "", "").trim(),
  };
}

export default function BlogDetailsPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [authorName, setAuthorName] = useState("Samuel Abera");
  const [authorAvatar, setAuthorAvatar] = useState("/favicon.png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogEnabled, setBlogEnabled] = useState(true);

  useEffect(() => {
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
          setPost(null);
          return;
        }

        const data = await getPost(params.id);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Post not found");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params.id]);

  if (loading) return <p className="text-sm text-slate-500">Loading post...</p>;

  if (!blogEnabled) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-amber-900">Blog is currently disabled</h1>
        <p className="mt-2 text-sm text-amber-800">The site administrator has temporarily turned off public blog visibility.</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-xl">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">404 - Post Not Found</h1>
        <p className="mt-2 text-sm text-slate-300">The post does not exist or is not published.</p>
        <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          Back to Blog
        </Link>
      </section>
    );
  }

  const { primaryImage, textContent } = extractPrimaryImageAndContent(post.content);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060c18] pb-12 pt-6 text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-blue-600/12 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-4xl space-y-5 px-4 sm:px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          <span aria-hidden="true">←</span>
          Back to Feed
        </Link>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1324]/92 shadow-[0_16px_40px_rgba(2,6,16,0.45)]">
          <div className="flex items-start gap-3 border-b border-white/10 p-5 sm:p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-12 w-12 rounded-full border border-white/20 object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-white">{authorName}</p>
                <p className="text-xs font-medium text-slate-400">{formatDate(post.createdAt)}</p>
              </div>
              <h1 className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl">{post.title}</h1>
            </div>
          </div>

          <div className={`p-5 sm:p-6 ${primaryImage ? "lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-6" : ""}`}>
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#09111f]/55 p-4 lg:max-h-[72vh] lg:overflow-y-auto lg:pr-5">
              <div className="max-w-none text-[16px] leading-8 text-slate-200">
                <ReactMarkdown
                  urlTransform={markdownUrlTransform}
                  components={{
                    p: ({ children }) => <p className="mb-5">{children}</p>,
                    h2: ({ children }) => <h2 className="mb-3 mt-8 text-2xl font-bold text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-3 mt-7 text-xl font-semibold text-white">{children}</h3>,
                    ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
                    li: ({ children }) => <li className="text-slate-200">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-300 underline decoration-cyan-400/40 hover:text-cyan-200">
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 border-l-2 border-cyan-300/60 bg-cyan-500/5 px-4 py-3 italic text-slate-200">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => <code className="rounded bg-[#111c31] px-1.5 py-1 text-[14px] text-cyan-200">{children}</code>,
                    img: ({ alt, src }) => (
                      typeof src === "string" && src.trim() ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={alt ?? "Post image"} className="my-6 max-h-[620px] w-full rounded-2xl border border-white/10 bg-[#09111f] p-2 object-contain" />
                      ) : null
                    ),
                  }}
                >
                  {textContent}
                </ReactMarkdown>
              </div>
            </div>

            {primaryImage ? (
              <div className="mt-5 lg:sticky lg:top-6 lg:mt-0 lg:self-start">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#09111f] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={primaryImage} alt={post.title} className="max-h-[72vh] w-full rounded-xl object-contain" />
                </div>
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
