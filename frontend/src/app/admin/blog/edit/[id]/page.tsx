"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostEditorForm from "@/components/PostEditorForm";
import { getAdminPosts, updatePost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Post } from "@/types/post";

type PostEditorValue = {
  title: string;
  content: string;
  published: boolean;
};

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setFetching(true);
      setError(null);

      try {
        const token = getToken();
        if (!token) throw new Error("Admin token missing. Please login again.");

        const posts = await getAdminPosts(token);
        const current = posts.find((item) => item.id === params.id) ?? null;

        if (!current) {
          throw new Error("Post not found.");
        }

        setPost(current);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load post");
      } finally {
        setFetching(false);
      }
    };

    run();
  }, [params.id]);

  const handleSubmit = async (value: PostEditorValue) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");

      await updatePost(params.id, value, token);
      setSuccess(value.published ? "Post published successfully." : "Draft updated successfully.");
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-sm text-slate-500">Loading post editor...</p>;
  if (error && !post) return <p className="text-sm font-medium text-red-600">{error}</p>;
  if (!post) return <p className="text-sm text-slate-600">Post not found.</p>;

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Edit Post</h1>
        <p className="mt-2 text-sm text-slate-600">Update content and publish status.</p>
      </div>

      <PostEditorForm
        initialValue={{
          title: post.title,
          content: post.content,
          published: post.published,
        }}
        loading={loading}
        error={error}
        success={success}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
