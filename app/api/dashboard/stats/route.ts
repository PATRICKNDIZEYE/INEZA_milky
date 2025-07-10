export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subDays } from 'date-fns'
import { requireOperatorOrAbove, getFarmerFilter, getDeliveryFilter, getPaymentFilter } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user with role check
    const user = await requireOperatorOrAbove(request);
    
    // Get collection center filters based on user role
    const farmerFilter = getFarmerFilter(user);
    const deliveryFilter = getDeliveryFilter(user);
    const paymentFilter = getPaymentFilter(user);
    
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const today = startOfDay(now)
    const todayEnd = endOfDay(now)

    // Get farmer stats with role-based filtering
    const totalFarmers = await prisma.farmer.count({
      where: farmerFilter
    })
    const activeFarmers = await prisma.farmer.count({
      where: { 
        isActive: true,
        ...farmerFilter
      }
    })

    // Get today's collection with role-based filtering
    const todayDeliveries = await prisma.delivery.aggregate({
      where: {
        date: {
          gte: today,
          lte: todayEnd
        },
        ...deliveryFilter
      },
      _sum: {
        quantity: true
      },
      _count: true
    })

    // Get monthly collection with role-based filtering
    const monthlyDeliveries = await prisma.delivery.aggregate({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd
        },
        ...deliveryFilter
      },
      _sum: {
        quantity: true
      }
    })

    // Get pending payments with role-based filtering
    const pendingPayments = await prisma.payment.count({
      where: { 
        status: 'PENDING',
        ...paymentFilter
      }
    })

    // Calculate revenue with role-based filtering
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        },
        status: 'COMPLETED',
        ...paymentFilter
      },
      _sum: {
        totalAmount: true
      }
    })

    // Get low quality deliveries with role-based filtering
    const lowQualityDeliveries = await prisma.delivery.count({
      where: {
        quality: { in: ['FAIR', 'POOR'] },
        date: {
          gte: today,
          lte: todayEnd
        },
        ...deliveryFilter
      }
    })

    // Get recent deliveries with role-based filtering
    const recentDeliveries = await prisma.delivery.findMany({
      where: deliveryFilter,
      take: 10,
      orderBy: { date: 'desc' },
      include: {
        farmer: {
          select: {
            name: true,
            farmerId: true
          }
        },
        collectionCenter: {
          select: {
            name: true
          }
        }
      }
    })

    // Get collection trend (last 7 days)
    const collectionTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)
      
      const dayCollection = await prisma.delivery.aggregate({
        where: {
          date: {
            gte: dayStart,
            lte: dayEnd
          },
          ...deliveryFilter
        },
        _sum: {
          quantity: true
        }
      })

      collectionTrend.push({
        date: date.toISOString(),
        quantity: dayCollection._sum.quantity || 0
      })
    }

    return NextResponse.json({
      totalFarmers,
      activeFarmers,
      todayCollection: todayDeliveries._sum.quantity || 0,
      monthlyCollection: monthlyDeliveries._sum.quantity || 0,
      pendingPayments,
      totalRevenue: monthlyRevenue._sum.totalAmount || 0,
      lowQualityDeliveries,
      recentDeliveries,
      collectionTrend
    })
  } catch (error: any) {
    console.error('Failed to fetch dashboard stats:', error)
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}