import { prisma } from '@/lib/prisma';
import StorefrontLayout from '@/components/StorefrontLayout';
import ProductInfo from '@/components/storefront/ProductInfo';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getProduct(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      reviews: { where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } },
      category: true,
    },
  });
  if (!product || product.status !== 'PUBLISHED') return null;

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: 'PUBLISHED' },
    include: { images: true, reviews: true },
    take: 4,
  });

  return { product, related };
}

export async function generateMetadata({ params }) {
  const data = await getProduct(params.slug);
  if (!data) return {};
  return { title: `${data.product.name} - City Nail`, description: data.product.shortDescription };
}

export default async function ProductPage({ params }) {
  const data = await getProduct(params.slug);
  if (!data) notFound();
  const { product, related } = data;

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        {/* Breadcrumb */}
        <nav className="text-sm text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-pink">Ana Sayfa</Link>
          {' / '}
          <Link href="/magaza" className="hover:text-brand-pink">Mağaza</Link>
          {' / '}
          <Link href={`/kategori/${product.category.slug}`} className="hover:text-brand-pink">{product.category.name}</Link>
          {' / '}
          <span className="text-brand-dark">{product.name}</span>
        </nav>

        <ProductInfo product={product} />

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-medium mb-6 text-center">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
