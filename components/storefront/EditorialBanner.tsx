'use client';

import Link from 'next/link';

export default function EditorialBanner({ data }) {
  const benefits = data?.benefits || ['PROFESYONEL KALİTE', 'GÜVENLİ & TOKSİKSİZ', 'TREND & EŞSİZ', 'TUTKUYLA ÜRETİLDİ'];
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={data?.image || 'https://picsum.photos/seed/citynail-editorial/800/600'} alt="Editorial" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-medium mb-3">{data?.title || 'Sınırları Aş'}</h2>
            <p className="text-brand-muted mb-6">{data?.description || 'Etkileyici tırnaklar için ihtiyacınız olan her şey'}</p>
            <Link href="/magaza" className="btn-primary mb-8 inline-block">{data?.cta || 'DAHA FAZLA'}</Link>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-pink rounded-full" />
                  <span className="text-sm font-medium text-brand-dark">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
