import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const body = await req.json();
  const { email, name } = body;

  if (!email) {
    return NextResponse.json({ error: 'E-posta adresi gerekli.' }, { status: 400 });
  }

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) {
    if (existing.status === 'UNSUBSCRIBED') {
      await prisma.newsletterSubscriber.update({ where: { email }, data: { status: 'ACTIVE' } });
      return NextResponse.json({ message: 'Aboneliğiniz yeniden aktif edildi.' });
    }
    return NextResponse.json({ message: 'Bu e-posta zaten abone.' });
  }

  await prisma.newsletterSubscriber.create({ data: { email, name } });
  return NextResponse.json({ message: 'Aboneliğiniz alındı. Teşekkürler!' });
}
