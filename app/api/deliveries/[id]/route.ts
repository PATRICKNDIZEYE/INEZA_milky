import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();
  try {
    const updated = await prisma.delivery.update({
      where: { id },
      data: {
        quantity: data.quantity,
        quality: data.quality,
        notes: data.notes,
        collectionTime: data.collectionTime,
      },
      include: {
        farmer: { select: { name: true, farmerId: true } },
        collectionCenter: { select: { name: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update delivery:', error);
    return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    await prisma.delivery.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete delivery:', error);
    return NextResponse.json({ error: 'Failed to delete delivery' }, { status: 500 });
  }
} 