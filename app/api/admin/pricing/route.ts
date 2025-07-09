import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prices = await prisma.productPrice.findMany({
      include: {
        product: {
          select: {
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Failed to fetch pricing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, category, price, minQuantity } = await request.json();

    const newPrice = await prisma.productPrice.create({
      data: {
        productId,
        category,
        price,
        minQuantity,
      },
      include: {
        product: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(newPrice);
  } catch (error) {
    console.error('Failed to create price:', error);
    return NextResponse.json(
      { error: 'Failed to create price' },
      { status: 500 }
    );
  }
}