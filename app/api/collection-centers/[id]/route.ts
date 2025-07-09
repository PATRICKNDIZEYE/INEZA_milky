import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();
  try {
    const updated = await prisma.collectionCenter.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        location: data.location,
        address: data.address,
        phone: data.phone,
        manager: data.manager,
        capacity: data.capacity,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update collection center:', error);
    return NextResponse.json({ error: 'Failed to update collection center' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    await prisma.collectionCenter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete collection center:', error);
    return NextResponse.json({ error: 'Failed to delete collection center' }, { status: 500 });
  }
} 