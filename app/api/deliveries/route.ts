import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSMS, formatDeliveryNotification } from '@/lib/sms'
import { format } from 'date-fns'

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { date: 'desc' },
      include: {
        farmer: true,
        recordedBy: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(deliveries)
  } catch (error) {
    console.error('Failed to fetch deliveries:', error)
    return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Create delivery record
    const delivery = await prisma.delivery.create({
      data: {
        farmerId: data.farmerId,
        quantity: data.quantity,
        quality: data.quality,
        notes: data.notes,
        recordedById: 'default-user-id' // In production, get from session
      },
      include: {
        farmer: true
      }
    })

    // Send SMS notification to farmer
    const message = formatDeliveryNotification(
      delivery.farmer.name,
      delivery.quantity,
      format(delivery.date, 'dd/MM/yyyy')
    )
    
    await sendSMS(delivery.farmer.phone, message)

    return NextResponse.json(delivery)
  } catch (error) {
    console.error('Failed to create delivery:', error)
    return NextResponse.json({ error: 'Failed to create delivery' }, { status: 500 })
  }
}