import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/auth'

export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
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
  } catch (error) {
    console.error('Failed to fetch farmers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farmers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Generate unique farmer ID
    const lastFarmer = await prisma.farmer.findFirst({
      orderBy: { farmerId: 'desc' }
    })
    
    let nextId = 1
    if (lastFarmer) {
      const lastIdNum = parseInt(lastFarmer.farmerId.replace('F', ''))
      nextId = lastIdNum + 1
    }
    
    const farmerId = `F${nextId.toString().padStart(4, '0')}`

    const farmer = await prisma.farmer.create({
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
    })

    // Log activity
    await logActivity(userId, 'CREATE', 'farmer', farmer.id, { name: farmer.name }, request)

    return NextResponse.json(farmer)
  } catch (error) {
    console.error('Failed to create farmer:', error)
    return NextResponse.json(
      { error: 'Failed to create farmer' },
      { status: 500 }
    )
  }
}