import * as XLSX from 'xlsx';
import { prisma } from './prisma';

export async function generateSalesReport(startDate: Date, endDate: Date) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: 'DELIVERED',
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  const reportData = orders.map(order => ({
    'Order ID': order.id,
    'Customer Name': order.customer.name,
    'Customer Email': order.customer.email,
    'Order Date': order.createdAt.toLocaleDateString(),
    'Delivery Date': order.deliveryDate?.toLocaleDateString() || 'N/A',
    'Total Amount': `$${order.totalAmount.toFixed(2)}`,
    'Payment Status': order.payments[0]?.status || 'PENDING',
    'Items': order.items.map(item => `${item.product.name} (${item.quantity})`).join(', '),
  }));

  return reportData;
}

export async function generateInventoryReport() {
  const products = await prisma.product.findMany({
    include: {
      inventory: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  const reportData = products.map(product => ({
    'Product Name': product.name,
    'Category': product.category,
    'Current Stock': product.stockLevel,
    'Minimum Stock': product.minStock,
    'Status': product.stockLevel <= product.minStock ? 'LOW STOCK' : 'OK',
    'Base Price': `$${product.basePrice.toFixed(2)}`,
    'Last Updated': product.updatedAt.toLocaleDateString(),
  }));

  return reportData;
}

export async function generateCustomerReport() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: {
        where: { status: 'DELIVERED' },
      },
      payments: {
        where: { status: 'COMPLETED' },
      },
    },
  });

  const reportData = customers.map(customer => {
    const totalOrders = customer.orders.length;
    const totalSpent = customer.payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      'Customer Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone || 'N/A',
      'Total Orders': totalOrders,
      'Total Spent': `$${totalSpent.toFixed(2)}`,
      'Loyalty Points': customer.loyaltyPoints,
      'Join Date': customer.createdAt.toLocaleDateString(),
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