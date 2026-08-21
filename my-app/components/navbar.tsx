'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const links = [
  { href: '/categories', label: 'Categories' },
  { href: '/books', label: 'Books' },
  { href: '/purchases', label: 'My Purchases' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          ☕ Coffee Shop
        </Link>

        <div className="hidden md:flex gap-6 text-sm items-center">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-primary transition-colors ${
                pathname === l.href ? 'text-primary font-semibold' : 'text-foreground/70'
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
          className="md:hidden p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm ${
                pathname === l.href ? 'text-primary font-semibold' : 'text-foreground/70'
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
      )}
    </nav>
  );
}
