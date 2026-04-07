"use client";

import { motion } from "framer-motion";
import { GroupedSkills } from "@/types/skill";

type Props = {
  skills: GroupedSkills;
};

const preferredOrder = [
  "frontend",
  "backend",
  "tools",
  "mobile",
  "devops",
  "cloud",
  "database",
  "ai-ml",
  "data-science",
  "cybersecurity",
  "testing",
  "ui-ux",
  "system-design",
  "productivity",
];

function formatCategoryLabel(category: string): string {
  const key = category.toLowerCase();
  const special: Record<string, string> = {
    "ai-ml": "AI / ML",
    "data-science": "Data Science",
    "ui-ux": "UI / UX",
    devops: "DevOps",
    "system-design": "System Design",
  };

  if (special[key]) return special[key];
  return category
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SkillsFlipSection({ skills }: Props) {
  const categories = Object.keys(skills)
    .filter((category) => (skills[category] ?? []).length > 0)
    .sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a.toLowerCase());
      const bIndex = preferredOrder.indexOf(b.toLowerCase());

      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return a.localeCompare(b);
    });

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                  {formatCategoryLabel(category)}
                </h3>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-violet-400/40 bg-slate-950/92 p-5 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Development Workflow</p>
                <h4 className="mt-2 font-[family-name:var(--font-heading)] text-lg font-bold text-white">{formatCategoryLabel(category)} Skills</h4>

                <div className="mt-4 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
                  {(skills[category] ?? []).map((item) => (
                    <span key={`${category}-${item}`} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-slate-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
