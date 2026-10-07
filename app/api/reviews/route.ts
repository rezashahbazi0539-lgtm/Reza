import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { productId, rating, comment, userName } = body;

  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
  }

  const user = await getUserFromRequest(req);

  const review = await prisma.review.create({
    data: {
      productId,
      rating: parseInt(rating),
      comment,
      userName: userName || user?.name || 'Anonim',
      userId: user?.id,
      status: 'PENDING',
    },
  });

  return NextResponse.json({ review, message: 'Yorumunuz alındı. Onaylandıktan sonra yayınlanacaktır.' });
}
