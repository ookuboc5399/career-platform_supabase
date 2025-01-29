import { NextRequest, NextResponse } from 'next/server';
import { getEnglishNewsContainer } from '@/lib/cosmos-db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getEnglishNewsContainer();
    const data = await request.json();

    const { resource } = await container.item(params.id, params.id).read();
    if (!resource) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    const updatedNews = {
      ...resource,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const { resource: result } = await container.item(params.id, params.id).replace(updatedNews);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getEnglishNewsContainer();
    await container.item(params.id, params.id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
