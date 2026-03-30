"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
};

type Props = {
  stats: Stat[];
};

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function LiveStatsSection({ stats }: Props) {
  return (
    <section>
      <div className="mb-4 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Network Metrics</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Live System Stats</h2>
      </div>

      <div className="grid gap-3 border border-white/10 bg-[#050b17] p-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="rounded-sm border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{stat.label}</p>
            <p className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-bold text-white">
              <Counter value={stat.value} />
              {stat.suffix ?? ""}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
