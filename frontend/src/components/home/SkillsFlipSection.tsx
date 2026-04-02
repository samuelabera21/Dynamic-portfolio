"use client";

import { motion } from "framer-motion";
import { GroupedSkills, SkillCategory } from "@/types/skill";

type Props = {
  skills: GroupedSkills;
};

const labels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools",
};

export default function SkillsFlipSection({ skills }: Props) {
  const categories: SkillCategory[] = ["frontend", "backend", "tools"];

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Capabilities</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Skills Matrix</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group"
          >
            <div
              tabIndex={0}
              className="relative flex h-56 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-violet-500/15 p-5 outline-none transition-all duration-300 hover:border-blue-300/70 hover:shadow-[0_14px_30px_rgba(37,99,235,0.28)] focus-visible:border-blue-300/70 focus-visible:shadow-[0_14px_30px_rgba(37,99,235,0.28)]"
            >
              <h3 className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-white transition-all duration-300 group-hover:-translate-y-14 group-focus-within:-translate-y-14">
                {labels[category]}
              </h3>

              <div className="pointer-events-none absolute inset-x-4 bottom-5 flex translate-y-4 flex-wrap justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {(skills[category] ?? []).map((item) => (
                  <span key={`${category}-${item}`} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-slate-100">
                    {item}
                  </span>
                ))}
                {(skills[category] ?? []).length === 0 ? (
                  <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-slate-100">No skills yet</span>
                ) : null}
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
