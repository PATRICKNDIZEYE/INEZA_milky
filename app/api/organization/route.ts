import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch organization settings
export async function GET() {
  try {
    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json(org);
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
  }
}

// PUT: Update organization settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    // Only one organization row (id=1)
    const updated = await prisma.organization.update({
      where: { id: 1 },
      data: {
        name: data.name,
        logo: data.logo,
        contactEmail: data.contactEmail,
        phone: data.phone,
        defaultCollectionCenter: data.defaultCollectionCenter,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
} 