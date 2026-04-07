"use client";

import { FormEvent, useEffect, useState } from "react";
import { getHome, sendMessage } from "@/lib/api";
import { SocialLink } from "@/types/profile";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type PlatformKey = "github" | "facebook" | "youtube" | "linkedin" | "x" | "telegram" | "whatsapp" | "tiktok" | "instagram" | "website";

function normalizeSocialUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "#";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function detectPlatform(platform: string, url: string): PlatformKey {
  const source = `${platform} ${url}`.toLowerCase();

  if (source.includes("github") || source.includes("githu")) return "github";
  if (source.includes("facebook") || source.includes("fb")) return "facebook";
  if (source.includes("youtube") || source.includes("youtu.be")) return "youtube";
  if (source.includes("linkedin")) return "linkedin";
  if (source.includes("twitter") || source.includes("x.com")) return "x";
  if (source.includes("telegram") || source.includes("t.me")) return "telegram";
  if (source.includes("whatsapp") || source.includes("wa.me")) return "whatsapp";
  if (source.includes("tiktok") || source.includes("tik tok") || source.includes("tt")) return "tiktok";
  if (source.includes("instagram") || source.includes("insta")) return "instagram";

  return "website";
}

function platformLabel(platform: PlatformKey, fallback: string): string {
  if (platform === "github") return "GitHub";
  if (platform === "facebook") return "Facebook";
  if (platform === "youtube") return "YouTube";
  if (platform === "linkedin") return "LinkedIn";
  if (platform === "x") return "X";
  if (platform === "telegram") return "Telegram";
  if (platform === "whatsapp") return "WhatsApp";
  if (platform === "tiktok") return "TikTok";
  if (platform === "instagram") return "Instagram";

  const cleaned = fallback.trim();
  if (!cleaned) return "Website";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function SocialIcon({ platform }: { platform: PlatformKey }) {
  const common = "h-4 w-4";

  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.3-5.26-1.29-5.26-5.75 0-1.27.46-2.3 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.24 2.87.12 3.17.75.8 1.2 1.83 1.2 3.1 0 4.48-2.7 5.45-5.28 5.74.41.36.78 1.07.78 2.17 0 1.57-.01 2.84-.01 3.23 0 .31.2.67.8.55A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.8-4.66 4.54-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.48 0-1.94.92-1.94 1.86V12h3.3l-.53 3.46h-2.77v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.6 4.6 12 4.6 12 4.6s-7.6 0-9.4.5A3 3 0 0 0 .5 7.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-4.8ZM9.6 15.2V8.8L15.8 12l-6.2 3.2Z" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.38 4.3 5.48v6.26ZM5.3 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.08 20.45H3.5V9h3.57v11.45ZM22.22 0H1.77A1.78 1.78 0 0 0 0 1.78v20.44C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.5L6.38 22H3.28l7.24-8.28L.8 2h6.4l4.42 5.9L18.9 2Zm-1.1 18h1.72L6.27 3.9H4.43L17.8 20Z" />
      </svg>
    );
  }

  if (platform === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M9.9 15.2 9.7 19c.5 0 .7-.2 1-.4l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8L23 3.9c.3-1.2-.4-1.7-1.3-1.4L1.8 10.2c-1.1.4-1.1 1 .2 1.4l5.3 1.7L19.5 6.6c.6-.4 1.2-.2.8.1" />
      </svg>
    );
  }

  if (platform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M12 .5A11.5 11.5 0 0 0 2.2 17.9L1 23.5l5.8-1.1A11.5 11.5 0 1 0 12 .5Zm0 20.8a9.2 9.2 0 0 1-4.7-1.3l-.3-.2-3.4.6.7-3.2-.2-.3A9.3 9.3 0 1 1 12 21.3Zm5-6.7c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a7.6 7.6 0 0 1-2.2-1.3 8.4 8.4 0 0 1-1.6-2c-.2-.4 0-.6.1-.8l.5-.6c.2-.2.2-.4.4-.7s0-.5 0-.7-.7-1.8-1-2.5c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.4 3.4c.2.3 2.4 3.7 5.8 5.2.8.3 1.4.6 1.9.7.8.2 1.5.1 2-.1.6-.1 1.8-.8 2-1.6.2-.8.2-1.5.2-1.6 0-.1-.2-.2-.5-.4Z" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M14 3h2.4c.3 1.7 1.5 3 3.1 3.3v2.6a8.1 8.1 0 0 1-3.1-1v6.6a5.4 5.4 0 1 1-5.5-5.4c.2 0 .4 0 .6.1V12a2.7 2.7 0 1 0 2.5 2.7V3Z" />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
      <path d="M9.5 14.5l5-5" />
      <path d="M10.5 6.5h-3a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3" />
      <path d="M13.5 17.5h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

function InfoIcon({ kind }: { kind: "address" | "phone" | "email" | "social" }) {
  if (kind === "address") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M12 21s-7-5.8-7-11a7 7 0 1 1 14 0c0 5.2-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2L8 9.4a16 16 0 0 0 6.6 6.6l1.1-1.1a2 2 0 0 1 2-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 11 15.4 6.9M8.6 13l6.8 4.1" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const home = await getHome();
        setSocialLinks(home.profile?.socialLinks ?? []);
      } catch {
        setSocialLinks([]);
      }
    };

    run();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const messageBody = form.subject.trim()
        ? `Subject: ${form.subject.trim()}\n\n${form.message}`
        : form.message;

      await sendMessage({
        name: form.name,
        email: form.email,
        message: messageBody,
      });
      setSuccess("Your message was sent. A confirmation reply will be sent to your email address.");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#060c18] px-6 pb-12 pt-12 sm:px-10 lg:px-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Contact</p>
          <h1 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-bold text-white sm:text-5xl">CONTACT</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Send your project idea, collaboration request, or question. I usually respond quickly with next steps.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.45fr]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-cyan-300/35 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                  <InfoIcon kind="address" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Address</h2>
                  <p className="mt-1 text-sm text-slate-200">Ethiopia</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                  <InfoIcon kind="phone" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Call Me</h2>
                  <a href="tel:+251923010537" className="mt-1 block text-sm text-slate-200 hover:text-cyan-200">
                    +251923010537
                  </a>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                  <InfoIcon kind="email" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Email Me</h2>
                  <a href="mailto:Samuelabera.dev@gmail.com" className="mt-1 block text-sm text-slate-200 hover:text-cyan-200">
                    Samuelabera.dev@gmail.com
                  </a>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm font-semibold text-slate-200">Social Profiles</span>
                {socialLinks.map((item, index) => {
                  const platform = detectPlatform(item.platform, item.url);
                  const label = platformLabel(platform, item.platform);
                  return (
                    <a
                      key={`${item.platform}-${item.url}-${index}`}
                      href={normalizeSocialUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-icon-hover inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/10 text-blue-200"
                      aria-label={label}
                      title={label}
                    >
                      <SocialIcon platform={platform} />
                    </a>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.45)] backdrop-blur-xl sm:p-7">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Your Name"
              required
            />

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Your Email"
              required
            />

            <input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              className="sm:col-span-2 w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Subject"
            />

            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              className="sm:col-span-2 min-h-40 w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Message"
              required
            />

            {success ? (
              <p className="sm:col-span-2 rounded-xl border border-emerald-300/35 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">
                {success}
              </p>
            ) : null}

            {error ? (
              <p className="sm:col-span-2 rounded-xl border border-red-300/35 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
                {error}
              </p>
            ) : null}

              <div className="sm:col-span-2 flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-cyan-300/40 bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
