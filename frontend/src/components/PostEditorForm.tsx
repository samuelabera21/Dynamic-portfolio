"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

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

type EmbeddedImage = {
  id: string;
  alt: string;
  dataUrl: string;
};

const defaultValue: PostEditorValue = {
  title: "",
  content: "",
  published: false,
};

function createImageId() {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toPlaceholder(id: string): string {
  return `[[image:${id}]]`;
}

function normalizeInitialValue(value: PostEditorValue): {
  form: PostEditorValue;
  images: EmbeddedImage[];
} {
  const images: EmbeddedImage[] = [];

  const normalizedContent = value.content.replace(
    /!\[([^\]]*)\]\((data:image\/[a-zA-Z0-9.+-]+;base64,[^)]+)\)/g,
    (_match, alt: string, dataUrl: string) => {
      const id = createImageId();
      images.push({
        id,
        alt: alt || "blog image",
        dataUrl,
      });
      return `![${alt || "blog image"}](${toPlaceholder(id)})`;
    }
  );

  return {
    form: {
      ...value,
      content: normalizedContent,
    },
    images,
  };
}

function expandContentWithImages(content: string, images: EmbeddedImage[]): string {
  const lookup = new Map(images.map((item) => [item.id, item]));

  return content.replace(
    /!\[([^\]]*)\]\(\[\[image:([a-zA-Z0-9_-]+)\]\]\)/g,
    (match, alt: string, id: string) => {
      const image = lookup.get(id);
      if (!image) return match;
      return `![${alt || image.alt}](${image.dataUrl})`;
    }
  );
}

export default function PostEditorForm({
  initialValue,
  loading = false,
  error = null,
  success = null,
  onSubmit,
}: Props) {
  const preparedInitial = useMemo(
    () => normalizeInitialValue(initialValue ?? defaultValue),
    [initialValue]
  );
  const [form, setForm] = useState<PostEditorValue>(preparedInitial.form);
  const [images, setImages] = useState<EmbeddedImage[]>(preparedInitial.images);
  const [mode, setMode] = useState<"draft" | "publish">("draft");
  const [uploadingImage, setUploadingImage] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setForm(preparedInitial.form);
    setImages(preparedInitial.images);
  }, [preparedInitial]);

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
      const rawDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
      });

      const optimizedDataUrl = await new Promise<string>((resolve) => {
        const image = new Image();
        image.onload = () => {
          const maxWidth = 1400;
          const scale = image.width > maxWidth ? maxWidth / image.width : 1;
          const width = Math.round(image.width * scale);
          const height = Math.round(image.height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };

        image.onerror = () => resolve(rawDataUrl);
        image.src = rawDataUrl;
      });

      const sanitizedName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "blog image";
      const id = createImageId();

      setImages((prev) => [
        ...prev,
        {
          id,
          alt: sanitizedName,
          dataUrl: optimizedDataUrl,
        },
      ]);

      insertAtCursor(`\n![${sanitizedName}](${toPlaceholder(id)})\n`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
    setForm((prev) => ({
      ...prev,
      content: prev.content.replace(
        new RegExp(`!?\\[[^\\]]*\\]\\(\\[\\[image:${id}\\]\\]\\)`, "g"),
        ""
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      content: expandContentWithImages(form.content, images),
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
          <span>Image URLs are hidden in editor. You will only see clean placeholders + previews.</span>
        </div>
        {images.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
            {images.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-md border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.dataUrl} alt={image.alt} className="h-16 w-20 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute right-1 top-1 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
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
