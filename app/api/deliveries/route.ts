import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import SmsService, { formatDeliveryNotificationKinyarwanda } from '@/lib/sms'
import { format } from 'date-fns'
import { jwtVerify } from 'jose'
import { requireOperatorOrAbove, getDeliveryFilter } from '@/lib/auth'

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    console.log('All request cookies:', request.cookies.getAll());
    
    // Use the same cookie name as in middleware.ts
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      console.error('No auth token found in cookies');
      return null;
    }

    console.log('JWT token found, verifying...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set in environment variables');
      return null;
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    
    if (!payload.userId) {
      console.error('No userId found in JWT payload:', payload);
      return null;
    }
    
    console.log('Successfully extracted userId from JWT:', payload.userId);
    return payload.userId as string;
    
  } catch (error) {
    console.error('Error in getUserIdFromRequest:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user with role check
    const user = await requireOperatorOrAbove(request);
    
    // Get collection center filter based on user role
    const collectionCenterFilter = getDeliveryFilter(user);
    
    const deliveries = await prisma.delivery.findMany({
      where: collectionCenterFilter,
      orderBy: { date: 'desc' },
      include: {
        farmer: { select: { name: true, farmerId: true } },
        collectionCenter: { select: { name: true } },
      },
    })
    return NextResponse.json(deliveries)
  } catch (error: any) {
    console.error('Failed to fetch deliveries:', error)
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('DELIVERY POST BODY:', data);
    
    // Get authenticated userId from JWT cookie
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      console.error('No user ID found in request');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('Using user ID for delivery:', userId);
    
    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      console.error(`User with ID ${userId} not found in database`);
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 404 }
      );
    }

    const deliveryData = {
      farmerId: data.farmerId,
      quantity: data.quantity,
      quality: data.quality || 'GOOD',
      notes: data.notes || '',
      collectionTime: data.collectionTime || new Date().toISOString(),
      recordedById: userId,
      collectionCenterId: data.collectionCenterId,
    };

    console.log('Creating delivery with data:', deliveryData);
    
    const delivery = await prisma.delivery.create({
      data: deliveryData,
      include: {
        farmer: { select: { name: true, farmerId: true, phone: true } },
        collectionCenter: { select: { name: true } },
      },
    });
    
    console.log('Successfully created delivery:', delivery.id);
    
    // Send SMS notification in Kinyarwanda
    try {
      if (delivery.farmer.phone) {
        const message = formatDeliveryNotificationKinyarwanda(
          delivery.farmer.name,
          delivery.quantity,
          format(new Date(delivery.date), 'dd/MM/yyyy')
        );
        
        await SmsService.sendSms(delivery.farmer.phone, message);
        console.log('SMS notification sent successfully to farmer');
      }
    } catch (smsError) {
      console.error('Failed to send SMS notification:', smsError);
      // Don't fail the delivery creation if SMS fails
    }
    
    return NextResponse.json(delivery, { status: 201 });
    
  } catch (error: any) {
    console.error('Failed to create delivery:', error);
    
    if (error.code === 'P2003') {
      const constraint = error.meta?.constraint || '';
      if (constraint.includes('recordedById')) {
        return NextResponse.json(
          { error: 'Invalid user account', details: 'The user recording this delivery does not exist' },
          { status: 400 }
        );
      }
      if (constraint.includes('farmerId')) {
        return NextResponse.json(
          { error: 'Invalid farmer', details: 'The specified farmer does not exist' },
          { status: 400 }
        );
      }
      if (constraint.includes('collectionCenterId')) {
        return NextResponse.json(
          { error: 'Invalid collection center', details: 'The specified collection center does not exist' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to create delivery',
        details: error.message || 'Unknown error occurred',
        code: error.code
      },
      { status: 500 }
    );
  }
}