'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const statusLabels = { PUBLISHED: 'Yayında', DRAFT: 'Taslak', SCHEDULED: 'Zamanlandı' };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'Nail Art', coverImage: '', status: 'DRAFT' });
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/blog', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/blog', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ title: '', excerpt: '', content: '', category: 'Nail Art', coverImage: '', status: 'DRAFT' });
    setToast('Blog yazısı oluşturuldu.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    const token = localStorage.getItem('citynail_token');
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setToast('Blog yazısı silindi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Blog</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm rounded-md hover:bg-brand-pink"><Plus size={16} /> Yeni Yazı</button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 border-b border-gray-100">
            <th className="px-4 py-3 font-medium">Başlık</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Tarih</th>
            <th className="px-4 py-3 font-medium text-center">Durum</th>
            <th className="px-4 py-3 font-medium text-center">İşlem</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="text-center py-8 text-gray-400">Yükleniyor...</td></tr> : posts.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(p.publishDate)}</td>
                <td className="px-4 py-3 text-center"><span className="text-xs px-2 py-1 rounded-full bg-gray-100">{statusLabels[p.status]}</span></td>
                <td className="px-4 py-3 text-center"><button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="font-semibold">Yeni Blog Yazısı</h2><button onClick={() => setShowForm(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="text-sm font-medium block mb-1">Başlık *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required /></div>
              <div><label className="text-sm font-medium block mb-1">Kategori</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field"><option>Nail Art</option><option>Bakım</option><option>Trendler</option><option>Eğitim</option><option>İpuçları</option><option>Yeni Ürünler</option></select></div>
              <div><label className="text-sm font-medium block mb-1">Özet</label><input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Kapak Görseli URL</label><input value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">İçerik</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Durum</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field"><option value="DRAFT">Taslak</option><option value="PUBLISHED">Yayında</option></select></div>
              <button type="submit" className="btn-primary w-full">Oluştur</button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
