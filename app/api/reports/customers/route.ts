import { NextRequest, NextResponse } from 'next/server';
import { generateCustomerReport } from '@/lib/reports';

export async function GET(request: NextRequest) {
  try {
    const reportData = await generateCustomerReport();
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Customer report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate customer report' },
      { status: 500 }
    );
  }
}