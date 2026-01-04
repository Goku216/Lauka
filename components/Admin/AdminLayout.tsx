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
  '/admin/orders': 'Orders'
};

export function AdminLayout({ children }: React.PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  // Don't access localStorage during SSR — initialize to a safe default
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize collapse state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_sidebar_collapsed');
      if (stored !== null) setIsSidebarCollapsed(stored === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist collapse state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('admin_sidebar_collapsed', String(isSidebarCollapsed));
    } catch (e) {
      // ignore
    }
  }, [isSidebarCollapsed]);

  // Redirect to landing only if explicitly not authenticated (not during loading state)
  useEffect(() => {
    if (isAuthenticated === false) router.push('/');
  }, [isAuthenticated, router]);

  const pageTitle = pageTitles[pathname || '/admin'] || 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(prev => !prev)}
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
