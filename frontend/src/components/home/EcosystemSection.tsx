"use client";

import { useState } from "react";
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
  const [activeStep, setActiveStep] = useState(workflowSteps[0]?.title ?? "");

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
          const isActive = activeStep === step.title;

          return (
            <motion.button
              key={step.title}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              onClick={() => setActiveStep((prev) => (prev === step.title ? "" : step.title))}
              className={
                isActive
                  ? "rounded-xl border border-blue-300/70 bg-blue-500/10 p-5 text-left shadow-[0_0_28px_rgba(59,130,246,0.35)]"
                  : "rounded-xl border border-white/15 bg-white/[0.03] p-5 text-left transition-colors hover:border-blue-300/40"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-blue-200">{step.label}</p>
                </div>
                <span
                  className={
                    isActive
                      ? "inline-flex h-7 w-7 items-center justify-center rounded-md border border-blue-300/70 bg-blue-500/30 text-base font-bold text-white"
                      : "inline-flex h-7 w-7 items-center justify-center rounded-md border border-blue-300/40 bg-blue-500/15 text-base font-bold text-blue-200"
                  }
                >
                  +
                </span>
              </div>

              {isActive ? <p className="mt-4 text-sm leading-7 text-slate-200">{step.description}</p> : null}
            </motion.button>
          );
        })}
      </div>

      <p className="mt-6 text-base text-slate-300">Principles I focus on while learning and building projects.</p>
    </section>
  );
}
