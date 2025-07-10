import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { name, email, username, password, role, isActive, collectionCenterId } = await request.json();
  const data: any = { name, email, username, role, isActive, collectionCenterId: collectionCenterId || null };
  if (password) data.password = await hashPassword(password);
  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ id: user.id });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
} 