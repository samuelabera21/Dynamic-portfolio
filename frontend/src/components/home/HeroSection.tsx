"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
  showAvailableForHire: boolean;
};

type PlatformKey = "x" | "facebook" | "instagram" | "linkedin" | "website";

function detectPlatform(platform: string, url: string): PlatformKey {
  const source = `${platform} ${url}`.toLowerCase();

  if (source.includes("twitter") || source.includes("x.com")) return "x";
  if (source.includes("facebook") || source.includes("fb")) return "facebook";
  if (source.includes("instagram") || source.includes("insta")) return "instagram";
  if (source.includes("linkedin")) return "linkedin";

  return "website";
}

function SocialIcon({ platform }: { platform: PlatformKey }) {
  if (platform === "x") return <span aria-hidden="true" className="text-lg leading-none">X</span>;

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
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
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
    <section className="relative overflow-hidden border-b border-white/10 bg-black px-8 pb-14 pt-16 sm:px-12 sm:pb-20 sm:pt-20">
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
