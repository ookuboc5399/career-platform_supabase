import { NextRequest, NextResponse } from 'next/server';
import { getEnglishBusinessContainer } from '@/lib/cosmos-db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getEnglishBusinessContainer();
    const data = await request.json();

    const { resource: existingContent } = await container.item(params.id, params.id).read();
    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const updatedContent = {
      ...existingContent,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(params.id, params.id).replace(updatedContent);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating business content:', error);
    return NextResponse.json(
      { error: 'Failed to update business content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getEnglishBusinessContainer();
    await container.item(params.id, params.id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting business content:', error);
    return NextResponse.json(
      { error: 'Failed to delete business content' },
      { status: 500 }
    );
  }
}
