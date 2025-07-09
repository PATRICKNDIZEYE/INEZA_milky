import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { productId, type, quantity, reason } = await request.json();

    // Start a transaction to update stock and log the change
    const result = await prisma.$transaction(async (tx) => {
      // Get current product
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Calculate new stock level
      let newStockLevel = product.stockLevel;
      if (type === 'STOCK_IN') {
        newStockLevel += quantity;
      } else if (type === 'STOCK_OUT') {
        newStockLevel = Math.max(0, newStockLevel - quantity);
      } else if (type === 'ADJUSTMENT') {
        newStockLevel = quantity;
      }

      // Update product stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stockLevel: newStockLevel },
      });

      // Log the inventory change
      await tx.inventoryLog.create({
        data: {
          productId,
          type,
          quantity: type === 'STOCK_OUT' ? -quantity : quantity,
          reason,
        },
      });

      return updatedProduct;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to adjust inventory:', error);
    return NextResponse.json(
      { error: 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}