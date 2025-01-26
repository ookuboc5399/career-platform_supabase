import { NextRequest, NextResponse } from 'next/server';
import { certificationChaptersContainer, initializeDatabase } from '@/lib/cosmos-db';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string; chapterId: string } }
) {
  try {
    if (!certificationChaptersContainer) await initializeDatabase();

    const body = await request.json();
    console.log('Updating chapter:', {
      chapterId: context.params.chapterId,
      certificationId: context.params.id,
      body
    });

    const { resource } = await certificationChaptersContainer.item(context.params.chapterId, context.params.id).replace({
      id: context.params.chapterId,
      certificationId: context.params.id,
      ...body,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating chapter:', error);
    console.error('Error details:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to update chapter', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update chapter', details: 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string; chapterId: string } }
) {
  try {
    if (!certificationChaptersContainer) await initializeDatabase();

    await certificationChaptersContainer.item(context.params.chapterId, context.params.id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
