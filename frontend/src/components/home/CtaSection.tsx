"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-r from-blue-700/40 via-violet-700/45 to-blue-700/40 p-7 shadow-[0_0_36px_rgba(59,130,246,0.24)] sm:p-10"
    >
      <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-blue-400/30 blur-3xl" />
      <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-violet-400/30 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Call To Action</p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s Build Something Powerful Together
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
            Ready to create a robust digital product with strong architecture, clean UI, and scalable backend systems.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            Contact Me
          </Link>
          <Link href="/projects" className="rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15">
            Start Project
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
