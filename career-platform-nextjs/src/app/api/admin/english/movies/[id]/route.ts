import { NextRequest, NextResponse } from 'next/server';
import { getEnglishMoviesContainer } from '@/lib/cosmos-db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getEnglishMoviesContainer();
    const data = await request.json();

    const { resource: existingMovie } = await container.item(params.id, params.id).read();
    if (!existingMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    const updatedMovie = {
      ...existingMovie,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(params.id, params.id).replace(updatedMovie);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await getEnglishMoviesContainer();
    await container.item(params.id, params.id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
