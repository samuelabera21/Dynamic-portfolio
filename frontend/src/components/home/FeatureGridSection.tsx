"use client";

import { motion } from "framer-motion";

const featureItems = [
  {
    title: "Clean Code",
    description: "Write readable, maintainable code with clear structure and naming.",
    icon: "CC",
  },
  {
    title: "Problem Solving",
    description: "Break down complex tasks into simple, practical steps.",
    icon: "PS",
  },
  {
    title: "Data Structures & Algorithms",
    description: "Use efficient patterns to improve performance and scalability.",
    icon: "DSA",
  },
  {
    title: "Version Control",
    description: "Track changes, collaborate safely, and manage project history.",
    icon: "VC",
  },
  {
    title: "System Design",
    description: "Plan reliable architectures and scalable service interactions.",
    icon: "SD",
  },
  {
    title: "Debugging & Testing",
    description: "Find issues early and ensure features work as expected.",
    icon: "DT",
  },
];

export default function FeatureGridSection() {
  const introText =
    "Core software engineering principles that guide how I learn, build, and improve products.";
  const introChars = introText.split("");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#070f1f]/80 p-5 shadow-[0_20px_60px_rgba(2,10,26,0.45)] backdrop-blur-xl sm:p-7">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Software Engineering</p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl">Basic Principles</h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.35 }}
            whileHover={{ y: -1 }}
            className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base"
          >
            {introChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.16, delay: index * 0.01 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
          AI-Ready Mindset
        </span>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureItems.map((item, index) => {
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="group relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-[#111b30]/90 to-[#0b1222]/90 p-5 transition-shadow hover:shadow-[0_0_34px_rgba(34,211,238,0.2)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-cyan-200">
                  <span className="text-xs font-bold tracking-[0.16em]">{item.icon}</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-8 text-slate-300">{item.description}</p>

              <div className="mt-4 h-[2px] w-16 rounded-full bg-gradient-to-r from-cyan-300/70 to-transparent" />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
