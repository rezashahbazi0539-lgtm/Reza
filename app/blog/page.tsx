import { prisma } from '@/lib/prisma';
import StorefrontLayout from '@/components/StorefrontLayout';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishDate: 'desc' },
  });

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">Blog</h1>
          <p className="text-brand-muted">Nail art ipuçları, trendler ve daha fazlası</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-brand-muted">Henüz blog yazısı yok.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="aspect-[3/2] overflow-hidden bg-brand-pink-soft mb-4">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <span className="text-xs text-brand-pink font-medium uppercase tracking-wide">{post.category}</span>
                <h2 className="text-lg font-medium mt-1 group-hover:text-brand-pink transition-colors">{post.title}</h2>
                <p className="text-sm text-brand-muted mt-2 line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-brand-muted mt-2">{formatDate(post.publishDate)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
