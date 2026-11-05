"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { CompanyRole } from "@/types/database";

type AppShellProps = {
  children: ReactNode;
  accountBar: ReactNode;
  role: CompanyRole | null;
};

export function AppShell({ children, accountBar, role }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname);

  return (
    <div className="min-h-full bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900"
      >
        تخطي إلى المحتوى
      </a>
      <div className={isAuthPage ? "" : "lg:grid lg:grid-cols-[16rem_1fr]"}>
        {isAuthPage ? null : <SidebarNav role={role} />}
        <main id="main-content" className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
          {isAuthPage ? children : <>{accountBar}{children}</>}
        </main>
      </div>
    </div>
  );
}
