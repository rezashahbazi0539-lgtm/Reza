import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const settings = await prisma.siteSetting.findMany();
  const result = {};
  settings.forEach(s => { result[s.key] = JSON.parse(s.value); });
  return NextResponse.json({ settings: result });
}

export async function PUT(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const body = await req.json();
  const { key, value } = body;
  const existing = await prisma.siteSetting.findUnique({ where: { key } });
  if (existing) {
    await prisma.siteSetting.update({ where: { key }, data: { value: JSON.stringify(value) } });
  } else {
    await prisma.siteSetting.create({ data: { key, value: JSON.stringify(value) } });
  }
  return NextResponse.json({ message: 'Ayarlar kaydedildi.' });
}
