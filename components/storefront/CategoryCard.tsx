'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/kategori/${category.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-brand-pink-soft mb-3">
        <img
          src={category.image || 'https://picsum.photos/seed/cat/400/400'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-brand-dark mb-1">{category.name}</h3>
        <span className="text-xs text-brand-muted group-hover:text-brand-pink transition-colors inline-flex items-center gap-1">
          Alışveriş Yap <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
