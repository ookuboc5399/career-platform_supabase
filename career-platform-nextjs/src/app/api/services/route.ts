import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Fetching services from:', `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/services`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/services`);
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Services data:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
