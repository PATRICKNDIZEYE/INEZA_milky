import { NextRequest, NextResponse } from 'next/server';
import { generateSalesReport } from '@/lib/reports';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to) : new Date();

    const reportData = await generateSalesReport(startDate, endDate);

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Sales report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate sales report' },
      { status: 500 }
    );
  }
}