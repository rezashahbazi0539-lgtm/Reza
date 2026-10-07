'use client';

import { useState } from 'react';
import { Heart, ShoppingBag, Minus, Plus, Star } from 'lucide-react';
import { useStore } from '@/components/StoreContext';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

export default function ProductInfo({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState('description');
  const inWishlist = isInWishlist(product.id);
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const images = product.images || [];

  return (
    <div>
      {/* Gallery + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-brand-pink-soft overflow-hidden mb-4">
            <img src={images[activeImage]?.url || images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 ${activeImage === i ? 'border-brand-pink' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-brand-muted mb-2">{product.brand || 'City Nail'}</p>
          <h1 className="text-2xl md:text-3xl font-serif font-medium mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} className={i <= (product.reviews?.length > 0 ? Math.round(product.reviews.reduce((s,r) => s + r.rating, 0) / product.reviews.length) : 0) ? 'fill-brand-pink text-brand-pink' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-brand-muted">({product.reviews?.length || 0} yorum)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            {hasDiscount && <span className="text-lg text-brand-muted line-through">{formatPrice(product.price)}</span>}
            <span className="text-2xl font-semibold text-brand-dark">{formatPrice(price)}</span>
            {hasDiscount && <span className="bg-brand-pink text-white text-sm px-2 py-1">%{getDiscountPercent(product)} indirim</span>}
          </div>

          {/* Short description */}
          {product.shortDescription && <p className="text-brand-muted mb-6">{product.shortDescription}</p>}

          {/* Stock */}
          <p className="text-sm mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600">✓ Stokta ({product.stock} adet)</span>
            ) : (
              <span className="text-red-500">Tükendi</span>
            )}
          </p>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-gray-200">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-gray-50" aria-label="Azalt"><Minus size={16} /></button>
              <span className="px-4 py-3 text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-3 hover:bg-gray-50" aria-label="Artır"><Plus size={16} /></button>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> Sepete Ekle
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:border-brand-pink transition-colors"
              aria-label="Favorilere ekle"
            >
              <Heart size={20} className={inWishlist ? 'fill-brand-pink text-brand-pink' : ''} />
            </button>
          </div>

          {/* Features */}
          {product.features && (
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex flex-wrap gap-2">
                {product.features.split(',').map((f, i) => (
                  <span key={i} className="text-xs bg-brand-pink-soft px-3 py-1 text-brand-dark">{f.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <div className="flex gap-6 mb-6 border-b border-gray-100">
          {[
            { key: 'description', label: 'Açıklama' },
            { key: 'ingredients', label: 'İçindekiler' },
            { key: 'usage', label: 'Kullanım Talimatları' },
            { key: 'reviews', label: `Yorumlar (${product.reviews?.length || 0})` },
          ].map(tabItem => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === tabItem.key ? 'border-brand-pink text-brand-pink' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        <div className="text-sm text-brand-muted leading-relaxed">
          {tab === 'description' && <p>{product.description}</p>}
          {tab === 'ingredients' && <p>{product.ingredients || 'Bilgi mevcut değil.'}</p>}
          {tab === 'usage' && <p className="whitespace-pre-line">{product.usageInstructions || 'Bilgi mevcut değil.'}</p>}
          {tab === 'reviews' && <ReviewsSection product={product} />}
        </div>
      </div>
    </div>
  );
}

function ReviewsSection({ product }) {
  const { user } = useStore();
  const [reviews, setReviews] = useState(product.reviews || []);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, rating, comment, userName: user?.name }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setComment('');
        alert('Yorumunuz alındı. Onaylandıktan sonra yayınlanacaktır.');
      }
    } catch {}
    setSubmitting(false);
  };

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="mb-4">Henüz yorum yok. İlk yorumu siz yapın!</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map(r => (
            <div key={r.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= r.rating ? 'fill-brand-pink text-brand-pink' : 'text-gray-300'} />)}</div>
                <span className="text-sm font-medium">{r.userName}</span>
              </div>
              <p className="text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium block mb-2">Değerlendirme</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button" onClick={() => setRating(i)}>
                  <Star size={24} className={i <= rating ? 'fill-brand-pink text-brand-pink' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Yorumunuz</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} className="input-field" required placeholder="Ürün hakkında deneyiminizi paylaşın..." />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Gönderiliyor...' : 'Gönder'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">İptal</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="btn-secondary">Yorum Yaz</button>
      )}
    </div>
  );
}
