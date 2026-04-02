import Link from "next/link";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
};

function formatPlatform(value: string) {
  const cleaned = value.trim();
  if (!cleaned) return "Social";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

type PlatformKey = "github" | "facebook" | "youtube" | "linkedin" | "x" | "website";

function detectPlatform(platform: string, url: string): PlatformKey {
  const source = `${platform} ${url}`.toLowerCase();

  if (source.includes("github") || source.includes("githu")) return "github";
  if (source.includes("facebook") || source.includes("fb")) return "facebook";
  if (source.includes("youtube") || source.includes("youtu.be")) return "youtube";
  if (source.includes("linkedin") || source.includes("linkedin")) return "linkedin";
  if (source.includes("twitter") || source.includes("x.com")) return "x";

  return "website";
}

function platformLabel(key: PlatformKey, fallback: string) {
  if (key === "github") return "GitHub";
  if (key === "facebook") return "Facebook";
  if (key === "youtube") return "YouTube";
  if (key === "linkedin") return "LinkedIn";
  if (key === "x") return "X";
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

  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.5L6.38 22H3.28l7.24-8.28L.8 2h6.4l4.42 5.9L18.9 2Zm-1.1 18h1.72L6.27 3.9H4.43L17.8 20Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export default function EnterpriseFooter({ profile }: Props) {
  return (
    <footer className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">Portfolio Platform</h3>
          <p className="mt-2 text-sm text-slate-300">System-focused fullstack portfolio with production workflow architecture.</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Navigation</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Reach Out</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>Email: contact@portfolio.local</p>
            {profile.socialLinks.length > 0 ? (
              profile.socialLinks.map((item) => (
                <a
                  key={`${item.platform}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-blue-200"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/30 bg-blue-500/10 text-blue-300">
                    <SocialIcon platform={detectPlatform(item.platform, item.url)} />
                  </span>
                  <span>{platformLabel(detectPlatform(item.platform, item.url), item.platform)}</span>
                </a>
              ))
            ) : (
              <p>No social links added yet.</p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 border-t border-white/10 pt-4 text-xs text-slate-400">© {new Date().getFullYear()} Portfolio Platform. All rights reserved.</p>
    </footer>
  );
}
