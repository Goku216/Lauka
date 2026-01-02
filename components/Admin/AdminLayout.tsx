"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Map routes to page titles
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/users': 'Users',
  '/admin/categories': 'Categories',
  '/admin/settings': 'Settings',
};

export function AdminLayout({ children }: React.PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  const pageTitle = pageTitles[pathname || '/admin'] || 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={cn(
          'transition-all duration-300',
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <AdminHeader title={pageTitle} />

        <main className="p-6">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AdminPanel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
