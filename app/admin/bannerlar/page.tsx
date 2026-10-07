'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', ctaText: '', ctaLink: '', status: 'ACTIVE', displayOrder: '0' });
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/banners', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setBanners(data.banners || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/banners', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ title: '', subtitle: '', image: '', ctaText: '', ctaLink: '', status: 'ACTIVE', displayOrder: '0' });
    setToast('Banner oluşturuldu.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu bannerı silmek istediğinizden emin misiniz?')) return;
    const token = localStorage.getItem('citynail_token');
    await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setToast('Banner silindi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Bannerlar</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm rounded-md hover:bg-brand-pink"><Plus size={16} /> Yeni Banner</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-gray-400">Yükleniyor...</p> : banners.map(b => (
          <div key={b.id} className="bg-white rounded-lg border border-gray-100 p-4">
            {b.image && <img src={b.image} alt="" className="w-full h-32 object-cover rounded-md mb-3" />}
            <h3 className="font-medium">{b.title}</h3>
            {b.subtitle && <p className="text-sm text-gray-600">{b.subtitle}</p>}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
              <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <div className="flex justify-between items-center mb-4"><h2 className="font-semibold">Yeni Banner</h2><button onClick={() => setShowForm(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="text-sm font-medium block mb-1">Başlık *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required /></div>
              <div><label className="text-sm font-medium block mb-1">Alt Başlık</label><input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Görsel URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">CTA Metni</label><input value={form.ctaText} onChange={e => setForm({...form, ctaText: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">CTA Link</label><input value={form.ctaLink} onChange={e => setForm({...form, ctaLink: e.target.value})} className="input-field" /></div>
              <button type="submit" className="btn-primary w-full">Oluştur</button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
