"use client";

import { motion } from "framer-motion";

const nodes = ["Frontend", "Backend", "Database", "Email System", "Admin Panel"];

export default function EcosystemSection() {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Architecture</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Ecosystem Pipeline</h2>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-5">
          {nodes.map((node, index) => (
            <motion.div
              key={node}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="relative rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-violet-500/15 p-4 text-center"
            >
              <p className="text-sm font-semibold text-white">{node}</p>
              {index < nodes.length - 1 ? (
                <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-blue-300 md:block">→</span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
