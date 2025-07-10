import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity, requireOperatorOrAbove } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireOperatorOrAbove(request);
    const { isActive } = await request.json();
    const farmer = await prisma.farmer.update({
      where: { id: params.id },
      data: { isActive },
      include: {
        collectionCenter: { select: { name: true, code: true } }
      }
    });
    await logActivity(user.id, isActive ? 'ACTIVATE' : 'DEACTIVATE', 'farmer', params.id, { name: farmer.name }, request);
    return NextResponse.json(farmer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update farmer status' }, { status: 500 });
  }
} 