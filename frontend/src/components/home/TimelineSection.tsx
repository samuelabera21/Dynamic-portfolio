"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const principles = [
  {
    title: "Problem First",
    detail: "I focus on understanding the real problem before writing code.",
  },
  {
    title: "Clean Architecture",
    detail: "I write structured, maintainable, and scalable code.",
  },
  {
    title: "User Experience Matters",
    detail: "Every feature I build is designed with the user in mind.",
  },
  {
    title: "Continuous Learning",
    detail: "I constantly improve through building real-world projects.",
  },
];

export default function TimelineSection() {
  return (
    <section>
      <div className="mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">My Approach</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">How I Build</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          {principles.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="group rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition-all hover:border-blue-300/45 hover:bg-white/[0.08]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-300/45 bg-blue-500/15 text-xs font-semibold text-blue-200">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-300">{item.detail}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="relative min-h-[460px] overflow-hidden rounded-3xl border border-white/15 bg-black/45 p-4"
        >
          <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 170, damping: 16 }}
            className="relative h-[58%] overflow-hidden rounded-2xl border border-white/20"
          >
            <Image src="/Learn.jpg" alt="Modern learning and development visual" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
          </motion.div>

          <div className="mt-4 grid h-[calc(42%-1rem)] grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative overflow-hidden rounded-2xl border border-white/20"
            >
              <Image src="/AI2.jpg" alt="AI engineering concept" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative overflow-hidden rounded-2xl border border-white/20"
            >
              <Image src="/AI3.jpg" alt="Product and technology concept" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
