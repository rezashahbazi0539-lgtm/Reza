import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ campaigns });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const body = await req.json();
  const campaign = await prisma.campaign.create({
    data: { ...body, startDate: new Date(body.startDate), endDate: body.endDate ? new Date(body.endDate) : null },
  });
  return NextResponse.json({ campaign, message: 'Kampanya oluşturuldu.' });
}
