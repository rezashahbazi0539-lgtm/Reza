'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

const statusLabels = { DRAFT: 'Taslak', SCHEDULED: 'Zamanlandı', ACTIVE: 'Aktif', EXPIRED: 'Süresi Doldu' };
const statusColors = { DRAFT: 'bg-gray-100 text-gray-600', SCHEDULED: 'bg-blue-100 text-blue-700', ACTIVE: 'bg-green-100 text-green-700', EXPIRED: 'bg-red-100 text-red-700' };

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/campaigns', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCampaigns(data.campaigns || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Kampanyalar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-gray-400">Yükleniyor...</p> : campaigns.map(c => (
          <div key={c.id} className="bg-white rounded-lg border border-gray-100 p-4">
            {c.image && <img src={c.image} alt="" className="w-full h-32 object-cover rounded-md mb-3" />}
            <h3 className="font-medium">{c.name}</h3>
            {c.headline && <p className="text-sm text-gray-600 mt-1">{c.headline}</p>}
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
              <span className="text-xs text-gray-500">{formatDate(c.startDate)} - {c.endDate ? formatDate(c.endDate) : 'Süresiz'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
