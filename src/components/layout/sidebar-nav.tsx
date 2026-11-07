"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import type { CompanyRole } from "@/types/database";

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ role }: { role: CompanyRole | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:sticky lg:top-0 lg:h-screen">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white lg:hidden">
        <p className="font-semibold">العقار</p>
        <button
          type="button"
          className="rounded-md p-2 outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-teal-400"
          aria-expanded={isOpen}
          aria-controls="app-sidebar-nav"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">القائمة</span>
        </button>
      </div>
      <nav
        id="app-sidebar-nav"
        aria-label="التنقل الرئيسي"
        className={`${isOpen ? "block" : "hidden"} h-full bg-slate-950 text-slate-100 lg:block`}
      >
        <div className="hidden border-b border-slate-800 px-5 py-6 lg:block">
          <p className="text-lg font-semibold text-white">العقار</p>
          <p className="mt-1 text-sm text-slate-400">تشغيل التطوير والتسويق</p>
        </div>
        <ul className="space-y-1 p-3">
          {[...NAV_ITEMS, ...(role === "manager" ? [{ href: "/team", label: "أعضاء الشركة" }] as const : [])].map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    active
                      ? "bg-teal-700 text-white"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
