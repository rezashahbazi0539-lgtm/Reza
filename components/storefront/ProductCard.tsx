'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../StoreContext';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = getDiscountPercent(product);
  const image = product.images?.[0]?.url || product.image;

  return (
    <div className="group relative">
      <div className="relative aspect-square overflow-hidden bg-brand-pink-soft mb-3">
        <Link href={`/urun/${product.slug}`}>
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-brand-pink text-white text-xs px-2 py-1 font-medium">%{discountPercent}</span>
          )}
          {product.isNew && (
            <span className="bg-brand-dark text-white text-xs px-2 py-1 font-medium">YENİ</span>
          )}
          {product.isBestSeller && !hasDiscount && !product.isNew && (
            <span className="bg-white text-brand-dark text-xs px-2 py-1 font-medium border border-gray-200">ÇOK SATAN</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label={inWishlist ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <Heart size={16} className={inWishlist ? 'fill-brand-pink text-brand-pink' : 'text-brand-dark'} />
        </button>

        {/* Quick add */}
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-0 left-0 right-0 bg-brand-dark text-white py-3 text-sm font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Sepete Ekle
        </button>
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="text-xs text-brand-muted mb-1">{product.brand || 'City Nail'}</p>
        <Link href={`/urun/${product.slug}`} className="text-sm font-medium hover:text-brand-pink transition-colors block mb-1">
          {product.name}
        </Link>
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star size={12} className="fill-brand-pink text-brand-pink" />
          <span className="text-xs text-brand-muted">{(product.reviews?.length || 0) > 0 ? `${product.reviews.length} yorum` : 'Henüz yorum yok'}</span>
        </div>
        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          {hasDiscount && (
            <span className="text-sm text-brand-muted line-through">{formatPrice(product.price)}</span>
          )}
          <span className="text-sm font-semibold text-brand-dark">{formatPrice(price)}</span>
        </div>
      </div>
    </div>
  );
}
