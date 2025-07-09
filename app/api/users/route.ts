import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// Only allow admins
async function isAdmin(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return false;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // For debugging, allow unauthenticated access to list users
    const isAdminUser = await isAdmin(request);
    
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
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { name, email, username, password, role } = await request.json();
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
    },
  });
  return NextResponse.json({ id: user.id });
} 