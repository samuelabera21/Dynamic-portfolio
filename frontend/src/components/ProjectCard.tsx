import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types/project";

type Props = {
  project: Project;
};

function truncateText(value: string, length = 140): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
}

export default function ProjectCard({ project }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1324]/92 shadow-[0_14px_34px_rgba(2,6,16,0.45)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-[#09111f]">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
            No preview image
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060c18] to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-8 text-white">{project.title}</h3>
        <p className="text-sm leading-7 text-slate-300">{truncateText(project.description)}</p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link
            href={`/projects/${project.id}`}
            className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
          >
            View Details
          </Link>

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              GitHub
            </a>
          ) : null}

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
