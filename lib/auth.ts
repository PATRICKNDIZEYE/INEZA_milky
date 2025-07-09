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