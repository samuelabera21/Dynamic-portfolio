"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types/project";

type Props = {
  projects: Project[];
};

export default function FeaturedProjectsSection({ projects }: Props) {
  const headingText = "Featured Projects";
  const headingChars = headingText.split("");

  return (
    <section id="featured-projects">
      <div className="mb-6 border-b border-white/10 pb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Product Layer</p>
        <motion.h2
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl"
        >
          {headingChars.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, delay: index * 0.012 }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 240, damping: 18 }} className="mt-2">
          <Link href="/projects" className="site-link-hover text-sm font-semibold text-blue-300 hover:text-blue-400">
            View all projects
          </Link>
        </motion.div>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl transition-shadow hover:shadow-[0_0_28px_rgba(59,130,246,0.24)]"
            >
              <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-500/15 to-violet-500/10 p-3">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <p className="text-sm text-slate-300">No image available</p>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">{project.title}</h3>
                <p className="line-clamp-3 text-sm text-slate-300">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className="rounded-full border border-blue-300/30 bg-blue-500/15 px-2.5 py-1 text-[11px] font-semibold text-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      GitHub
                    </a>
                  ) : null}

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Live Demo
                    </a>
                  ) : null}

                  <Link
                    href={`/projects/${project.id}`}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-300">No featured projects available yet.</p>
      )}
    </section>
  );
}
