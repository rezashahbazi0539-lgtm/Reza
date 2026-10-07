'use client';

import { useState, useEffect } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { useStore } from '@/components/StoreContext';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Heart, MapPin, User, Lock, Bell, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, logout, wishlist, moveToCart, toggleWishlist } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/giris'); return; }
    const token = localStorage.getItem('citynail_token');
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  const tabs = [
    { key: 'overview', label: 'Genel Bakış', icon: User },
    { key: 'orders', label: 'Siparişlerim', icon: Package },
    { key: 'wishlist', label: 'Favorilerim', icon: Heart },
    { key: 'addresses', label: 'Adreslerim', icon: MapPin },
    { key: 'profile', label: 'Bilgilerim', icon: User },
    { key: 'password', label: 'Şifre', icon: Lock },
    { key: 'notifications', label: 'Bildirimler', icon: Bell },
  ];

  const orderStatusLabels = {
    NEW: 'Yeni', CONFIRMED: 'Onaylandı', PREPARING: 'Hazırlanıyor',
    SHIPPED: 'Kargoya Verildi', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal Edildi', REFUNDED: 'İade Edildi',
  };

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-brand-pink-soft p-6 mb-4">
              <p className="text-sm text-brand-muted">Hoş geldiniz,</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 w-full px-4 py-3 text-sm text-left transition-colors ${tab === t.key ? 'bg-brand-dark text-white' : 'hover:bg-brand-pink-soft'}`}>
                  <t.icon size={16} /> {t.label}
                </button>
              ))}
              <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-50">
                <LogOut size={16} /> Çıkış Yap
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'overview' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Genel Bakış</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="card p-4">
                    <p className="text-sm text-brand-muted">Toplam Sipariş</p>
                    <p className="text-2xl font-semibold">{orders.length}</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-sm text-brand-muted">Favori Ürün</p>
                    <p className="text-2xl font-semibold">{wishlist.length}</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-sm text-brand-muted">Toplam Harcama</p>
                    <p className="text-2xl font-semibold">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</p>
                  </div>
                </div>
                <h2 className="font-semibold mb-4">Son Siparişler</h2>
                {loading ? <p className="text-brand-muted">Yükleniyor...</p> : orders.length === 0 ? (
                  <p className="text-brand-muted">Henüz bir siparişiniz bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="card p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{o.orderNumber}</p>
                          <p className="text-xs text-brand-muted">{formatDate(o.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatPrice(o.total)}</p>
                          <span className="text-xs text-brand-muted">{orderStatusLabels[o.status]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Siparişlerim</h1>
                {loading ? <p className="text-brand-muted">Yükleniyor...</p> : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-brand-muted mb-4">Henüz bir siparişiniz bulunmuyor.</p>
                    <Link href="/magaza" className="btn-primary">ALIŞVERİŞE BAŞLA</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o.id} className="card p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">{o.orderNumber}</p>
                            <p className="text-xs text-brand-muted">{formatDate(o.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-brand-pink-soft text-brand-pink'}`}>{orderStatusLabels[o.status]}</span>
                            <p className="text-sm font-semibold mt-1">{formatPrice(o.total)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {o.items?.map(item => (
                            <img key={item.id} src={item.product?.images?.[0]?.url} alt="" className="w-12 h-12 object-cover bg-brand-pink-soft" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'wishlist' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Favorilerim</h1>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-brand-muted mb-4">Favorileriniz burada görünecek.</p>
                    <Link href="/magaza" className="btn-primary">ALIŞVERİŞE BAŞLA</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map(item => (
                      <div key={item.id} className="card p-4 flex gap-3">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover bg-brand-pink-soft" />
                        <div className="flex-1">
                          <Link href={`/urun/${item.slug}`} className="text-sm font-medium hover:text-brand-pink">{item.name}</Link>
                          <p className="text-sm font-semibold mb-2">{formatPrice(item.price)}</p>
                          <div className="flex gap-2">
                            <button onClick={() => moveToCart(item)} className="btn-primary text-xs px-3 py-1.5">Sepete Taşı</button>
                            <button onClick={() => toggleWishlist(item)} className="text-xs text-brand-muted hover:text-brand-pink">Çıkar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'addresses' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Adreslerim</h1>
                <div className="card p-6 text-center">
                  <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-brand-muted mb-4">Henüz kayıtlı adresiniz yok.</p>
                  <button className="btn-primary">Yeni Adres Ekle</button>
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Bilgilerim</h1>
                <div className="card p-6 space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium block mb-1">Ad Soyad</label>
                    <input defaultValue={user.name} className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">E-posta</label>
                    <input defaultValue={user.email} className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Telefon</label>
                    <input defaultValue={user.phone || ''} className="input-field" />
                  </div>
                  <button className="btn-primary">Kaydet</button>
                </div>
              </div>
            )}

            {tab === 'password' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Şifre Değiştir</h1>
                <div className="card p-6 space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium block mb-1">Mevcut Şifre</label>
                    <input type="password" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Yeni Şifre</label>
                    <input type="password" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Yeni Şifre Tekrar</label>
                    <input type="password" className="input-field" />
                  </div>
                  <button className="btn-primary">Şifreyi Güncelle</button>
                </div>
              </div>
            )}

            {tab === 'notifications' && (
              <div>
                <h1 className="text-2xl font-serif font-medium mb-6">Bildirimler</h1>
                <div className="card p-6">
                  <p className="text-brand-muted">Henüz bildirim yok.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
