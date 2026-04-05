"use client";

import { FormEvent, useRef, useState } from "react";

type PostEditorValue = {
  title: string;
  content: string;
  published: boolean;
};

type Props = {
  initialValue?: PostEditorValue;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  onSubmit: (value: PostEditorValue) => Promise<void>;
};

const defaultValue: PostEditorValue = {
  title: "",
  content: "",
  published: false,
};

export default function PostEditorForm({
  initialValue,
  loading = false,
  error = null,
  success = null,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<PostEditorValue>(initialValue ?? defaultValue);
  const [mode, setMode] = useState<"draft" | "publish">("draft");
  const [uploadingImage, setUploadingImage] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const insertAtCursor = (value: string) => {
    const textarea = contentRef.current;

    if (!textarea) {
      setForm((prev) => ({ ...prev, content: `${prev.content}${value}` }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setForm((prev) => ({
      ...prev,
      content: `${prev.content.slice(0, start)}${value}${prev.content.slice(end)}`,
    }));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + value.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      const result = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
      });

      const sanitizedName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "blog image";
      insertAtCursor(`\n![${sanitizedName}](${result})\n`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      published: mode === "publish",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-semibold text-slate-700">
          Title
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-semibold text-slate-700">
          Content
        </label>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-100">
            {uploadingImage ? "Uploading..." : "Add Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingImage || loading}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                void handleImageUpload(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <span>Images are embedded into content and rendered in blog posts.</span>
        </div>
        <textarea
          ref={contentRef}
          id="content"
          value={form.content}
          onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          className="min-h-64 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-7 outline-none focus:border-blue-500"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => {
            const checked = e.target.checked;
            setForm((prev) => ({ ...prev, published: checked }));
            setMode(checked ? "publish" : "draft");
          }}
        />
        Published
      </label>

      {success ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          onClick={() => setMode("draft")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && mode === "draft" ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="submit"
          disabled={loading}
          onClick={() => setMode("publish")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && mode === "publish" ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
