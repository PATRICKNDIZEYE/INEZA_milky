const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createOperator() {
  try {
    // First, let's check if we have any collection centers
    const collectionCenters = await prisma.collectionCenter.findMany();
    
    if (collectionCenters.length === 0) {
      console.log('No collection centers found. Creating a default one...');
      
      const defaultCenter = await prisma.collectionCenter.create({
        data: {
          name: 'Main Collection Center',
          code: 'MCC001',
          location: 'Kigali',
          address: 'Kigali, Rwanda',
          phone: '+250788123456',
          manager: 'John Doe',
          capacity: 10000,
          isActive: true
        }
      });
      
      console.log('Created default collection center:', defaultCenter.name);
    }
    
    // Get the first collection center (or the one we just created)
    const collectionCenter = await prisma.collectionCenter.findFirst();
    
    if (!collectionCenter) {
      throw new Error('No collection center available');
    }
    
    // Check if operator already exists
    const existingOperator = await prisma.user.findFirst({
      where: {
        email: 'operator@dairysystem.com'
      }
    });
    
    if (existingOperator) {
      console.log('Operator already exists. Updating collection center assignment...');
      
      await prisma.user.update({
        where: { id: existingOperator.id },
        data: {
          collectionCenterId: collectionCenter.id
        }
      });
      
      console.log('Updated operator with collection center assignment');
      return;
    }
    
    // Create operator user
    const hashedPassword = await bcrypt.hash('operator123', 12);
    
    const operator = await prisma.user.create({
      data: {
        email: 'operator@dairysystem.com',
        username: 'operator',
        name: 'Test Operator',
        password: hashedPassword,
        role: 'OPERATOR',
        isActive: true,
        collectionCenterId: collectionCenter.id
      }
    });
    
    console.log('✅ Operator created successfully!');
    console.log('📧 Email: operator@dairysystem.com');
    console.log('🔑 Password: operator123');
    console.log('🏢 Collection Center: ' + collectionCenter.name);
    console.log('👤 Role: OPERATOR');
    
  } catch (error) {
    console.error('❌ Error creating operator:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOperator(); 