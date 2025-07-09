import { NextRequest, NextResponse } from 'next/server';
import SmsService, { formatDeliveryNotificationKinyarwanda } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, testType = 'delivery' } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    let message: string;
    
    if (testType === 'delivery') {
      message = formatDeliveryNotificationKinyarwanda('Test Farmer', 25, '15/12/2024');
    } else {
      message = 'Murakoze! Iyi ni SMS yo kugenzura. Thank you for testing!';
    }

    console.log('Sending test SMS to:', phoneNumber);
    console.log('Message:', message);

    const result = await SmsService.sendSms(phoneNumber, message);
    
    return NextResponse.json({
      success: true,
      message: 'Test SMS sent successfully',
      result
    });
    
  } catch (error: any) {
    console.error('Test SMS failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test SMS'
    }, { status: 500 });
  }
} 