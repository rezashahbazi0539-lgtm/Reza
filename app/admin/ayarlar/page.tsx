'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setSettings(data.settings || {}))
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async (key, value) => {
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/settings', { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) });
    setToast('Ayarlar kaydedildi.');
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { key: 'general', label: 'Genel' },
    { key: 'contact', label: 'İletişim' },
    { key: 'shipping', label: 'Kargo' },
    { key: 'social', label: 'Sosyal Medya' },
    { key: 'seo', label: 'SEO' },
  ];

  if (loading) return <div className="text-gray-400">Yükleniyor...</div>;

  const current = settings[activeTab] || {};

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Ayarlar</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === t.key ? 'border-brand-pink text-brand-pink' : 'border-transparent text-gray-500'}`}>{t.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6 max-w-2xl">
        <SettingsForm section={activeTab} data={current} onSave={saveSection} />
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}

function SettingsForm({ section, data, onSave }) {
  const [form, setForm] = useState(data);

  useEffect(() => { setForm(data); }, [data]);

  const fields = {
    general: [{ key: 'brandName', label: 'Marka Adı' }, { key: 'logo', label: 'Logo URL' }, { key: 'favicon', label: 'Favicon URL' }],
    contact: [{ key: 'phone', label: 'Telefon' }, { key: 'email', label: 'E-posta' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'address', label: 'Adres' }, { key: 'workingHours', label: 'Çalışma Saatleri' }],
    shipping: [{ key: 'freeShippingThreshold', label: 'Ücretsiz Kargo Eşiği (₺)' }, { key: 'standardShippingFee', label: 'Standart Kargo Ücreti (₺)' }, { key: 'expressShippingFee', label: 'Hızlı Kargo Ücreti (₺)' }, { key: 'estimatedDelivery', label: 'Tahmini Teslimat' }],
    social: [{ key: 'instagram', label: 'Instagram' }, { key: 'tiktok', label: 'TikTok' }, { key: 'pinterest', label: 'Pinterest' }, { key: 'youtube', label: 'YouTube' }],
    seo: [{ key: 'homeTitle', label: 'Ana Sayfa SEO Başlığı' }, { key: 'homeDescription', label: 'Ana Sayfa Meta Açıklama' }, { key: 'ogTitle', label: 'OG Başlık' }, { key: 'ogDescription', label: 'OG Açıklama' }],
  };

  return (
    <div className="space-y-4">
      {(fields[section] || []).map(f => (
        <div key={f.key}>
          <label className="text-sm font-medium block mb-1">{f.label}</label>
          <input value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})} className="input-field" />
        </div>
      ))}
      <button onClick={() => onSave(section, form)} className="flex items-center gap-2 btn-primary"><Save size={16} /> Kaydet</button>
    </div>
  );
}
