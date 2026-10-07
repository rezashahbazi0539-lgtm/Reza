'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', seoTitle: '', seoDescription: '', displayOrder: '0', status: 'ACTIVE' });
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('citynail_token');
    const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false); setEditId(null);
    setForm({ name: '', description: '', image: '', seoTitle: '', seoDescription: '', displayOrder: '0', status: 'ACTIVE' });
    setToast(editId ? 'Kategori güncellendi.' : 'Kategori oluşturuldu.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', image: cat.image || '', seoTitle: cat.seoTitle || '', seoDescription: cat.seoDescription || '', displayOrder: String(cat.displayOrder), status: cat.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    const token = localStorage.getItem('citynail_token');
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setToast('Kategori silindi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Kategoriler</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', description: '', image: '', seoTitle: '', seoDescription: '', displayOrder: '0', status: 'ACTIVE' }); setShowForm(true); }} className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm rounded-md hover:bg-brand-pink">
          <Plus size={16} /> Yeni Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Yükleniyor...</p> : categories.map(c => (
          <div key={c.id} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <img src={c.image} alt="" className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-gray-500">{c._count?.products || 0} ürün</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(c)} className="text-gray-500 hover:text-brand-pink"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(c.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">{editId ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="text-sm font-medium block mb-1">Ad *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required /></div>
              <div><label className="text-sm font-medium block mb-1">Açıklama</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Görsel URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Sıra</label><input type="number" value={form.displayOrder} onChange={e => setForm({...form, displayOrder: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Durum</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field"><option value="ACTIVE">Aktif</option><option value="INACTIVE">Pasif</option></select></div>
              <button type="submit" className="btn-primary w-full">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
