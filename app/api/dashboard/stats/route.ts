export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subDays } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const today = startOfDay(now)
    const todayEnd = endOfDay(now)

    // Get farmer stats
    const totalFarmers = await prisma.farmer.count()
    const activeFarmers = await prisma.farmer.count({
      where: { isActive: true }
    })

    // Get today's collection
    const todayDeliveries = await prisma.delivery.aggregate({
      where: {
        date: {
          gte: today,
          lte: todayEnd
        }
      },
      _sum: {
        quantity: true
      },
      _count: true
    })

    // Get monthly collection
    const monthlyDeliveries = await prisma.delivery.aggregate({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd
        }
      },
      _sum: {
        quantity: true
      }
    })

    // Get pending payments
    const pendingPayments = await prisma.payment.count({
      where: { status: 'PENDING' }
    })

    // Calculate revenue
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        },
        status: 'COMPLETED'
      },
      _sum: {
        totalAmount: true
      }
    })

    // Get low quality deliveries
    const lowQualityDeliveries = await prisma.delivery.count({
      where: {
        quality: { in: ['FAIR', 'POOR'] },
        date: {
          gte: today,
          lte: todayEnd
        }
      }
    })

    // Get recent deliveries
    const recentDeliveries = await prisma.delivery.findMany({
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
          }
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
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}