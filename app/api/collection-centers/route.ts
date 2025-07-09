export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
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