import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:3000';

export async function GET() {
  try {
    console.log('Fetching services from:', `${API_URL}/services`);
    const response = await fetch(`${API_URL}/services`);
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
