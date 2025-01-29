import { NextRequest, NextResponse } from 'next/server';
import { getEnglishNewsContainer } from '@/lib/cosmos-db';

export async function GET() {
  try {
    const container = await getEnglishNewsContainer();
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
      })
      .fetchAll();

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
