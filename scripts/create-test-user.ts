import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('temporarypassword123', 10);
  
  const user = await prisma.user.upsert({
    where: { id: 'cmcw8r6nr0002ig8dxtvs42uk' },
    update: {},
    create: {
      id: 'cmcw8r6nr0002ig8dxtvs42uk',
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Created/updated test user:', user);
}

main()
  .catch((e) => {
    console.error('Error creating test user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
