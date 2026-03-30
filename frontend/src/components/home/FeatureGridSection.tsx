"use client";

import { motion } from "framer-motion";

const featureItems = [
  {
    title: "Secure Messaging System",
    description: "Production-ready contact flow with protected admin message handling.",
    icon: "SH",
  },
  {
    title: "Admin Dashboard",
    description: "Centralized content operations across profile, projects, blog, and skills.",
    icon: "AD",
  },
  {
    title: "Email Notification Ready",
    description: "Extensible notification architecture for alerting and workflow updates.",
    icon: "EM",
  },
  {
    title: "Real-time Data Handling",
    description: "Unified home endpoint and optimized payload delivery for fast rendering.",
    icon: "RT",
  },
  {
    title: "Authentication & Security",
    description: "Token-based admin authorization layered across protected endpoints.",
    icon: "AU",
  },
  {
    title: "API Architecture",
    description: "Modular backend routes with scalable service separation and Prisma models.",
    icon: "API",
  },
];

export default function FeatureGridSection() {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Core Modules</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Platform Feature Grid</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureItems.map((item, index) => {
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-sm border border-white/15 bg-white/[0.03] p-5 backdrop-blur transition-shadow hover:shadow-[0_0_28px_rgba(59,130,246,0.2)]"
            >
              <div className="mb-4 inline-flex rounded-sm border border-blue-400/40 bg-blue-500/15 px-3 py-2 text-blue-200">
                <span className="text-xs font-bold tracking-[0.16em]">{item.icon}</span>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-8 text-slate-300">{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
