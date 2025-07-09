import { NextRequest, NextResponse } from 'next/server';
import { generateInventoryReport } from '@/lib/reports';

export async function GET(request: NextRequest) {
  try {
    const reportData = await generateInventoryReport();
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Inventory report generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate inventory report' },
      { status: 500 }
    );
  }
}