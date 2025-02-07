import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const container = await getContainer('english-news');
    console.log('Querying news...');
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

export async function POST(request: NextRequest) {
  try {
    const container = await getContainer('english-news');
    console.log('Parsing request body...');
    const body = await request.json();

    console.log('2. Creating news item...');
    const newsItem = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(newsItem);
    console.log('3. Creation completed successfully');
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating news:', error);
    let errorMessage = 'Failed to create news';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const container = await getContainer('english-news');
    console.log('Parsing request body...');
    const body = await request.json();
    const { id, ...updateData } = body;

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
      ...updateData,
      updatedAt: new Date().toISOString(),
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

export async function PATCH(request: NextRequest) {
  try {
    const container = await getContainer('english-news');
    console.log('Parsing request body...');
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
    const container = await getContainer('english-news');
    console.log('Parsing request body...');
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
