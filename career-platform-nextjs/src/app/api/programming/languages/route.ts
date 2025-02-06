import { NextResponse } from 'next/server';
import { programmingContainer as container, initializeDatabase } from '@/lib/cosmos-db';

export async function GET() {
  try {
    if (!container) await initializeDatabase();
    const { resources: languages } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.type IN ("language", "framework", "ai-platform")',
      })
      .fetchAll();

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const language = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!container) await initializeDatabase();
    const { resource: createdLanguage } = await container.items.create(language);
    return NextResponse.json(createdLanguage);
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create language' },
      { status: 500 }
    );
  }
}
