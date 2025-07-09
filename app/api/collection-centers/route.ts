export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const centers = await prisma.collectionCenter.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(centers)
  } catch (error) {
    console.error('Failed to fetch collection centers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection centers' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.code || !data.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const created = await prisma.collectionCenter.create({
      data: {
        name: data.name,
        code: data.code,
        location: data.location,
        address: data.address,
        phone: data.phone,
        manager: data.manager,
        capacity: data.capacity,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error('Failed to create collection center:', error);
    return NextResponse.json({ error: 'Failed to create collection center' }, { status: 500 });
  }
}