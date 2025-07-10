import * as XLSX from 'xlsx';
import { prisma } from './prisma';

export async function generateSalesReport(startDate: Date, endDate: Date) {
  // Fetch deliveries within the date range
  const deliveries = await prisma.delivery.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      farmer: true,
      collectionCenter: true,
    },
    orderBy: { date: 'asc' },
  });

  // Fetch payments for the farmers in the deliveries (optional, for payment status)
  const farmerIds = Array.from(new Set(deliveries.map(d => d.farmerId)));
  const payments = await prisma.payment.findMany({
    where: {
      farmerId: { in: farmerIds },
      paymentDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Map farmerId+period to payment status for quick lookup
  const paymentMap = new Map();
  for (const payment of payments) {
    paymentMap.set(payment.farmerId + payment.period, payment.status);
  }

  const reportData = deliveries.map(delivery => {
    // Try to find a payment for this delivery's farmer and period (if period logic applies)
    // Here, we just show the latest payment status for the farmer in the date range
    const paymentStatus = payments.find(p => p.farmerId === delivery.farmerId)?.status || 'N/A';
    return {
      'Delivery ID': delivery.id,
      'Farmer Name': delivery.farmer.name,
      'Collection Center': delivery.collectionCenter.name,
      'Delivery Date': delivery.date.toLocaleDateString(),
      'Quantity (L)': delivery.quantity,
      'Quality': delivery.quality,
      'Payment Status': paymentStatus,
    };
  });

  return reportData;
}

export async function generateInventoryReport() {
  // Group deliveries by collection center and sum quantities
  const centers = await prisma.collectionCenter.findMany({
    include: {
      deliveries: true,
    },
  });

  const reportData = centers.map((center: any) => ({
    'Collection Center': center.name,
    'Location': center.location,
    'Total Deliveries (L)': center.deliveries.reduce((sum: number, d: any) => sum + d.quantity, 0),
    'Number of Deliveries': center.deliveries.length,
    'Last Updated': center.updatedAt ? center.updatedAt.toLocaleDateString() : 'N/A',
  }));

  return reportData;
}

export async function generateCustomerReport() {
  // Use farmer as the customer entity (lowercase)
  const farmers = await prisma.farmer.findMany({
    include: {
      deliveries: true,
      payments: true,
    },
  });

  const reportData = farmers.map((farmer: any) => {
    const totalOrders = farmer.deliveries.length;
    const totalSpent = farmer.payments.reduce((sum: number, payment: any) => sum + payment.totalAmount, 0);
    return {
      'Farmer Name': farmer.name,
      'Phone': farmer.phone,
      'Email': farmer.email || 'N/A',
      'Total Deliveries': totalOrders,
      'Total Paid': `$${totalSpent.toFixed(2)}`,
      'Join Date': farmer.joinDate ? farmer.joinDate.toLocaleDateString() : 'N/A',
    };
  });

  return reportData;
}

export function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  
  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key]).length)) + 2
  }));
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}