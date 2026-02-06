import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getContainer('english-news');
    const id = params.id;
    console.log('Fetching news item...', { id });

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getContainer('english-news');
    const id = params.id;

    if (!id) {
      throw new Error('News ID is required');
    }

    console.log('1. Checking if news exists...', { id });
    const { resource } = await container.item(id, id).read();
    if (!resource) {
      throw new Error('News not found');
    }

    console.log('2. Deleting news item...');
    await container.item(id, id).delete();
    console.log('3. Delete completed successfully');
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
