"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Feature Flags", icon: "settings" as const },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/messages", label: "Messages" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white p-4">
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-blue-700">Admin Panel</h2>

      <nav className="mt-6 flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.icon === "settings" ? (
                <span className="mr-2 inline-flex align-middle">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3v3" />
                    <path d="M12 18v3" />
                    <path d="m4.9 4.9 2.1 2.1" />
                    <path d="m17 17 2.1 2.1" />
                    <path d="M3 12h3" />
                    <path d="M18 12h3" />
                    <path d="m4.9 19.1 2.1-2.1" />
                    <path d="m17 7 2.1-2.1" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
              ) : null}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          clearToken();
          router.push("/admin/login");
        }}
        className="mt-auto rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
      >
        Logout
      </button>
    </aside>
  );
}
