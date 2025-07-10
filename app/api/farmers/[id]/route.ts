import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity, requireOperatorOrAbove } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireOperatorOrAbove(request);
    const farmer = await prisma.farmer.findUnique({
      where: { id: params.id },
      include: {
        collectionCenter: { select: { name: true, code: true } },
        _count: { select: { deliveries: true } }
      }
    });
    if (!farmer) return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    return NextResponse.json(farmer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch farmer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireOperatorOrAbove(request);
    const data = await request.json();
    const farmer = await prisma.farmer.update({
      where: { id: params.id },
      data,
      include: {
        collectionCenter: { select: { name: true, code: true } }
      }
    });
    await logActivity(user.id, 'UPDATE', 'farmer', params.id, { name: farmer.name }, request);
    return NextResponse.json(farmer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update farmer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireOperatorOrAbove(request);
    const farmer = await prisma.farmer.delete({ where: { id: params.id } });
    await logActivity(user.id, 'DELETE', 'farmer', params.id, { name: farmer.name }, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete farmer' }, { status: 500 });
  }
} 