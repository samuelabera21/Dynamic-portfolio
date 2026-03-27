"use client";

import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { getToken } from "@/lib/auth";

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    const token = getToken();
    if (!token) router.replace("/admin/login");
  }, [isLogin, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] rounded-2xl border border-slate-200 bg-slate-100/70 p-2 shadow-sm md:grid md:grid-cols-[220px_1fr] md:gap-2">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">{children}</div>
    </div>
  );
}
