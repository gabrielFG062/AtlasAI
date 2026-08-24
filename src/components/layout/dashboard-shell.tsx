"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/dashboard/upgrade");

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 relative flex flex-col min-w-0">{children}</main>
    </div>
  );
}
