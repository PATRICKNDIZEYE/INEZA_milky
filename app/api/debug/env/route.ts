import { NextResponse } from 'next/server';

export async function GET() {
  // Only expose non-sensitive information
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET ? '***SET***' : '***NOT SET***',
    DATABASE_URL: process.env.DATABASE_URL ? '***SET***' : '***NOT SET***',
  };
  
  return NextResponse.json(envInfo);
}

export const dynamic = 'force-dynamic';
