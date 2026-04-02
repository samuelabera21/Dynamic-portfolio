"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
  showAvailableForHire: boolean;
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function HeroSection({ profile, showAvailableForHire }: Props) {
  return (
    <section className="relative overflow-hidden rounded-b-3xl border-b border-blue-400/30 bg-[#060c18] px-8 pb-14 pt-16 shadow-[0_0_60px_rgba(59,130,246,0.22)] sm:px-12 sm:pb-20 sm:pt-20">
      <Image
        src="/back.jpg"
        alt="Futuristic background"
        fill
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,20,0.88),rgba(7,18,41,0.72),rgba(14,44,112,0.6))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(59,130,246,0.28),transparent_42%)]" />
      <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-12 top-0 h-52 w-52 rounded-full bg-violet-500/30 blur-3xl" />

      <div className="relative grid min-h-[68vh] gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <span className="inline-flex rounded-full border border-blue-300/50 bg-blue-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            Software Engineer (in progress)|AI Enthusiast
          </span>

          <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build Secure, Intelligent, and Scalable Digital Systems
          </h1>

          <p className="max-w-3xl text-base leading-8 text-slate-100 sm:text-xl sm:leading-10">
            I build web applications and explore machine learning solutions.
          </p>

          <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-blue-300">Role:</span> {profile.role}
            </p>
            {showAvailableForHire && profile.available ? (
              <p>
                <span className="font-semibold text-emerald-300">Status:</span> Available for hire
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/about"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-transform duration-300 hover:scale-[1.03]"
            >
              Who is Samuel?
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
          className="hidden justify-center md:flex md:justify-end"
        >
          <div className="relative h-48 w-48 rounded-full border-4 border-blue-300/60 bg-white/10 p-2 shadow-[0_0_40px_rgba(59,130,246,0.4)] sm:h-56 sm:w-56">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-900/50 text-5xl font-bold text-white">
                {initials(profile.name) || "S"}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
