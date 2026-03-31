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
    <div className="min-h-[calc(100vh-7rem)] rounded-2xl border border-slate-200/80 bg-slate-100 p-2 shadow-sm md:grid md:grid-cols-[240px_1fr] md:gap-3">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-300 [&_input]:bg-white [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400 [&_input]:outline-none [&_input]:transition [&_input]:focus:border-blue-500 [&_input]:focus:ring-2 [&_input]:focus:ring-blue-100 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-slate-300 [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:text-slate-900 [&_textarea]:placeholder:text-slate-400 [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:focus:border-blue-500 [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-blue-100 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-300 [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_select]:text-slate-900 [&_select]:outline-none [&_select]:transition [&_select]:focus:border-blue-500 [&_select]:focus:ring-2 [&_select]:focus:ring-blue-100 [&_label]:text-slate-700 [&_label]:font-medium [&_button]:transition-colors [&_button]:focus-visible:outline-none [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-blue-200">
        {children}
      </div>
    </div>
  );
}
