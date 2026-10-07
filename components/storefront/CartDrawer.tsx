'use client';

import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartSubtotal, clearCart } = useStore();

  if (!cartOpen) return null;

  const freeShippingThreshold = 750;
  const remaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag size={20} /> Sepetim ({cart.length})
          </h2>
          <button onClick={() => setCartOpen(false)} aria-label="Kapat"><X size={22} /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">Sepetiniz şu anda boş.</p>
            <p className="text-sm text-brand-muted mb-6">Hemen alışverişe başlayın ve favori ürünlerinizi keşfedin.</p>
            <Link href="/magaza" onClick={() => setCartOpen(false)} className="btn-primary">ALIŞVERİŞE BAŞLA</Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="p-4 bg-brand-pink-soft">
              {remaining > 0 ? (
                <p className="text-sm text-brand-dark mb-2">Ücretsiz kargoya <strong>{formatPrice(remaining)}</strong> kaldı.</p>
              ) : (
                <p className="text-sm text-brand-pink font-medium mb-2">Harika! Ücretsiz kargo kazandınız.</p>
              )}
              <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-brand-pink transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover bg-brand-pink-soft" />
                  <div className="flex-1">
                    <Link href={`/urun/${item.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-medium hover:text-brand-pink block mb-1">{item.name}</Link>
                    <p className="text-sm font-semibold mb-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-50" aria-label="Azalt"><Minus size={14} /></button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-50" aria-label="Artır"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-brand-pink" aria-label="Kaldır"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-brand-muted hover:text-brand-pink">Sepeti Temizle</button>
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Ara Toplam</span>
                <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex gap-3">
                <Link href="/sepet" onClick={() => setCartOpen(false)} className="btn-secondary flex-1 text-center text-xs">SEPETE GİT</Link>
                <Link href="/odeme" onClick={() => setCartOpen(false)} className="btn-primary flex-1 text-center text-xs">ÖDEMEYE GEÇ</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
