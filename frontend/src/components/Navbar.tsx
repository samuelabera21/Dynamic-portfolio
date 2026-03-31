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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#111827]/96 backdrop-blur">
      <nav className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Samuel abera
        </Link>

        <div className="flex items-center gap-6 text-base font-semibold text-slate-300">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-md bg-blue-500/10 px-2 py-1 text-blue-300"
                    : "transition-colors hover:text-white"
                }
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
