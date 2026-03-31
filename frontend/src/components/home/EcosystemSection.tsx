"use client";

import { motion } from "framer-motion";

const workflowSteps = [
  {
    title: "Client (UI)",
    label: "User Interface",
    description:
      "I build responsive and interactive user interfaces using modern frameworks like React. This layer handles user input, state management, and communicates with backend APIs.",
  },
  {
    title: "API Gateway",
    label: "API Layer",
    description:
      "I structure API entry points to manage requests, handle authentication, and validate incoming data before passing it to backend services.",
  },
  {
    title: "Backend Services",
    label: "Server Logic",
    description:
      "I implement core business logic, authentication systems, and server-side operations that power the application's functionality.",
  },
  {
    title: "Database",
    label: "Data Storage",
    description:
      "I design and manage databases to ensure secure, consistent, and efficient data storage and retrieval.",
  },
  {
    title: "External Services",
    label: "Integrations",
    description:
      "I integrate third-party services such as email systems, APIs, or cloud tools to extend application capabilities.",
  },
  {
    title: "Deployment & Monitoring",
    label: "DevOps",
    description:
      "I deploy applications to production and monitor performance, errors, and uptime to ensure reliability.",
  },
];

export default function EcosystemSection() {
  const pipelineText =
    "Client (UI) \u2192 API Gateway \u2192 Backend Services \u2192 Database \u2192 External Services \u2192 Deployment & Monitoring";

  return (
    <section>
      <div className="mb-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">My Development Workflow</p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">My development Workflow</h2>
        <p className="max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
          How I design, build, and deliver full-stack applications in real-world environments.
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Pipeline</p>
        <p className="mt-2 text-sm font-medium leading-7 text-slate-200 sm:text-base">{pipelineText}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workflowSteps.map((step, index) => {
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              className="group [perspective:1200px]"
            >
              <div className="relative h-56 rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-violet-500/15 p-5 [backface-visibility:hidden]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-blue-200">{step.label}</p>
                    </div>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-blue-300/50 bg-blue-500/20 text-base font-bold text-blue-100">
                      +
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl border border-violet-400/40 bg-slate-950/90 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <h4 className="font-[family-name:var(--font-heading)] text-lg font-bold text-violet-200">{step.label}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{step.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-base text-slate-300">Principles I focus on while learning and building projects.</p>
    </section>
  );
}
