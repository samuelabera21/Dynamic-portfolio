"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  label: string;
  value: number;
  icon: ReactNode;
  highlight?: boolean;
};

export default function StatCard({ href, label, value, icon, highlight = false }: Props) {
  const className = `group block rounded-xl border bg-white p-5 shadow-md transition-transform duration-200 hover:scale-[1.02] ${
    highlight
      ? "border-red-200 bg-red-50/70"
      : "border-slate-200"
  }`;

  const body = (
    <div className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-lg p-2 ${highlight ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"}`}>
          {icon}
        </div>
        {highlight && value > 0 ? (
          <span className="inline-flex animate-pulse rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Attention
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );

  if (!href) {
    return body;
  }

  return <Link href={href}>{body}</Link>;
}
