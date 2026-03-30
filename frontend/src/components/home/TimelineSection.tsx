"use client";

import { motion } from "framer-motion";

const events = [
  { year: "2019", title: "Started Programming", detail: "Built foundations in algorithms, data structures, and web fundamentals." },
  { year: "2021", title: "Fullstack Path", detail: "Integrated frontend frameworks with backend API development and databases." },
  { year: "2023", title: "Production Projects", detail: "Delivered complete systems with admin workflows, auth, and content tooling." },
  { year: "Now", title: "System-Level Builder", detail: "Focused on architecture, scalability, and polished product interfaces." },
];

export default function TimelineSection() {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Journey</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Experience Timeline</h2>
      </div>

      <div className="relative space-y-4 pl-6 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-gradient-to-b before:from-blue-400 before:to-violet-500">
        {events.map((event, index) => (
          <motion.article
            key={event.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="relative rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur"
          >
            <span className="absolute -left-6 top-5 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.8)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">{event.year}</p>
            <h3 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-bold text-white">{event.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">{event.detail}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
