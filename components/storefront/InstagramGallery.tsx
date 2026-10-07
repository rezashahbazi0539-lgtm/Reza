'use client';

export default function InstagramGallery({ data }) {
  const images = data?.images || Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/citynail-ig-${i}/400/400`);
  return (
    <section className="section-padding">
      <div className="container-page">
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-2">İlham Al</h2>
        <p className="text-center text-brand-muted mb-8 text-sm">@citynail</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {images.map((img, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden bg-brand-pink-soft group">
              <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
