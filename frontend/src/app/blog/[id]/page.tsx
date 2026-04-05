"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPost, getSettings } from "@/lib/api";
import { Post } from "@/types/post";
import ReactMarkdown from "react-markdown";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogDetailsPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogEnabled, setBlogEnabled] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const settings = await getSettings();
        setBlogEnabled(settings.showBlog);

        if (!settings.showBlog) {
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
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-slate-900">404 - Post Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">The post does not exist or is not published.</p>
        <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-500">
          Back to Blog
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
        Back to Blog
      </Link>

      <article className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{formatDate(post.createdAt)}</p>
        <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">{post.title}</h1>
        <div className="prose prose-slate mt-6 max-w-none text-base leading-8 text-slate-700">
          <ReactMarkdown
            components={{
              img: ({ alt, src }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src ?? ""} alt={alt ?? "Post image"} className="my-6 w-full rounded-xl border border-slate-200 object-cover" />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </section>
  );
}
