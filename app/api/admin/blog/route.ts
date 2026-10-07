import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ posts });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: 'Başlık gerekli.' }, { status: 400 });
  const post = await prisma.blogPost.create({
    data: { ...body, slug: body.slug || slugify(body.title), publishDate: body.publishDate ? new Date(body.publishDate) : new Date() },
  });
  return NextResponse.json({ post, message: 'Blog yazısı oluşturuldu.' });
}
