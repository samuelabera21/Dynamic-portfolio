"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
};

export default function AboutContactSection({ profile }: Props) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        whileHover={{ y: -6 }}
        className="group relative min-h-[440px] overflow-hidden rounded-3xl border border-white/15 bg-[#060b16] p-5 sm:p-6"
      >
        <motion.div
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image src="/back.jpg" alt="About visual" fill className="object-cover opacity-55" />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/30 to-blue-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.16),transparent_30%)]" />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-blue-400/15 blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">About</p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Who I Am</h2>
            </div>
            <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
              <Link href="/about" className="text-sm font-semibold text-blue-200 transition-colors hover:text-white">
                Full story
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-sm sm:p-5"
          >
            <p className="text-sm leading-7 text-slate-100 sm:text-[0.98rem]">{profile.bio}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                {profile.role}
              </span>
              {profile.location ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                  {profile.location}
                </span>
              ) : null}
            </div>
          </motion.div>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        whileHover={{ y: -6 }}
        className="relative overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-800 p-5 shadow-[0_0_44px_rgba(59,130,246,0.2)] sm:p-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-blue-400/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-8 right-0 h-44 w-44 rounded-full bg-violet-400/20 blur-3xl"
        />

        <div className="relative flex h-full flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">Contact</p>
          <h2 className="mt-3 max-w-lg font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight text-white sm:text-3xl">
            Let&apos;s Build Something Powerful Together
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-200 sm:text-[0.98rem]">
            Have a project, internship, or product idea? Let&apos;s collaborate on meaningful software engineering systems.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
              <Link href="/contact" className="flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-[0_10px_24px_rgba(255,255,255,0.12)] transition hover:bg-blue-50">
                Contact Me
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
              <Link href="/projects" className="flex items-center justify-center rounded-xl border border-white/35 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Start Project
              </Link>
            </motion.div>
          </div>

          <div className="mt-auto pt-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Focus", value: "Product engineering" },
                { label: "Style", value: "Modern, clean, scalable" },
                { label: "Goal", value: "Build with impact" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.3, delay: 0.08 * index }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-blue-200">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
