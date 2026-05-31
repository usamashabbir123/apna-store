'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/theme', label: 'Theme' },
  { href: '/admin/footer', label: 'Footer' },
  { href: '/admin/pages', label: 'Pages' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return children;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-stone-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-64 bg-white border-r border-stone-200 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-stone-100">
          <Link href="/admin" className="text-xl font-light tracking-[0.15em] uppercase text-stone-900">
            Apna
          </Link>
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-500 hover:text-red-600 transition-colors w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-light tracking-[0.15em] uppercase">Apna Admin</Link>
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="text-xs text-stone-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-auto lg:pt-0 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
