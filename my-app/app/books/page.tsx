'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { PageShell } from '@/components/page-shell';

type Book = { id: string; title: string; author?: string; description?: string; price?: number; visibility: 'public' | 'sell'; category?: { id: string; name: string } };
type Category = { id: string; name: string };

export default function BooksPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<'public' | 'sell'>('public');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories.findAll().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [tab, categoryId]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.books.findAll({ visibility: tab, categoryId: categoryId || undefined });
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleBuy(bookId: string) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/checkout?bookId=${bookId}`);
  }

  return (
    <PageShell title="Books" subtitle={`${tab === 'public' ? 'Free public reads' : 'Books available for purchase'}`}>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <TabButton active={tab === 'public'} onClick={() => setTab('public')}>Public</TabButton>
          <TabButton active={tab === 'sell'} onClick={() => setTab('sell')}>For Sale</TabButton>
        </div>
        <select
          className="input-field w-auto"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <BookGridSkeleton />
      ) : books.length === 0 ? (
        <EmptyState message={`No ${tab} books found.`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="card p-5 flex flex-col">
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-snug">{book.title}</h3>
                <p className="text-sm text-foreground/70 mt-1">{book.author || 'Unknown author'}</p>
                {book.category && (
                  <span className="mt-2 inline-block text-xs px-2 py-1 rounded bg-secondary/20 text-primary">
                    {book.category.name}
                  </span>
                )}
                <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{book.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {book.visibility === 'sell' ? `$${Number(book.price).toFixed(2)}` : 'Free'}
                </span>
                {book.visibility === 'sell' && (
                  <button onClick={() => handleBuy(book.id)} className="btn-primary text-sm">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm transition-colors ${
        active ? 'bg-primary text-white' : 'bg-white hover:bg-background text-foreground/70'
      }`}
    >
      {children}
    </button>
  );
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="h-5 bg-border rounded w-3/4 mb-3" />
          <div className="h-4 bg-border rounded w-1/2 mb-4" />
          <div className="h-3 bg-border rounded w-full mb-2" />
          <div className="h-3 bg-border rounded w-full mb-2" />
          <div className="h-3 bg-border rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-foreground/70">{message}</p>
    </div>
  );
}
