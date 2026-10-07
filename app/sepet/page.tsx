'use client';

import { useState } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { useStore } from '@/components/StoreContext';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, clearCart, coupon, setCoupon } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  const freeShippingThreshold = 750;
  const remaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const discount = coupon?.discount || 0;
  const shipping = coupon?.freeShipping ? 0 : (cartSubtotal >= freeShippingThreshold ? 0 : (cartSubtotal > 0 ? 49 : 0));
  const total = cartSubtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplying(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoupon(data.coupon);
        setCouponCode('');
      } else {
        setCouponError(data.error || 'Geçersiz kupon kodu.');
      }
    } catch {
      setCouponError('Bir hata oluştu.');
    }
    setApplying(false);
  };

  if (cart.length === 0) {
    return (
      <StorefrontLayout>
        <div className="container-page section-padding">
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-6" />
            <h1 className="text-2xl font-serif font-medium mb-2">Sepetiniz şu anda boş.</h1>
            <p className="text-brand-muted mb-8">Hemen alışverişe başlayın ve favori ürünlerinizi keşfedin.</p>
            <Link href="/magaza" className="btn-primary">ALIŞVERİŞE BAŞLA</Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <h1 className="text-3xl font-serif font-medium mb-8 text-center">Sepetiniz</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover bg-brand-pink-soft" />
                <div className="flex-1">
                  <Link href={`/urun/${item.slug}`} className="font-medium hover:text-brand-pink">{item.name}</Link>
                  <p className="text-sm text-brand-muted mb-2">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-50"><Minus size={14} /></button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-50"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-brand-pink"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-brand-muted hover:text-brand-pink">Sepeti Temizle</button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-pink-soft p-6">
              <h2 className="font-semibold mb-4">Sipariş Özeti</h2>

              {/* Free shipping progress */}
              <div className="mb-4">
                {remaining > 0 ? (
                  <p className="text-sm text-brand-dark mb-2">Ücretsiz kargoya <strong>{formatPrice(remaining)}</strong> kaldı.</p>
                ) : (
                  <p className="text-sm text-brand-pink font-medium mb-2">Harika! Ücretsiz kargo kazandınız.</p>
                )}
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink transition-all" style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }} />
                </div>
              </div>

              {/* Coupon */}
              {coupon ? (
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600"><Tag size={14} /> {coupon.code}</span>
                  <button onClick={() => setCoupon(null)} className="text-brand-muted hover:text-brand-pink">Kaldır</button>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm mb-2">İndirim kodunuz var mı?</p>
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Kupon kodu" className="input-field text-sm flex-1" />
                    <button onClick={applyCoupon} disabled={applying} className="btn-secondary text-xs whitespace-nowrap">{applying ? '...' : 'Uygula'}</button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>
              )}

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm"><span className="text-brand-muted">Ara Toplam</span><span>{formatPrice(cartSubtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>İndirim</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-brand-muted">Kargo</span><span>{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200"><span>Toplam</span><span>{formatPrice(total)}</span></div>
              </div>

              <Link href="/odeme" className="btn-primary w-full mt-6 text-center block">ÖDEMEYE GEÇ</Link>
              <Link href="/magaza" className="text-sm text-center block mt-3 text-brand-muted hover:text-brand-pink">Alışverişe Devam Et</Link>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
