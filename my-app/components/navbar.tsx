'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { CoffeeCupIcon } from '@/components/icons';

const baseLinks = [
  { href: '/categories', label: 'Categories' },
  { href: '/books', label: 'Books' },
  { href: '/purchases', label: 'My Purchases' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const links = isAdmin
    ? [...baseLinks, { href: '/admin/purchases', label: 'All Purchases' }]
    : baseLinks;

  // Keep-alive ping to prevent Render backend from sleeping and wiping the SQLite database
  useEffect(() => {
    const interval = setInterval(() => {
      api.books.findAll().catch(() => {});
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <CoffeeCupIcon className="w-6 h-6" />
            Coffee Shop
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors ${
                  pathname === l.href ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/70">{user?.name || user?.email}</span>
                <button onClick={logout} className="btn-secondary text-sm">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:bg-background"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur">
          <div className="space-y-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm ${
                  pathname === l.href ? 'bg-background text-primary font-semibold' : 'text-foreground/70 hover:bg-background'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-secondary text-sm w-full">
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary text-sm block text-center">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
