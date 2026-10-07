import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Blog yazısı silindi.' });
}
