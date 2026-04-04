"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
  showAvailableForHire: boolean;
};

type PlatformKey = "x" | "facebook" | "instagram" | "linkedin" | "github" | "youtube" | "telegram" | "whatsapp" | "website";

function detectPlatform(platform: string, url: string): PlatformKey {
  const source = `${platform} ${url}`.toLowerCase();

  if (source.includes("twitter") || source.includes("x.com") || source.includes("x ")) return "x";
  if (source.includes("facebook") || source.includes("fb")) return "facebook";
  if (source.includes("instagram") || source.includes("insta")) return "instagram";
  if (source.includes("linkedin")) return "linkedin";
  if (source.includes("github") || source.includes("githu")) return "github";
  if (source.includes("youtube") || source.includes("youtu.be") || source.includes("yt")) return "youtube";
  if (source.includes("telegram") || source.includes("t.me")) return "telegram";
  if (source.includes("whatsapp") || source.includes("wa.me")) return "whatsapp";

  return "website";
}

function SocialIcon({ platform }: { platform: PlatformKey }) {
  if (platform === "x") return <span aria-hidden="true" className="text-lg leading-none">X</span>;

  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.3-5.26-1.29-5.26-5.75 0-1.27.46-2.3 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.24 2.87.12 3.17.75.8 1.2 1.83 1.2 3.1 0 4.48-2.7 5.45-5.28 5.74.41.36.78 1.07.78 2.17 0 1.57-.01 2.84-.01 3.23 0 .31.2.67.8.55A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.6 4.6 12 4.6 12 4.6s-7.6 0-9.4.5A3 3 0 0 0 .5 7.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-4.8ZM9.6 15.2V8.8L15.8 12l-6.2 3.2Z" />
      </svg>
    );
  }

  if (platform === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M9.9 15.2 9.7 19c.5 0 .7-.2 1-.4l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8L23 3.9c.3-1.2-.4-1.7-1.3-1.4L1.8 10.2c-1.1.4-1.1 1 .2 1.4l5.3 1.7L19.5 6.6c.6-.4 1.2-.2.8.1" />
      </svg>
    );
  }

  if (platform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 .5A11.5 11.5 0 0 0 2.2 17.9L1 23.5l5.8-1.1A11.5 11.5 0 1 0 12 .5Zm0 20.8a9.2 9.2 0 0 1-4.7-1.3l-.3-.2-3.4.6.7-3.2-.2-.3A9.3 9.3 0 1 1 12 21.3Zm5-6.7c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a7.6 7.6 0 0 1-2.2-1.3 8.4 8.4 0 0 1-1.6-2c-.2-.4 0-.6.1-.8l.5-.6c.2-.2.2-.4.4-.7s0-.5 0-.7-.7-1.8-1-2.5c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.4 3.4c.2.3 2.4 3.7 5.8 5.2.8.3 1.4.6 1.9.7.8.2 1.5.1 2-.1.6-.1 1.8-.8 2-1.6.2-.8.2-1.5.2-1.6 0-.1-.2-.2-.5-.4Z" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.8-4.66 4.54-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.48 0-1.94.92-1.94 1.86V12h3.3l-.53 3.46h-2.77v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.38 4.3 5.48v6.26ZM5.3 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.08 20.45H3.5V9h3.57v11.45ZM22.22 0H1.77A1.78 1.78 0 0 0 0 1.78v20.44C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M9.5 14.5l5-5" />
      <path d="M10.5 6.5h-3a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3" />
      <path d="M13.5 17.5h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

function firstName(name: string): string {
  const value = name.trim();
  if (!value) return "Samuel";
  return value.split(" ")[0] ?? "Samuel";
}

export default function HeroSection({ profile, showAvailableForHire }: Props) {
  const heroSocial = profile.socialLinks
    .slice(0, 4)
    .map((item) => ({
      ...item,
      platform: detectPlatform(item.platform, item.url),
    }));

  return (
    <section className="relative overflow-hidden bg-black px-8 pb-14 pt-16 sm:px-12 sm:pb-20 sm:pt-20">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] md:block">
        <Image
          src="/samuel.jpg"
          alt={profile.name || "Samuel Abera"}
          fill
          priority
          className="object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85),rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.35))]" />
      </div>

      <div className="relative grid min-h-[68vh] gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5 md:pr-10"
        >
          <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {profile.name || "Samuel Abera"}
          </h1>

          <p className="max-w-3xl text-base leading-8 text-slate-100 sm:text-xl sm:leading-10">
            I build web applications and explore machine learning solutions.
          </p>

          <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-blue-300">Role:</span> Software enginner
            </p>
            {showAvailableForHire && profile.available ? (
              <p>
                <span className="font-semibold text-emerald-300">Status:</span> Available for hire
              </p>
            ) : null}
          </div>

          {heroSocial.length > 0 ? (
            <div className="flex items-center gap-3 pt-2">
              {heroSocial.map((item) => (
                <a
                  key={`${item.platform}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-slate-100 transition hover:bg-black/55"
                  aria-label={item.platform}
                  title={item.platform}
                >
                  <SocialIcon platform={item.platform} />
                </a>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/about"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-transform duration-300 hover:scale-[1.03]"
            >
              Who is {firstName(profile.name)}?
            </Link>
            <Link
              href="#featured-projects"
              className="rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              explore more
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:block"
        >
          <div className="h-[68vh]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative md:hidden"
        >
          <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/15">
            <Image
              src="/samuel.jpg"
              alt={profile.name || "Samuel Abera"}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
