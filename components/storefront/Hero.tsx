'use client';

import Link from 'next/link';
import { ShieldCheck, Sparkles, Leaf, Award } from 'lucide-react';

export default function Hero({ data }) {
  const h = data || {};
  const benefits = [
    { icon: Award, label: 'Salon Kalitesi' },
    { icon: Sparkles, label: 'Uzun Ömürlü' },
    { icon: Leaf, label: 'Vegan & Cruelty Free' },
    { icon: ShieldCheck, label: 'Uzmanlar Tarafından' },
  ];

  return (
    <section className="bg-brand-pink-bg">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-20">
          {/* Text */}
          <div className="order-2 md:order-1 text-center md:text-left">
            {h.eyebrow && (
              <p className="text-xs font-semibold tracking-widest text-brand-pink mb-4 uppercase">
                {h.eyebrow}
              </p>
            )}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-brand-dark leading-tight mb-4">
              {h.title || 'Senin Tarzını Yansıtan'}{' '}
              {h.highlight && <span className="text-brand-pink italic">{h.highlight}</span>}
            </h1>
            <p className="text-base md:text-lg text-brand-muted leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
              {h.description || 'Sınırsız yaratıcılık için premium ürünler. Salon kalitesinde manikür, artık parmak uçlarınızda.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/magaza" className="btn-primary text-center">{h.cta1 || 'ALIŞVERİŞE BAŞLA'}</Link>
              <Link href="/kategori/nail-art" className="btn-secondary text-center">{h.cta2 || 'NAIL ART KEŞFET'}</Link>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {benefits.map((b, i) => (
                <div key={i} className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                  <b.icon size={20} className="text-brand-pink" />
                  <span className="text-xs font-medium text-brand-dark">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 relative aspect-[4/5] md:aspect-square overflow-hidden">
            <img
              src={h.image || 'https://picsum.photos/seed/citynail-hero-main/800/1000'}
              alt="City Nail Hero"
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
