'use client';

import { useState, useEffect } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import ProductCard from '@/components/storefront/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStock) params.set('inStock', 'true');

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setTotal(data.total || 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, sort, category, minPrice, maxPrice, inStock]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setInStock(false);
  };

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">Mağaza</h1>
          <p className="text-brand-muted text-sm">Premium nail art ürünleri koleksiyonu</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Kategori</h3>
                <div className="space-y-2">
                  <button onClick={() => setCategory('')} className={`text-sm block w-full text-left ${!category ? 'text-brand-pink font-medium' : 'text-brand-muted hover:text-brand-dark'}`}>Tüm Kategoriler</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setCategory(c.slug)} className={`text-sm block w-full text-left ${category === c.slug ? 'text-brand-pink font-medium' : 'text-brand-muted hover:text-brand-dark'}`}>{c.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Fiyat Aralığı</h3>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-field text-sm" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field text-sm" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Stok Durumu</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="accent-brand-pink" />
                  Sadece stokta olanlar
                </label>
              </div>
              <button onClick={clearFilters} className="text-sm text-brand-muted hover:text-brand-pink">Filtreleri Temizle</button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal size={16} /> Filtreler
              </button>
              <p className="text-sm text-brand-muted hidden lg:block">{total} ürün</p>
              <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-pink">
                <option value="recommended">Önerilen</option>
                <option value="newest">En Yeni</option>
                <option value="bestSelling">En Çok Satan</option>
                <option value="priceLow">Fiyat: Düşükten Yükseğe</option>
                <option value="priceHigh">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-square skeleton mb-3" />
                    <div className="h-4 skeleton mb-2" />
                    <div className="h-4 skeleton w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium mb-2">Henüz ürün bulunamadı.</p>
                <p className="text-sm text-brand-muted mb-6">Filtrelerinizi değiştirmeyi deneyin.</p>
                <button onClick={clearFilters} className="btn-primary">Filtreleri Temizle</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Filtreler</h3>
                <button onClick={() => setShowFilters(false)}><X size={24} /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Kategori</h3>
                  <div className="space-y-2">
                    <button onClick={() => { setCategory(''); }} className={`text-sm block ${!category ? 'text-brand-pink font-medium' : 'text-brand-muted'}`}>Tüm Kategoriler</button>
                    {categories.map(c => (
                      <button key={c.id} onClick={() => { setCategory(c.slug); }} className={`text-sm block ${category === c.slug ? 'text-brand-pink font-medium' : 'text-brand-muted'}`}>{c.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Fiyat Aralığı</h3>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-field text-sm" />
                    <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="accent-brand-pink" />
                    Sadece stokta olanlar
                  </label>
                </div>
                <button onClick={() => { clearFilters(); setShowFilters(false); }} className="btn-secondary w-full">Filtreleri Temizle</button>
                <button onClick={() => setShowFilters(false)} className="btn-primary w-full">Ürünleri Göster</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
