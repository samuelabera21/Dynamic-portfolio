"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const insights = [
  {
    title: "Backend Architecture",
    description: "Patterns for reliable APIs, auth boundaries, and maintainable service structure.",
  },
  {
    title: "Building APIs",
    description: "How to design data contracts and endpoints that stay clean as products grow.",
  },
  {
    title: "System Design",
    description: "Connecting frontend, backend, and data flows into cohesive user experiences.",
  },
];

export default function InsightsSection() {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Insights</p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Engineering Notes</h2>
        </div>
        <Link href="/blog" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
          Visit blog
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
          >
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
