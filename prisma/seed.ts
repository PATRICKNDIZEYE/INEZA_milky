import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // Clean up existing data for a fresh seed
  await prisma.payment.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.activityLog.deleteMany(); // Delete logs before users
  await prisma.user.deleteMany();
  await prisma.collectionCenter.deleteMany();

  // Create a collection center
  const collectionCenter = await prisma.collectionCenter.create({
    data: {
      name: 'Main Center',
      code: 'MAIN001',
      location: 'Downtown',
      address: '123 Main St',
      phone: '1234567890',
      manager: 'Jane Doe',
      capacity: 10000,
      isActive: true,
    },
  });

  // Create an admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dairysystem.com', // Updated for consistency
      username: 'admin',
      name: 'Admin User',
      phone: '1234567890',
      role: 'ADMIN',
      password: adminPassword,
      isActive: true,
      collectionCenterId: collectionCenter.id,
    },
  });

  // Create a farmer
  const farmer = await prisma.farmer.create({
    data: {
      farmerId: 'FARM001',
      name: 'John Farmer',
      phone: '0987654321',
      email: 'farmer@example.com',
      location: 'Village A',
      address: '456 Country Rd',
      bankName: 'AgriBank',
      accountNumber: '123456789',
      accountName: 'John Farmer',
      pricePerL: 350,
      isActive: true,
      collectionCenterId: collectionCenter.id,
    },
  });

  // Create a delivery
  const delivery = await prisma.delivery.create({
    data: {
      farmerId: farmer.id,
      quantity: 100,
      fatContent: 3.5,
      snf: 8.5,
      density: 1.03,
      temperature: 4.0,
      ph: 6.7,
      quality: 'GOOD',
      collectionCenterId: collectionCenter.id,
      recordedById: admin.id,
      collectionTime: '08:00',
      notes: 'Morning delivery',
    },
  });

  // Create a payment
  await prisma.payment.create({
    data: {
      farmerId: farmer.id,
      period: '2024-06',
      totalQuantity: 100,
      totalAmount: 35000,
      ratePerLiter: 350,
      status: 'COMPLETED',
      paymentDate: new Date(),
      dueDate: new Date(),
      paymentMethod: 'Bank Transfer',
      referenceNo: 'PAY001',
      notes: 'First payment',
      processedById: admin.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 