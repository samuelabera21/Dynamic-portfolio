"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditorForm from "@/components/PostEditorForm";
import { createPost } from "@/lib/api";
import { getToken } from "@/lib/auth";

type PostEditorValue = {
  title: string;
  content: string;
  published: boolean;
};

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (value: PostEditorValue) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token missing. Please login again.");

      await createPost(value, token);
      setSuccess(value.published ? "Post published successfully." : "Draft saved successfully.");
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Create Post</h1>
        <p className="mt-2 text-sm text-slate-600">Write a new blog post and publish or save as draft.</p>
      </div>

      <PostEditorForm loading={loading} error={error} success={success} onSubmit={handleSubmit} />
    </section>
  );
}
