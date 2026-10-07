'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../StoreContext';
import { formatPrice } from '@/lib/utils';

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.products || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => setSearchOpen(false)} />
      <div className="absolute top-0 left-0 right-0 bg-white p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="container-page">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ürün Ara</h2>
            <button onClick={() => setSearchOpen(false)} aria-label="Kapat"><X size={24} /></button>
          </div>
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ürün, kategori veya etiket ara..."
              className="w-full border border-gray-200 pl-12 pr-4 py-3 outline-none focus:border-brand-pink"
              autoFocus
            />
          </div>
          {loading && <p className="text-sm text-brand-muted mt-4">Aranıyor...</p>}
          {!loading && query && results.length === 0 && (
            <p className="text-sm text-brand-muted mt-4">Aradığınız ürünü bulamadık.</p>
          )}
          {results.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {results.map(p => (
                <Link key={p.id} href={`/urun/${p.slug}`} onClick={() => setSearchOpen(false)} className="group">
                  <div className="aspect-square bg-brand-pink-soft overflow-hidden mb-2">
                    <img src={p.images?.[0]?.url || ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-sm font-semibold">{formatPrice(p.discountPrice || p.price)}</p>
                </Link>
              ))}
            </div>
          )}
          {!query && (
            <div className="mt-6">
              <p className="text-sm text-brand-muted mb-3">Popüler aramalar:</p>
              <div className="flex flex-wrap gap-2">
                {['Jel Oje', 'Press On', 'Nail Art', 'Fırça', 'Bakım'].map(tag => (
                  <button key={tag} onClick={() => setQuery(tag)} className="px-3 py-1 text-sm border border-gray-200 hover:border-brand-pink hover:text-brand-pink transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
