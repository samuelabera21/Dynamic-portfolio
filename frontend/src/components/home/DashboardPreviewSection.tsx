"use client";

import { motion } from "framer-motion";

type Props = {
  messagesCount: number;
};

export default function DashboardPreviewSection({ messagesCount }: Props) {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Application Preview</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Control Dashboard Snapshot</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl lg:grid-cols-[1.4fr_1fr]"
      >
        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">Messages Queue</h3>
          {["Product inquiry", "Collaboration request", "Bug report", "Hiring request"].map((item, index) => (
            <div key={item} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-sm text-slate-200">{item}</p>
              <span className="text-xs text-slate-400">#{index + 1}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-blue-400/30 bg-blue-500/15 p-4">
            <p className="text-xs uppercase tracking-wide text-blue-200">Admin Controls</p>
            <p className="mt-2 text-sm text-white">Project, blog, profile, and skills updates from one panel.</p>
          </div>

          <div className="rounded-xl border border-violet-400/30 bg-violet-500/15 p-4">
            <p className="text-xs uppercase tracking-wide text-violet-200">Notifications</p>
            <p className="mt-2 text-sm text-white">{messagesCount} incoming contact interactions tracked in dashboard flow.</p>
          </div>

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">System Status</p>
            <p className="mt-2 text-sm text-white">API routes healthy and content operations active.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
