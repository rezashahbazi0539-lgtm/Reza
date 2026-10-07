'use client';

import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

export default function AdminHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/homepage', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setSections(data.sections || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/homepage', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }),
    });
    load();
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/homepage', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editing, content: editContent }),
    });
    setEditing(null);
    setToast('Bölüm güncellendi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const startEdit = (section) => {
    setEditing(section.id);
    setEditContent(section.content || '{}');
  };

  const sectionLabels = {
    ANNOUNCEMENT: 'Duyuru Çubuğu', HERO: 'Hero Bölümü', CATEGORIES: 'Kategoriler',
    BEST_SELLERS: 'En Çok Satanlar', EDITORIAL: 'Editöryel Banner', INSTAGRAM: 'Instagram',
    NEWSLETTER: 'Newsletter', FOOTER: 'Footer',
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Ana Sayfa Yönetimi</h1>
      <p className="text-sm text-gray-500 mb-6">Ana sayfa bölümlerini düzenleyin, sıralarını değiştirin veya aktif/pasif yapın.</p>

      <div className="space-y-3">
        {loading ? <p className="text-gray-400">Yükleniyor...</p> : sections.map(s => (
          <div key={s.id} className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">#{s.displayOrder}</span>
              <div>
                <p className="font-medium">{sectionLabels[s.type] || s.type}</p>
                <p className="text-xs text-gray-500">{s.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(s)} className="text-sm text-brand-pink hover:underline">Düzenle</button>
              <button onClick={() => toggleStatus(s.id, s.status)} className={`text-xs px-2 py-1 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {s.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="font-semibold">Bölüm Düzenle</h2><button onClick={() => setEditing(null)}><X size={20} /></button></div>
            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={15} className="input-field font-mono text-xs" />
            <p className="text-xs text-gray-500 mt-1">JSON formatında içerik. Örn: {"{\"title\": \"Yeni Başlık\"}"}</p>
            <button onClick={saveEdit} className="flex items-center gap-2 btn-primary mt-4"><Save size={16} /> Kaydet</button>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
