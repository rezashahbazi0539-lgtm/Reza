'use client';

import StorefrontLayout from '@/components/StorefrontLayout';
import { useStore } from '@/components/StoreContext';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, moveToCart, toggleWishlist } = useStore();

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <h1 className="text-3xl font-serif font-medium mb-8 text-center">Favorilerim</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="text-gray-200 mx-auto mb-6" />
            <p className="text-lg font-medium mb-2">Favorileriniz burada görünecek.</p>
            <p className="text-brand-muted mb-8">Beğendiğiniz ürünleri favorilere ekleyin.</p>
            <Link href="/magaza" className="btn-primary">ALIŞVERİŞE BAŞLA</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(item => (
              <div key={item.id} className="card p-4">
                <div className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover bg-brand-pink-soft" />
                  <div className="flex-1">
                    <Link href={`/urun/${item.slug}`} className="font-medium hover:text-brand-pink block mb-1">{item.name}</Link>
                    <p className="text-sm font-semibold mb-3">{formatPrice(item.price)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => moveToCart(item)} className="btn-primary text-xs px-4 py-2 flex items-center gap-1">
                        <ShoppingBag size={14} /> Sepete Taşı
                      </button>
                      <button onClick={() => toggleWishlist(item)} className="text-brand-muted hover:text-brand-pink text-xs">Çıkar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
