import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId } = await request.json();

    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent(amount);

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId,
        customerId: 'temp-customer-id', // Get from session
        amount,
        method: 'CREDIT_CARD',
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}