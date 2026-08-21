'use client';

import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

export default function HomePage() {
  return (
    <PageShell>
      <section className="text-center py-16 sm:py-24">
        <h1 className="text-5xl sm:text-6xl font-bold text-primary mb-4">☕ Coffee Shop</h1>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          Discover books in a cozy coffee shop setting. Browse public reads or purchase books to enjoy with your favorite coffee.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/books" className="btn-primary px-6 py-3 text-base">Browse Books</Link>
          <Link href="/categories" className="btn-secondary px-6 py-3 text-base">Categories</Link>
        </div>
      </section>

      <section className="py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FeatureCard title="Public Reads" description="Free books available for everyone to read online." />
        <FeatureCard title="Buy Books" description="Purchase books by cash and enjoy them offline." />
        <FeatureCard title="Curated Categories" description="Browse by categories and find your next great read." />
      </section>
    </PageShell>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-6 text-center">
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-sm text-foreground/70">{description}</p>
    </div>
  );
}
