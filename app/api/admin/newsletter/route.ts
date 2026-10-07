import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
  const total = subscribers.length;
  const active = subscribers.filter(s => s.status === 'ACTIVE').length;
  const unsubscribed = subscribers.filter(s => s.status === 'UNSUBSCRIBED').length;
  return NextResponse.json({ subscribers, stats: { total, active, unsubscribed } });
}
