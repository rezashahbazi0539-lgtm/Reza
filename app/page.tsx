import { prisma } from '@/lib/prisma';
import StorefrontLayout from '@/components/StorefrontLayout';
import Hero from '@/components/storefront/Hero';
import CategoryCard from '@/components/storefront/CategoryCard';
import ProductCard from '@/components/storefront/ProductCard';
import EditorialBanner from '@/components/storefront/EditorialBanner';
import InstagramGallery from '@/components/storefront/InstagramGallery';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import Link from 'next/link';

async function getHomeData() {
  const [categories, bestSellers, sections] = await Promise.all([
    prisma.category.findMany({ where: { status: 'ACTIVE' }, orderBy: { displayOrder: 'asc' } }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED', isBestSeller: true },
      include: { images: true, reviews: true },
      take: 8,
    }),
    prisma.homepageSection.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);

  const heroSection = sections.find(s => s.type === 'HERO');
  const editorialSection = sections.find(s => s.type === 'EDITORIAL');
  const igSection = sections.find(s => s.type === 'INSTAGRAM');
  const newsletterSection = sections.find(s => s.type === 'NEWSLETTER');
  const catSection = sections.find(s => s.type === 'CATEGORIES');

  return {
    categories,
    bestSellers,
    heroData: heroSection ? JSON.parse(heroSection.content) : null,
    editorialData: editorialSection ? JSON.parse(editorialSection.content) : null,
    igData: igSection ? JSON.parse(igSection.content) : null,
    newsletterData: newsletterSection ? JSON.parse(newsletterSection.content) : null,
    catTitle: catSection ? JSON.parse(catSection.content).title : 'Kategoriye Göre Alışveriş',
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <StorefrontLayout>
      {/* Hero */}
      <Hero data={data.heroData} />

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-8">{data.catTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {data.categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-brand-pink-soft">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium">En Çok Satanlar</h2>
            <Link href="/magaza" className="text-sm font-medium text-brand-dark hover:text-brand-pink transition-colors">
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.bestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <EditorialBanner data={data.editorialData} />

      {/* Instagram */}
      <InstagramGallery data={data.igData} />

      {/* Newsletter */}
      <NewsletterSection data={data.newsletterData} />
    </StorefrontLayout>
  );
}
