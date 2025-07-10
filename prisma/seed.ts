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

  // Create collection centers
  const mainCenter = await prisma.collectionCenter.create({
    data: {
      name: 'Main Collection Center',
      code: 'MCC001',
      location: 'Kigali Downtown',
      address: '123 Main Street, Kigali',
      phone: '+250788123456',
      manager: 'Jane Doe',
      capacity: 15000,
      isActive: true,
    },
  });

  const northCenter = await prisma.collectionCenter.create({
    data: {
      name: 'Northern Collection Center',
      code: 'NCC001',
      location: 'Musanze',
      address: '456 Mountain Road, Musanze',
      phone: '+250788234567',
      manager: 'John Smith',
      capacity: 8000,
      isActive: true,
    },
  });

  const southCenter = await prisma.collectionCenter.create({
    data: {
      name: 'Southern Collection Center',
      code: 'SCC001',
      location: 'Huye',
      address: '789 Southern Avenue, Huye',
      phone: '+250788345678',
      manager: 'Mary Johnson',
      capacity: 12000,
      isActive: true,
    },
  });

  // Create users with different roles
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dairysystem.com',
      username: 'admin',
      name: 'System Administrator',
      phone: '+250788111111',
      role: 'ADMIN',
      password: adminPassword,
      isActive: true,
      collectionCenterId: mainCenter.id,
    },
  });

  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.create({
    data: {
      email: 'manager@dairysystem.com',
      username: 'manager',
      name: 'Operations Manager',
      phone: '+250788222222',
      role: 'MANAGER',
      password: managerPassword,
      isActive: true,
      collectionCenterId: mainCenter.id,
    },
  });

  const operator1Password = await bcrypt.hash('operator123', 10);
  const operator1 = await prisma.user.create({
    data: {
      email: 'operator@dairysystem.com',
      username: 'operator',
      name: 'Main Center Operator',
      phone: '+250788333333',
      role: 'OPERATOR',
      password: operator1Password,
      isActive: true,
      collectionCenterId: mainCenter.id,
    },
  });

  const operator2Password = await bcrypt.hash('operator123', 10);
  const operator2 = await prisma.user.create({
    data: {
      email: 'operator2@dairysystem.com',
      username: 'operator2',
      name: 'Northern Center Operator',
      phone: '+250788444444',
      role: 'OPERATOR',
      password: operator2Password,
      isActive: true,
      collectionCenterId: northCenter.id,
    },
  });

  const viewerPassword = await bcrypt.hash('viewer123', 10);
  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@dairysystem.com',
      username: 'viewer',
      name: 'Report Viewer',
      phone: '+250788555555',
      role: 'VIEWER',
      password: viewerPassword,
      isActive: true,
    },
  });

  // Create farmers for different centers
  const farmers = await Promise.all([
    // Main Center Farmers
    prisma.farmer.create({
      data: {
        farmerId: 'FARM001',
        name: 'John Farmer',
        phone: '+250788666666',
        email: 'john.farmer@example.com',
        location: 'Kigali Village A',
        address: '123 Farm Road, Kigali',
        bankName: 'AgriBank Rwanda',
        accountNumber: '1234567890',
        accountName: 'John Farmer',
        pricePerL: 350,
        isActive: true,
        collectionCenterId: mainCenter.id,
      },
    }),
    prisma.farmer.create({
      data: {
        farmerId: 'FARM002',
        name: 'Sarah Mukamana',
        phone: '+250788777777',
        email: 'sarah.mukamana@example.com',
        location: 'Kigali Village B',
        address: '456 Dairy Street, Kigali',
        bankName: 'Bank of Kigali',
        accountNumber: '0987654321',
        accountName: 'Sarah Mukamana',
        pricePerL: 340,
        isActive: true,
        collectionCenterId: mainCenter.id,
      },
    }),
    // Northern Center Farmers
    prisma.farmer.create({
      data: {
        farmerId: 'FARM003',
        name: 'Pierre Ndayisaba',
        phone: '+250788888888',
        email: 'pierre.ndayisaba@example.com',
        location: 'Musanze District',
        address: '789 Mountain Farm, Musanze',
        bankName: 'AgriBank Rwanda',
        accountNumber: '1122334455',
        accountName: 'Pierre Ndayisaba',
        pricePerL: 360,
        isActive: true,
        collectionCenterId: northCenter.id,
      },
    }),
    // Southern Center Farmers
    prisma.farmer.create({
      data: {
        farmerId: 'FARM004',
        name: 'Marie Uwimana',
        phone: '+250788999999',
        email: 'marie.uwimana@example.com',
        location: 'Huye District',
        address: '321 Southern Farm, Huye',
        bankName: 'Bank of Kigali',
        accountNumber: '5544332211',
        accountName: 'Marie Uwimana',
        pricePerL: 330,
        isActive: true,
        collectionCenterId: southCenter.id,
      },
    }),
  ]);

  // Create sample deliveries
  const deliveries = await Promise.all([
    // Main Center Deliveries
    prisma.delivery.create({
      data: {
        farmerId: farmers[0].id,
        quantity: 100,
        fatContent: 3.5,
        snf: 8.5,
        density: 1.03,
        temperature: 4.0,
        ph: 6.7,
        quality: 'GOOD',
        collectionCenterId: mainCenter.id,
        recordedById: operator1.id,
        collectionTime: '08:00',
        notes: 'Morning delivery - good quality',
      },
    }),
    prisma.delivery.create({
      data: {
        farmerId: farmers[1].id,
        quantity: 85,
        fatContent: 3.8,
        snf: 8.8,
        density: 1.04,
        temperature: 3.5,
        ph: 6.5,
        quality: 'EXCELLENT',
        collectionCenterId: mainCenter.id,
        recordedById: operator1.id,
        collectionTime: '09:30',
        notes: 'Excellent quality milk',
      },
    }),
    // Northern Center Deliveries
    prisma.delivery.create({
      data: {
        farmerId: farmers[2].id,
        quantity: 120,
        fatContent: 3.2,
        snf: 8.2,
        density: 1.02,
        temperature: 4.5,
        ph: 6.8,
        quality: 'GOOD',
        collectionCenterId: northCenter.id,
        recordedById: operator2.id,
        collectionTime: '07:45',
        notes: 'Good morning collection',
      },
    }),
    // Southern Center Deliveries
    prisma.delivery.create({
      data: {
        farmerId: farmers[3].id,
        quantity: 95,
        fatContent: 3.6,
        snf: 8.6,
        density: 1.03,
        temperature: 3.8,
        ph: 6.6,
        quality: 'GOOD',
        collectionCenterId: southCenter.id,
        recordedById: admin.id,
        collectionTime: '08:15',
        notes: 'Standard quality delivery',
      },
    }),
  ]);

  // Create sample payments
  await Promise.all([
    prisma.payment.create({
      data: {
        farmerId: farmers[0].id,
        period: '2024-06',
        totalQuantity: 100,
        totalAmount: 35000,
        ratePerLiter: 350,
        status: 'COMPLETED',
        paymentDate: new Date(),
        dueDate: new Date(),
        paymentMethod: 'Bank Transfer',
        referenceNo: 'PAY001',
        notes: 'June payment completed',
        processedById: admin.id,
      },
    }),
    prisma.payment.create({
      data: {
        farmerId: farmers[1].id,
        period: '2024-06',
        totalQuantity: 85,
        totalAmount: 28900,
        ratePerLiter: 340,
        status: 'COMPLETED',
        paymentDate: new Date(),
        dueDate: new Date(),
        paymentMethod: 'Bank Transfer',
        referenceNo: 'PAY002',
        notes: 'June payment completed',
        processedById: manager.id,
      },
    }),
    prisma.payment.create({
      data: {
        farmerId: farmers[2].id,
        period: '2024-06',
        totalQuantity: 120,
        totalAmount: 43200,
        ratePerLiter: 360,
        status: 'PENDING',
        paymentDate: null,
        dueDate: new Date(),
        paymentMethod: null,
        referenceNo: null,
        notes: 'Pending payment processing',
        processedById: null,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📊 Created:');
  console.log(`   - ${await prisma.collectionCenter.count()} Collection Centers`);
  console.log(`   - ${await prisma.user.count()} Users`);
  console.log(`   - ${await prisma.farmer.count()} Farmers`);
  console.log(`   - ${await prisma.delivery.count()} Deliveries`);
  console.log(`   - ${await prisma.payment.count()} Payments`);
  console.log('');
  console.log('👤 Default Login Credentials:');
  console.log('   Admin: admin@dairysystem.com / admin123');
  console.log('   Manager: manager@dairysystem.com / manager123');
  console.log('   Operator: operator@dairysystem.com / operator123');
  console.log('   Operator2: operator2@dairysystem.com / operator123');
  console.log('   Viewer: viewer@dairysystem.com / viewer123');
  console.log('');
  console.log('🏢 Collection Centers:');
  console.log('   - Main Collection Center (MCC001)');
  console.log('   - Northern Collection Center (NCC001)');
  console.log('   - Southern Collection Center (SCC001)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 