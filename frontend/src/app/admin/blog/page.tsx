"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { deletePost, getAdminPosts, updatePost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Post } from "@/types/post";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Admin token not found. Please login again.");
      const data = await getAdminPosts(token);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTogglePublished = async (post: Post) => {
    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      const updated = await updatePost(
        post.id,
        {
          title: post.title,
          content: post.content,
          published: !post.published,
        },
        token
      );

      setPosts((prev) => prev.map((item) => (item.id === post.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update post status");
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      await deletePost(postToDelete.id, token);
      setPosts((prev) => prev.filter((item) => item.id !== postToDelete.id));
      setPostToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete post");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="mt-2 text-sm text-slate-600">Manage published posts and drafts.</p>
        </div>
        <Link
          href="/admin/blog/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Create Post
        </Link>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={4}>
                  Loading posts...
                </td>
              </tr>
            ) : null}

            {!loading && posts.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={4}>
                  No posts available.
                </td>
              </tr>
            ) : null}

            {posts.map((post) => (
              <tr key={post.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{post.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      post.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(post)}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin/blog/edit/${post.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {postToDelete ? (
        <Modal
          title="Delete Post"
          message={`Delete \"${postToDelete.title}\"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setPostToDelete(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </section>
  );
}
