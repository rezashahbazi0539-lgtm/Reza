import { prisma } from '@/lib/prisma';
import StorefrontLayout from '@/components/StorefrontLayout';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getCategory(slug) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;
  const products = await prisma.product.findMany({
    where: { categoryId: category.id, status: 'PUBLISHED' },
    include: { images: true, reviews: true },
    orderBy: { createdAt: 'desc' },
  });
  return { category, products };
}

export async function generateMetadata({ params }) {
  const data = await getCategory(params.slug);
  if (!data) return {};
  return { title: `${data.category.name} - City Nail`, description: data.category.description };
}

export default async function CategoryPage({ params }) {
  const data = await getCategory(params.slug);
  if (!data) notFound();
  const { category, products } = data;

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        {/* Breadcrumb */}
        <nav className="text-sm text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-pink">Ana Sayfa</Link>
          {' / '}
          <Link href="/magaza" className="hover:text-brand-pink">Mağaza</Link>
          {' / '}
          <span className="text-brand-dark">{category.name}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">{category.name}</h1>
          {category.description && <p className="text-brand-muted">{category.description}</p>}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2">Henüz ürün bulunamadı.</p>
            <Link href="/magaza" className="btn-primary inline-block mt-4">Tüm Ürünler</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
