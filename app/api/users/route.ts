import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        collectionCenterId: true,
        collectionCenter: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch users', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { name, email, username, password, role, collectionCenterId } = await request.json();
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      role,
      isActive: true,
      collectionCenterId: collectionCenterId || null,
    },
  });
  return NextResponse.json({ id: user.id });
} 