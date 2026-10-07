'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Star } from 'lucide-react';

export default function ProductForm({ productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', sku: '', categoryId: '', shortDescription: '', description: '',
    price: '', discountPrice: '', cost: '', stock: '', lowStockThreshold: '10',
    brand: '', tags: '', videoUrl: '', ingredients: '', usageInstructions: '', features: '',
    seoTitle: '', metaDescription: '', metaKeywords: '',
    isBestSeller: false, isNew: false, isFeatured: false, isOnSale: false,
    status: 'DRAFT',
  });
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
    if (productId) {
      const token = localStorage.getItem('citynail_token');
      fetch(`/api/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.product) {
            const p = data.product;
            setForm({
              name: p.name, slug: p.slug, sku: p.sku, categoryId: p.categoryId,
              shortDescription: p.shortDescription || '', description: p.description || '',
              price: String(p.price), discountPrice: p.discountPrice ? String(p.discountPrice) : '',
              cost: p.cost ? String(p.cost) : '', stock: String(p.stock), lowStockThreshold: String(p.lowStockThreshold),
              brand: p.brand || '', tags: p.tags || '', videoUrl: p.videoUrl || '',
              ingredients: p.ingredients || '', usageInstructions: p.usageInstructions || '', features: p.features || '',
              seoTitle: p.seoTitle || '', metaDescription: p.metaDescription || '', metaKeywords: p.metaKeywords || '',
              isBestSeller: p.isBestSeller, isNew: p.isNew, isFeatured: p.isFeatured, isOnSale: p.isOnSale,
              status: p.status,
            });
            setImages(p.images?.map(i => i.url) || []);
          }
        });
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('citynail_token');
    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
    const method = productId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast(productId ? 'Ürün başarıyla güncellendi.' : 'Ürün başarıyla oluşturuldu.');
        setTimeout(() => router.push('/admin/urunler'), 1500);
      } else {
        setToast(data.error || 'Bir hata oluştu.');
      }
    } catch {
      setToast('Bir hata oluştu.');
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const addImage = () => {
    if (imageUrl) { setImages([...images, imageUrl]); setImageUrl(''); }
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const moveImage = (idx, dir) => {
    const newImages = [...images];
    const swap = idx + dir;
    if (swap < 0 || swap >= newImages.length) return;
    [newImages[idx], newImages[swap]] = [newImages[swap], newImages[idx]];
    setImages(newImages);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/urunler" className="text-gray-500 hover:text-brand-pink"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-semibold text-gray-800">{productId ? 'Ürün Düzenle' : 'Yeni Ürün'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic info */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium block mb-1">Ürün Adı *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Slug</label>
              <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="input-field" placeholder="otomatik-olusturulur" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">SKU *</label>
              <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Kategori *</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="input-field" required>
                <option value="">Seçin</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Marka</label>
              <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium block mb-1">Kısa Açıklama</label>
              <input value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium block mb-1">Detaylı Açıklama</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium block mb-1">Etiketler (virgülle ayırın)</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="input-field" placeholder="jel oje, pembe, premium" />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Fiyat ve Stok</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Fiyat (₺) *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">İndirimli Fiyat (₺)</label>
              <input type="number" step="0.01" value={form.discountPrice} onChange={e => setForm({...form, discountPrice: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Maliyet (₺)</label>
              <input type="number" step="0.01" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Stok</label>
              <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Düşük Stok Limiti</label>
              <input type="number" value={form.lowStockThreshold} onChange={e => setForm({...form, lowStockThreshold: e.target.value})} className="input-field" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Ürün Görselleri</h2>
          <div className="flex gap-2 mb-4">
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Görsel URL'si" className="input-field flex-1" />
            <button type="button" onClick={addImage} className="btn-secondary text-sm whitespace-nowrap">Ekle</button>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-full aspect-square object-cover rounded-md" />
                  {i === 0 && <span className="absolute top-1 left-1 bg-brand-pink text-white text-xs px-1.5 py-0.5 rounded">Ana</span>}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button type="button" onClick={() => moveImage(i, -1)} className="text-white text-xs">←</button>
                    <button type="button" onClick={() => removeImage(i)} className="text-white"><X size={16} /></button>
                    <button type="button" onClick={() => moveImage(i, 1)} className="text-white text-xs">→</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Ürün Detayları</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">İçindekiler</label>
              <textarea value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} rows={3} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Kullanım Talimatları</label>
              <textarea value={form.usageInstructions} onChange={e => setForm({...form, usageInstructions: e.target.value})} rows={3} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Ürün Özellikleri (virgülle ayırın)</label>
              <input value={form.features} onChange={e => setForm({...form, features: e.target.value})} className="input-field" placeholder="Uzun ömürlü, Vegan, Hipoalerjenik" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Video URL</label>
              <input value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="input-field" />
            </div>
          </div>
        </div>

        {/* Badges & Status */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Etiketler ve Durum</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { key: 'isBestSeller', label: 'En Çok Satan' },
              { key: 'isNew', label: 'Yeni Ürün' },
              { key: 'isFeatured', label: 'Öne Çıkan' },
              { key: 'isOnSale', label: 'İndirimli' },
            ].map(b => (
              <label key={b.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form[b.key]} onChange={e => setForm({...form, [b.key]: e.target.checked})} className="accent-brand-pink" />
                {b.label}
              </label>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Durum</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field max-w-xs">
              <option value="DRAFT">Taslak</option>
              <option value="PUBLISHED">Yayında</option>
              <option value="INACTIVE">Pasif</option>
            </select>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">SEO Başlığı</label>
              <input value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Meta Açıklama</label>
              <textarea value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})} rows={2} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Meta Keywords</label>
              <input value={form.metaKeywords} onChange={e => setForm({...form, metaKeywords: e.target.value})} className="input-field" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-brand-dark text-white px-6 py-2.5 text-sm rounded-md hover:bg-brand-pink disabled:opacity-50">
            <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <Link href="/admin/urunler" className="px-6 py-2.5 text-sm border border-gray-200 rounded-md">İptal</Link>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
