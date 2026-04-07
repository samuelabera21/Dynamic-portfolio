import Link from "next/link";
import { Project } from "@/types/project";

type ResumeProjectCardProps = {
  project: Project;
};

function formatDate(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProjectCard({ project }: ResumeProjectCardProps) {
  return (
    <article className="rounded-xl border border-gray-700 bg-gray-900 p-4 transition hover:scale-[1.01] hover:shadow-lg">
      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      <p className="mt-1 text-sm text-gray-400">{formatDate(project.createdAt)}</p>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-300">
        {project.description}
      </p>

      {project.techStack.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={`${project.id}-${tech}`}
              className="rounded-full border border-gray-600 px-2.5 py-1 text-xs text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:bg-gray-800"
        >
          Details
        </Link>

        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:bg-gray-800"
          >
            GitHub
          </a>
        ) : null}

        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-600 px-3 py-1 text-sm text-gray-200 transition hover:bg-gray-800"
          >
            Live Demo
          </a>
        ) : null}
      </div>
    </article>
  );
}