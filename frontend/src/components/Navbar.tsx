"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getSettings } from "@/lib/api";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hideOnAdmin = pathname.startsWith("/admin");
  const [showBlog, setShowBlog] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const settings = await getSettings();
        setShowBlog(settings.showBlog);
      } catch {
        setShowBlog(true);
      }
    };

    run();
  }, []);

  const visibleLinks = useMemo(
    () => links.filter((link) => (link.href === "/blog" ? showBlog : true)),
    [showBlog]
  );

  if (hideOnAdmin) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-blue-700">
          Portfolio CMS
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {visibleLinks.map((link) => {
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
