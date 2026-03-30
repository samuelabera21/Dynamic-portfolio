import Link from "next/link";
import { Project } from "@/types/project";

type Props = {
  project: Project;
};

function truncateText(value: string, length = 120): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
}

export default function ProjectCard({ project }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-50 p-2">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt={project.title} className="h-full w-full rounded-lg object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">{project.title}</h3>
        <p className="text-sm text-slate-600">{truncateText(project.description)}</p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link
            href={`/projects/${project.id}`}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
          >
            View Details
          </Link>

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              GitHub
            </a>
          ) : null}

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
