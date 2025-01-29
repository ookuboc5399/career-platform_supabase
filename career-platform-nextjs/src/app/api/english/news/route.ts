import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});
const database = client.database('career-platform');
const container = database.container('english-news');

export async function GET(request: NextRequest) {
  try {
    console.log('1. Initializing database connection...');
    if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
      throw new Error('Database credentials are not configured');
    }

    console.log('2. Querying news...');
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
      })
      .fetchAll();

    console.log('3. Query completed successfully');
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching news:', error);
    let errorMessage = 'Failed to fetch news';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('1. Parsing request body...');
    const body = await request.json();
    const { id, isPublished, publishedAt } = body;

    if (!id) {
      throw new Error('News ID is required');
    }

    console.log('2. Reading news item...', { id });
    const { resource } = await container.item(id, id).read();
    if (!resource) {
      throw new Error('News not found');
    }

    console.log('3. Updating news item...');
    const updatedNews = {
      ...resource,
      isPublished,
      publishedAt,
    };

    const { resource: result } = await container.item(id, id).replace(updatedNews);
    console.log('4. Update completed successfully');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating news:', error);
    let errorMessage = 'Failed to update news';
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

export async function DELETE(request: NextRequest) {
  try {
    console.log('1. Parsing request body...');
    const body = await request.json();
    const { id } = body;

    if (!id) {
      throw new Error('News ID is required');
    }

    console.log('2. Checking if news exists...', { id });
    const { resource } = await container.item(id, id).read();
    if (!resource) {
      throw new Error('News not found');
    }

    console.log('3. Deleting news item...');
    await container.item(id, id).delete();
    console.log('4. Delete completed successfully');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting news:', error);
    let errorMessage = 'Failed to delete news';
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
