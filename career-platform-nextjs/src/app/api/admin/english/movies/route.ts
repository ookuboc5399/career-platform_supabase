import { NextRequest, NextResponse } from 'next/server';
import { getEnglishMoviesContainer } from '@/lib/cosmos-db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const container = await getEnglishMoviesContainer();
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
      })
      .fetchAll();

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const container = await getEnglishMoviesContainer();
    
    const movie = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      isPublished: false,
    };

    await container.items.create(movie);
    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}
