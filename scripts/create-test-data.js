const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Get the collection center
    const collectionCenter = await prisma.collectionCenter.findFirst();
    
    if (!collectionCenter) {
      console.log('No collection center found. Please run create-operator.js first.');
      return;
    }
    
    console.log('Creating test data for collection center:', collectionCenter.name);
    
    // Create test farmers
    const testFarmers = [
      {
        name: 'Jean Pierre Uwimana',
        phone: '0781234567',
        email: 'jean.uwimana@email.com',
        location: 'Kigali',
        address: 'Kigali, Rwanda',
        bankName: 'Bank of Kigali',
        accountNumber: '1234567890',
        accountName: 'Jean Pierre Uwimana',
        pricePerL: 350,
        collectionCenterId: collectionCenter.id
      },
      {
        name: 'Marie Claire Mukamana',
        phone: '0782345678',
        email: 'marie.mukamana@email.com',
        location: 'Kigali',
        address: 'Kigali, Rwanda',
        bankName: 'Ecobank',
        accountNumber: '0987654321',
        accountName: 'Marie Claire Mukamana',
        pricePerL: 320,
        collectionCenterId: collectionCenter.id
      },
      {
        name: 'Emmanuel Ndayisaba',
        phone: '0783456789',
        email: 'emmanuel.ndayisaba@email.com',
        location: 'Kigali',
        address: 'Kigali, Rwanda',
        bankName: 'GT Bank',
        accountNumber: '1122334455',
        accountName: 'Emmanuel Ndayisaba',
        pricePerL: 330,
        collectionCenterId: collectionCenter.id
      }
    ];
    
    for (const farmerData of testFarmers) {
      // Check if farmer already exists
      const existingFarmer = await prisma.farmer.findFirst({
        where: {
          phone: farmerData.phone
        }
      });
      
      if (existingFarmer) {
        console.log(`Farmer ${farmerData.name} already exists, skipping...`);
        continue;
      }
      
      // Generate unique farmer ID
      const lastFarmer = await prisma.farmer.findFirst({
        orderBy: { farmerId: 'desc' }
      });
      
      let nextId = 1;
      if (lastFarmer) {
        const lastIdNum = parseInt(lastFarmer.farmerId.replace('F', ''));
        nextId = lastIdNum + 1;
      }
      
      // Keep trying until we find a unique ID
      let farmerId;
      let attempts = 0;
      do {
        farmerId = `F${nextId.toString().padStart(4, '0')}`;
        const existing = await prisma.farmer.findUnique({
          where: { farmerId }
        });
        if (!existing) break;
        nextId++;
        attempts++;
        if (attempts > 100) {
          throw new Error('Could not generate unique farmer ID');
        }
      } while (true);
      
      const farmer = await prisma.farmer.create({
        data: {
          ...farmerData,
          farmerId
        }
      });
      
      console.log(`✅ Created farmer: ${farmer.name} (${farmer.farmerId})`);
      
      // Create some test deliveries for this farmer
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const deliveries = [
        {
          quantity: 25.5,
          quality: 'GOOD',
          date: yesterday,
          notes: 'Good quality milk',
          collectionTime: '08:30',
          collectionCenterId: collectionCenter.id,
          farmerId: farmer.id
        },
        {
          quantity: 28.0,
          quality: 'EXCELLENT',
          date: today,
          notes: 'Excellent quality milk',
          collectionTime: '07:45',
          collectionCenterId: collectionCenter.id,
          farmerId: farmer.id
        }
      ];
      
      for (const deliveryData of deliveries) {
        const delivery = await prisma.delivery.create({
          data: deliveryData
        });
        
        console.log(`  📦 Created delivery: ${delivery.quantity}L on ${delivery.date.toDateString()}`);
      }
    }
    
    console.log('\n🎉 Test data created successfully!');
    console.log('📊 You can now log in as operator to see the filtered data.');
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData(); 