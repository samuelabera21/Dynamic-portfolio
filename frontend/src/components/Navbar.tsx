"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getSettings } from "@/lib/api";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hideOnAdmin = pathname.startsWith("/admin");
  const [showBlog, setShowBlog] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (hideOnAdmin) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#111827]/96 backdrop-blur">
      <nav className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Home" className="inline-flex items-center">
          <Image
            src="/favicon.png"
            alt="Samuel Abera logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-full object-cover"
          />
        </Link>

        <div className="hidden items-center gap-6 text-base font-semibold text-slate-300 md:flex">
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

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-slate-200 transition hover:bg-white/10 md:hidden"
        >
          <span className="text-xl leading-none">{mobileOpen ? "\u2715" : "\u2630"}</span>
        </button>
      </nav>

      <div
        className={`md:hidden ${
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden border-t border-white/10 bg-[#0f172a]/95 transition-all duration-300`}
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 py-2 sm:px-6">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-3 text-base font-semibold transition ${
                  isActive
                    ? "bg-blue-500/10 text-blue-300"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
