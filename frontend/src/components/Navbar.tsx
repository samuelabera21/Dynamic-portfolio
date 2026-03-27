"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hideOnAdmin = pathname.startsWith("/admin");

  if (hideOnAdmin) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-blue-700">
          Portfolio CMS
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "text-blue-600" : "transition-colors hover:text-blue-600"}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
