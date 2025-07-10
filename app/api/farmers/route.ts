import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity, requireOperatorOrAbove, getFarmerFilter } from '@/lib/auth'
import { error } from 'console';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user with role check
    const user = await requireOperatorOrAbove(request);
    // Get collection center filter based on user role
    const collectionCenterFilter = getFarmerFilter(user);
    const farmers = await prisma.farmer.findMany({
      where: collectionCenterFilter,
      include: {
        collectionCenter: {
          select: {
            name: true,
            code: true
          }
        },
        _count: {
          select: {
            deliveries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(farmers)
  } catch (error: any) {
    console.error('Failed to fetch farmers:', error)
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch farmers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await requireOperatorOrAbove(request);
  const data = await request.json();
  let attempt = 0;
  let farmer = null;
  let lastError = null;
  while (attempt < 5 && !farmer) {
    try {
      // Fetch all farmerIds and find the max numeric part
      const allFarmers = await prisma.farmer.findMany({ select: { farmerId: true } });
      let maxId = 0;
      for (const f of allFarmers) {
        const num = parseInt(String(f.farmerId).replace(/^F/, ''));
        if (!isNaN(num) && num > maxId) maxId = num;
      }
      const nextId = maxId + 1;
      const farmerId = `F${nextId.toString().padStart(4, '0')}`;
      farmer = await prisma.farmer.create({
        data: {
          ...data,
          farmerId
        },
        include: {
          collectionCenter: {
            select: {
              name: true,
              code: true
            }
          }
        }
      });
      // Log activity
      await logActivity(user.id, 'CREATE', 'farmer', farmer.id, { name: farmer.name }, request);
      return NextResponse.json(farmer);
    } catch (error: any) {
      lastError = error;
      // If unique constraint error, retry
      if (error.code === 'P2002' && error.meta?.target?.includes('farmerId')) {
        attempt++;
        continue;
      }
      console.error('Failed to create farmer:', error);
      return NextResponse.json(
        { error: 'Failed to create farmer' },
        { status: 500 }
      );
    }
  }
  // If all attempts failed
  console.error('Failed to create farmer after retries:', lastError);
  return NextResponse.json(
    { error: lastError },
    { status: 500 }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireOperatorOrAbove(request);
    const data = await request.json();
    const { id, ...updateData } = data;
    const farmer = await prisma.farmer.update({
      where: { id },
      data: updateData,
      include: {
        collectionCenter: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });
    await logActivity(user.id, 'UPDATE', 'farmer', id, { name: farmer.name }, request);
    return NextResponse.json(farmer);
  } catch (error) {
    console.error('Failed to update farmer:', error);
    return NextResponse.json(
      { error: 'Failed to update farmer' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireOperatorOrAbove(request);
    const data = await request.json();
    const { id, isActive } = data;
    const farmer = await prisma.farmer.update({
      where: { id },
      data: { isActive },
      include: {
        collectionCenter: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });
    await logActivity(user.id, isActive ? 'ACTIVATE' : 'DEACTIVATE', 'farmer', id, { name: farmer.name }, request);
    return NextResponse.json(farmer);
  } catch (error) {
    console.error('Failed to update farmer status:', error);
    return NextResponse.json(
      { error: 'Failed to update farmer status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireOperatorOrAbove(request);
    const { id } = await request.json();
    const farmer = await prisma.farmer.delete({
      where: { id }
    });
    await logActivity(user.id, 'DELETE', 'farmer', id, { name: farmer.name }, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete farmer:', error);
    return NextResponse.json(
      { error: 'Failed to delete farmer' },
      { status: 500 }
    );
  }
}
