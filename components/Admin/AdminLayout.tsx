"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

// Map routes to page titles
const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/users": "Users",
  "/admin/categories": "Categories",
  "/admin/settings": "Settings",
  "/admin/orders": "Orders",
};

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function AdminLayout({ children }: React.PropsWithChildren) {
  const { isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const mounted = useMounted();
  const isMobile = useIsMobile();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  /* ---------- AUTH REDIRECT ---------- */
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  /* ---------- LOAD SIDEBAR STATE ---------- */
  useEffect(() => {
    if (!mounted) return;

    if (isMobile) {
      setIsSidebarCollapsed(true);
      return;
    }

    const stored = localStorage.getItem("admin_sidebar_collapsed");
    setIsSidebarCollapsed(stored === "true");
  }, [mounted, isMobile]);

  /* ---------- PERSIST SIDEBAR STATE ---------- */
  useEffect(() => {
    if (!mounted || isMobile) return;

    localStorage.setItem(
      "admin_sidebar_collapsed",
      String(isSidebarCollapsed)
    );
  }, [mounted, isMobile, isSidebarCollapsed]);

  /* ---------- SAFE RENDER GUARD ---------- */
  if (!mounted) return null;

  const pageTitle = pageTitles[pathname || "/admin"] || "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isCollapsed={isMobile ? true : isSidebarCollapsed}
        onToggle={() => {
          if (!isMobile) {
            setIsSidebarCollapsed((prev) => !prev);
          }
        }}
      />

      <div
        className={cn(
          "transition-all duration-300",
          isMobile || isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <AdminHeader title={pageTitle} />

        <main className="p-6">{children}</main>

        <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AdminPanel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
