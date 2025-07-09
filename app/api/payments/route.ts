import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import SmsService, { formatPaymentNotificationKinyarwanda } from '@/lib/sms';
import { format } from 'date-fns';

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
      include: {
        farmer: { select: { name: true, phone: true } },
      },
    });
    
    // Send SMS notification in Kinyarwanda
    try {
      if (payment.farmer.phone) {
        const message = formatPaymentNotificationKinyarwanda(
          payment.farmer.name,
          payment.totalAmount,
          format(new Date(payment.period), 'MMM yyyy')
        );
        
        await SmsService.sendSms(payment.farmer.phone, message);
        console.log('SMS notification sent successfully to farmer for payment');
      }
    } catch (smsError) {
      console.error('Failed to send SMS notification for payment:', smsError);
      // Don't fail the payment creation if SMS fails
    }
    
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Failed to create payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
} 