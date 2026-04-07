import { ReactNode } from "react";

type ResumeSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function ResumeSection({ title, children, className = "" }: ResumeSectionProps) {
  return (
    <section className={`mb-6 ${className}`.trim()}>
      <h2 className="mb-3 text-xl font-semibold text-white">{title}</h2>
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
        {children}
      </div>
    </section>
  );
}