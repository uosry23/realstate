import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AccountBar } from "@/components/auth/account-bar";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";
import "./globals.css";

export const metadata: Metadata = {
  title: "العقار",
  description: "نظام عربي لإدارة المشاريع والوحدات والعملاء والوسطاء وطلبات الخدمة",
};

async function RoleAwareAppShell({ children }: { children: React.ReactNode }) {
  const membership = await getCurrentMembership();
  return (
    <AppShell role={membership?.role ?? null} accountBar={<AccountBar />}>
      {children}
    </AppShell>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
    >
      <body className="min-h-full font-sans">
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-600">
              جاري تجهيز الواجهة...
            </div>
          }
        >
          <RoleAwareAppShell>{children}</RoleAwareAppShell>
        </Suspense>
      </body>
    </html>
  );
}
