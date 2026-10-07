import { prisma } from '@/lib/prisma';
import StorefrontLayout from '@/components/StorefrontLayout';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

async function getPost(slug) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== 'PUBLISHED') return null;
  const related = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED', id: { not: post.id }, category: post.category },
    take: 3,
  });
  return { post, related };
}

export async function generateMetadata({ params }) {
  const data = await getPost(params.slug);
  if (!data) return {};
  return { title: `${data.post.title} - City Nail Blog`, description: data.post.excerpt };
}

export default async function BlogPostPage({ params }) {
  const data = await getPost(params.slug);
  if (!data) notFound();
  const { post, related } = data;

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <nav className="text-sm text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-pink">Ana Sayfa</Link>
          {' / '}
          <Link href="/blog" className="hover:text-brand-pink">Blog</Link>
          {' / '}
          <span className="text-brand-dark">{post.title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          <span className="text-xs text-brand-pink font-medium uppercase tracking-wide">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium mt-2 mb-4">{post.title}</h1>
          <p className="text-sm text-brand-muted mb-6">{post.author} • {formatDate(post.publishDate)}</p>

          <div className="aspect-[16/9] overflow-hidden bg-brand-pink-soft mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-lg text-brand-muted mb-6">{post.excerpt}</p>
            <div className="text-brand-dark leading-relaxed whitespace-pre-line">{post.content}</div>
          </div>
        </article>

        {related.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-serif font-medium mb-6">İlgili Yazılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <div className="aspect-[3/2] overflow-hidden bg-brand-pink-soft mb-3">
                    <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-brand-pink">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
