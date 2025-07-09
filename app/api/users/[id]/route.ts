import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

async function isAdmin(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === 'ADMIN';
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { name, email, username, password, role, isActive } = await request.json();
  const data: any = { name, email, username, role, isActive };
  if (password) data.password = await hashPassword(password);
  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ id: user.id });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
} 