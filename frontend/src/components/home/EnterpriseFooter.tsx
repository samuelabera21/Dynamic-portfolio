"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { subscribeNewsletter } from "@/lib/api";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
};

function formatPlatform(value: string) {
  const cleaned = value.trim();
  if (!cleaned) return "Social";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

type PlatformKey = "github" | "facebook" | "youtube" | "linkedin" | "instagram" | "x" | "telegram" | "whatsapp" | "tiktok" | "website";

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
  if (source.includes("linkedin") || source.includes("linkedin")) return "linkedin";
  if (source.includes("instagram") || source.includes("insta")) return "instagram";
  if (source.includes("twitter") || source.includes("x.com")) return "x";
  if (source.includes("telegram") || source.includes("t.me")) return "telegram";
  if (source.includes("whatsapp") || source.includes("wa.me")) return "whatsapp";
  if (source.includes("tiktok") || source.includes("tik tok") || source.includes("vm.tiktok") || source.includes("m.tiktok")) return "tiktok";

  return "website";
}

function platformLabel(key: PlatformKey, fallback: string) {
  if (key === "github") return "GitHub";
  if (key === "facebook") return "Facebook";
  if (key === "youtube") return "YouTube";
  if (key === "linkedin") return "LinkedIn";
  if (key === "instagram") return "Instagram";
  if (key === "x") return "X";
  if (key === "tiktok") return "TikTok";
  if (fallback.trim()) return formatPlatform(fallback);
  return "Website";
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

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
      <path d="M9.5 14.5l5-5" />
      <path d="M10.5 6.5h-3a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3" />
      <path d="M13.5 17.5h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

export default function EnterpriseFooter({ profile }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const socialItems = profile.socialLinks.map((item) => {
    const platform = detectPlatform(item.platform, item.url);
    return {
      ...item,
      url: normalizeSocialUrl(item.url),
      platform,
      label: platformLabel(platform, item.platform),
    };
  });

  return (
    <footer className="w-full border-y border-white/10 bg-white/5 px-6 py-8 backdrop-blur-xl sm:px-10 lg:px-12">
      <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-[0.18em] text-white">Samuel Abera</h3>
            <div className="mt-8 flex flex-col gap-3 text-base text-slate-300">
              <Link href="/about" className="site-link-hover hover:text-blue-400">About</Link>
              <Link href="/projects" className="site-link-hover hover:text-blue-400">Projects</Link>
              <Link href="/blog" className="site-link-hover hover:text-blue-400">Blog</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Contact</p>
            <div className="mt-4 space-y-3 text-base text-slate-300">
              <p>Tel: +251923010537</p>
              <p>Email: samuelabera.dev@gmail.com</p>
              {profile.location ? <p>{profile.location}</p> : null}
              <Link href="/contact" className="site-link-hover inline-block hover:text-blue-400">Send a message</Link>
              {socialItems.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {socialItems.map((item) => (
                    <a
                      key={`${item.platform}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-icon-hover inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/10 text-blue-200"
                      aria-label={item.label}
                      title={item.label}
                    >
                      <SocialIcon platform={item.platform} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <p className="text-3xl font-semibold uppercase tracking-wide text-white">Subscribe</p>
          <p className="mt-4 text-base leading-7 text-slate-300">Get occasional updates about new projects, blog posts, and backend architecture experiments.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setFeedback(null);

              if (!email.trim()) {
                setFeedback("Please enter your email address.");
                return;
              }

              setLoading(true);
              try {
                const response = await subscribeNewsletter(email);
                setFeedback(response.message);
                setEmail("");
              } catch (error) {
                setFeedback(error instanceof Error ? error.message : "Unable to subscribe right now.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label htmlFor="footer-email" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-blue-200/30 bg-[#0b1730]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-200/70"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border border-blue-200/40 bg-transparent" />
              <span>Yes, send me portfolio and blog updates.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl border border-blue-200/30 bg-blue-600/80 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>

            {feedback ? <p className="text-sm text-slate-300">{feedback}</p> : null}
          </form>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-5 text-center text-xs text-slate-400">
        <div className="space-y-3">
          <p>© {new Date().getFullYear()} Portfolio Platform. Powered by modern web stack.</p>
        </div>

      </div>
    </footer>
  );
}
