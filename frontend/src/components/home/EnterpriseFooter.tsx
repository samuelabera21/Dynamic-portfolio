import Link from "next/link";

export default function EnterpriseFooter() {
  return (
    <footer className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">Portfolio Platform</h3>
          <p className="mt-2 text-sm text-slate-300">System-focused fullstack portfolio with production workflow architecture.</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Navigation</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Reach Out</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>Email: contact@portfolio.local</p>
            <p>LinkedIn: Professional Network</p>
            <p>GitHub: Engineering Workspace</p>
          </div>
        </div>
      </div>

      <p className="mt-8 border-t border-white/10 pt-4 text-xs text-slate-400">© {new Date().getFullYear()} Portfolio Platform. All rights reserved.</p>
    </footer>
  );
}
