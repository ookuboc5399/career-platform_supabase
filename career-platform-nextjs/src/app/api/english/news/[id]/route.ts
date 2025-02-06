import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});
const database = client.database('career-platform');
const container = database.container('english-news');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('1. Initializing database connection...');
    if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
      throw new Error('Database credentials are not configured');
    }

    const id = params.id;
    console.log('2. Fetching news item...', { id });

    const { resource } = await container.item(id, id).read();
    if (!resource) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    console.log('3. News item found');
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching news:', error);
    let errorMessage = 'Failed to fetch news';
    let status = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage === 'News not found') {
        status = 404;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
