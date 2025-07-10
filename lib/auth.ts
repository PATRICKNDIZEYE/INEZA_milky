import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";



export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createDefaultAdmin() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!existingAdmin) {
    const hashedPassword = await hashPassword('admin123')
    await prisma.user.create({
      data: {
        email: 'admin@dairysystem.com',
        username: 'admin',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'ADMIN'
      }
    })
    console.log('Default admin created: admin@dairysystem.com / admin123')
  }
}

export async function logActivity(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: any,
  req?: any
) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers?.['user-agent']
    }
  })
}

// Role-based access control utilities
export async function getUserFromRequest(request: any) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        collectionCenter: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function requireRole(request: any, allowedRoles: string[]) {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

export async function requireAdmin(request: any) {
  return await requireRole(request, ['ADMIN']);
}

export async function requireManagerOrAdmin(request: any) {
  return await requireRole(request, ['ADMIN', 'MANAGER']);
}

export async function requireOperatorOrAbove(request: any) {
  return await requireRole(request, ['ADMIN', 'MANAGER', 'OPERATOR']);
}

// Collection center filtering utilities
export function getCollectionCenterFilter(user: any) {
  // Admins and managers can see all data
  if (user.role === 'ADMIN' || user.role === 'MANAGER') {
    return {};
  }
  
  // Operators can only see data from their assigned collection center
  if (user.role === 'OPERATOR' && user.collectionCenterId) {
    return { collectionCenterId: user.collectionCenterId };
  }
  
  // If operator has no collection center assigned, they can't see any data
  if (user.role === 'OPERATOR') {
    return { collectionCenterId: null }; // This will return no results
  }
  
  return {};
}

export function getFarmerFilter(user: any) {
  const collectionCenterFilter = getCollectionCenterFilter(user);
  return collectionCenterFilter;
}

export function getDeliveryFilter(user: any) {
  const collectionCenterFilter = getCollectionCenterFilter(user);
  return collectionCenterFilter;
}

export function getPaymentFilter(user: any) {
  // For payments, we need to filter by farmer's collection center
  if (user.role === 'ADMIN' || user.role === 'MANAGER') {
    return {};
  }
  
  if (user.role === 'OPERATOR' && user.collectionCenterId) {
    return {
      farmer: {
        collectionCenterId: user.collectionCenterId
      }
    };
  }
  
  if (user.role === 'OPERATOR') {
    return {
      farmer: {
        collectionCenterId: null
      }
    };
  }
  
  return {};
}