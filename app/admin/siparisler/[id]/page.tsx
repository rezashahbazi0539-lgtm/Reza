'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatPrice, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const statusLabels = { NEW: 'Yeni', CONFIRMED: 'Onaylandı', PREPARING: 'Hazırlanıyor', SHIPPED: 'Kargoya Verildi', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal Edildi', REFUNDED: 'İade Edildi' };
const timelineSteps = [
  { key: 'NEW', label: 'Sipariş oluşturuldu' },
  { key: 'CONFIRMED', label: 'Ödeme alındı' },
  { key: 'PREPARING', label: 'Hazırlanıyor' },
  { key: 'SHIPPED', label: 'Kargoya verildi' },
  { key: 'DELIVERED', label: 'Teslim edildi' },
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    fetch(`/api/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setOrder(data.order);
        setNewStatus(data.order?.status || '');
        setNotes(data.order?.notes || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateOrder = async () => {
    const token = localStorage.getItem('citynail_token');
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, notes }),
    });
    if (res.ok) {
      setToast('Sipariş durumu güncellendi.');
      setTimeout(() => setToast(null), 3000);
      const data = await res.json();
      setOrder(data.order);
    }
  };

  if (loading) return <div className="text-gray-400">Yükleniyor...</div>;
  if (!order) return <div className="text-red-500">Sipariş bulunamadı.</div>;

  const timelineOrder = ['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'];
  const currentStepIdx = timelineOrder.indexOf(order.status);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/siparisler" className="text-gray-500 hover:text-brand-pink"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-semibold text-gray-800">Sipariş {order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Ürünler</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.product?.images?.[0]?.url} alt="" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Ara Toplam</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Kargo</span><span>{order.shipping === 0 ? 'Ücretsiz' : formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100"><span>Toplam</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Sipariş Geçmişi</h2>
            <div className="space-y-4">
              {timelineSteps.map((step, i) => (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i <= currentStepIdx ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i <= currentStepIdx ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${i <= currentStepIdx ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Müşteri</h2>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-sm text-gray-500">{order.customerEmail}</p>
            <p className="text-sm text-gray-500">{order.customerPhone}</p>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Teslimat Adresi</h2>
            <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          </div>

          {/* Status update */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Durum Güncelle</h2>
            <div className="space-y-3">
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="İç not..." rows={3} className="input-field" />
              <button onClick={updateOrder} className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm rounded-md hover:bg-brand-pink w-full justify-center">
                <Save size={16} /> Güncelle
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
