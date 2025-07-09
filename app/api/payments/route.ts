import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';
  try {
    const payments = await prisma.payment.findMany({
      where: {
        period: { gte: start, lte: end },
      },
      include: {
        farmer: true,
      },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const payment = await prisma.payment.create({
      data: {
        farmerId: data.farmerId,
        period: data.period,
        totalQuantity: data.totalLiters,
        totalAmount: data.totalAmount,
        ratePerLiter: data.pricePerL,
        status: 'COMPLETED',
        paymentDate: new Date(),
        dueDate: new Date(),
      },
    });
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Failed to create payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
} 