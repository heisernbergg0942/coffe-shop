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
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<'public' | 'sell'>('public');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', author: '', description: '', visibility: 'public' as 'public' | 'sell', price: '', categoryId: '' });

  const isAdmin = user?.role === 'admin';

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

  function openCreate() {
    setEditingBook(null);
    setError('');
    setForm({ title: '', author: '', description: '', visibility: tab, price: '', categoryId: categories[0]?.id || '' });
    setShowForm(true);
  }

  function openEdit(book: Book) {
    setEditingBook(book);
    setError('');
    setForm({
      title: book.title,
      author: book.author || '',
      description: book.description || '',
      visibility: book.visibility,
      price: book.price?.toString() || '',
      categoryId: book.category?.id || categories[0]?.id || '',
    });
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.categoryId) {
      setError('Please select a category.');
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        title: form.title,
        author: form.author,
        description: form.description,
        visibility: form.visibility,
        categoryId: form.categoryId,
      };
      if (form.visibility === 'sell') {
        payload.price = parseFloat(form.price);
      }
      if (editingBook) {
        await api.books.update(editingBook.id, payload);
      } else {
        await api.books.create(payload);
      }
      setShowForm(false);
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save book');
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(bookId: string) {
    if (!confirm('Delete this book?')) return;
    setError('');
    try {
      await api.books.remove(bookId);
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete book');
    }
  }

  function handleBuy(bookId: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    router.push(`/checkout?bookId=${bookId}`);
  }

  return (
    <PageShell title="Books" subtitle={`${tab === 'public' ? 'Free public reads' : 'Books available for purchase'}`}>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
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
        {isAdmin && (
          <button onClick={openCreate} className="btn-primary ml-auto">Add Book</button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-border w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editingBook ? 'Edit Book' : 'Add Book'}</h3>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input className="input-field" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Visibility</label>
                  <select className="input-field" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as 'public' | 'sell' })}>
                    <option value="public">Public</option>
                    <option value="sell">For Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {form.visibility === 'sell' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input className="input-field" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <div className="flex gap-2">
                  {book.visibility === 'sell' && (
                    <button onClick={() => handleBuy(book.id)} className="btn-primary text-sm">Buy Now</button>
                  )}
                  {isAdmin && (
                    <>
                      <button onClick={() => openEdit(book)} className="text-sm px-3 py-1.5 rounded border border-border hover:bg-background transition-colors">Edit</button>
                      <button onClick={() => remove(book.id)} className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-700 hover:bg-red-50 transition-colors">Delete</button>
                    </>
                  )}
                </div>
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
