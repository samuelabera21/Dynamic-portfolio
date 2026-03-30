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

const descriptions: Record<SkillCategory, string> = {
  frontend: "Build responsive, accessible interfaces with scalable component architecture.",
  backend: "Design robust APIs, authentication flows, and database-driven services.",
  tools: "Use modern engineering tooling for CI, deployment, testing, and productivity.",
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
            className="group [perspective:1200px]"
          >
            <div className="relative h-56 rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-violet-500/15 p-5 [backface-visibility:hidden]">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">{labels[category]}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(skills[category] ?? []).slice(0, 6).map((item) => (
                    <span key={`${category}-${item}`} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-slate-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-violet-400/40 bg-slate-950/90 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <h4 className="font-[family-name:var(--font-heading)] text-lg font-bold text-violet-200">{labels[category]} Capability</h4>
                <p className="mt-3 text-sm leading-7 text-slate-200">{descriptions[category]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
