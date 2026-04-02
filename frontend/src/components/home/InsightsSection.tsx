"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function InsightsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const panelScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.96, 1, 1.03]);
  const panelY = useTransform(scrollYProgress, [0, 0.45, 1], [28, 0, -18]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1.1, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [18, -10, -34]);
  const imageBrightness = useTransform(scrollYProgress, [0, 0.6, 1], [0.78, 0.94, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [18, -20]);

  return (
    <section ref={sectionRef} className="relative h-[180vh]">
      <motion.div style={{ y: textY }} className="sticky top-20 h-[76vh] min-h-[560px]">
        <motion.div style={{ y: panelY, scale: panelScale }} className="grid h-full gap-8 rounded-3xl border border-white/15 bg-black/55 p-6 backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="flex h-full gap-5 lg:gap-7">
            <div className="relative hidden w-4 shrink-0 sm:block">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
              <motion.span
                className="absolute left-1/2 top-14 h-28 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white to-blue-200/60"
                animate={{ y: [0, 18, 0] }}
                transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
              />
            </div>

            <div className="flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">Insights</p>
              <h2 className="mt-3 max-w-xl font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Engineering Notes
              </h2>

              <p className="mt-6 max-w-xl text-base leading-9 text-slate-300">
                I share practical lessons from backend architecture, API strategy, and product system design. Each note focuses on implementation choices that keep projects stable as they scale.
              </p>

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4 }}
                className="mt-7 rounded-xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <p className="text-base leading-8 text-slate-200">
                  I regularly publish professional reflections on real project experience, emerging technologies, and practical engineering insights that contribute to long-term product excellence.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="mt-auto pt-7">
                <Link href="/blog" className="group inline-flex items-center gap-3 rounded-xl border border-white/35 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10">
                  View blog
                  <span className="text-xl leading-none transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div style={{ y: imageY }} className="relative h-full min-h-[380px] overflow-hidden rounded-3xl border border-white/20 bg-[#010308] shadow-[0_22px_60px_rgba(0,0,0,0.6)]">
            <motion.div style={{ scale: imageScale }} className="absolute inset-0">
              <Image
                src="/AI.jpg"
                alt="AI concept visual"
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
                priority={false}
              />
            </motion.div>

            <motion.div
              style={{ opacity: imageBrightness }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/45"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          </motion.div>
        </motion.div>
        </motion.div>
    </section>
  );
}
