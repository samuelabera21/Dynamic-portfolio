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
      <div className="mb-6 border-b border-white/10 pb-5 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl"
        >
          My skills
        </motion.h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group [perspective:1200px]"
          >
            <div
              tabIndex={0}
              className="relative h-56 rounded-2xl outline-none transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)] group-focus-within:[transform:rotateX(180deg)]"
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-violet-500/15 p-5 shadow-[0_14px_30px_rgba(37,99,235,0.16)] [backface-visibility:hidden]">
                <h3 className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
                  {labels[category]}
                </h3>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-violet-400/40 bg-slate-950/92 p-5 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Development Workflow</p>
                <h4 className="mt-2 font-[family-name:var(--font-heading)] text-lg font-bold text-white">{labels[category]} Skills</h4>

                <div className="mt-4 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
                  {(skills[category] ?? []).map((item) => (
                    <span key={`${category}-${item}`} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-slate-100">
                      {item}
                    </span>
                  ))}
                  {(skills[category] ?? []).length === 0 ? (
                    <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-slate-100">No skills yet</span>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
