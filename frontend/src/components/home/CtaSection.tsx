"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#02060f] p-7 shadow-[0_26px_80px_rgba(2,6,15,0.7)] sm:p-10"
    >
      <div className="pointer-events-none absolute -left-24 bottom-8 h-60 w-60 rounded-full bg-blue-600/15 blur-[90px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.25fr_0.85fr] lg:items-stretch">
        <div className="flex gap-6 sm:gap-8">
          <div className="relative hidden w-4 shrink-0 sm:block">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/35" />
            <motion.span
              className="absolute left-1/2 top-8 h-24 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/95 to-blue-300/60"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">Career Path</p>
            <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Software Engineering Student | Full-Stack Developer | AI Enthusiast
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-9 text-slate-300">
              Building scalable web applications and learning applied AI systems.
            </p>

            <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="mt-8 inline-flex">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-xl border border-white/35 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Work With Me
                <span className="text-xl leading-none transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          whileHover={{ y: -4 }}
          className="flex h-full flex-col rounded-3xl border border-white/35 bg-black/55 p-7 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Featured Role</p>
          <h3 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold text-white">Full-Stack Developer</h3>
          <p className="mt-8 text-lg text-slate-200">Remote / Addis Ababa</p>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Open to impactful opportunities in modern web engineering and applied AI.
          </p>

          <div className="mt-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 rounded-xl border border-white/35 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              View Projects
              <span className="text-xl leading-none transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-auto flex items-center justify-center gap-3 pt-8">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full ${dot === 1 ? "bg-white" : "bg-white/35"}`}
                animate={{ opacity: dot === 1 ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.3, repeat: Infinity, delay: dot * 0.2 }}
              />
            ))}
          </div>
        </motion.article>
      </div>
    </motion.section>
  );
}
