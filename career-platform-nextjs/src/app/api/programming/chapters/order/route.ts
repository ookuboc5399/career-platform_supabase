import { NextRequest, NextResponse } from 'next/server';
import { updateProgrammingChaptersOrder } from '@/lib/cosmos-db';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { languageId, chapters } = body;

    if (!languageId || !chapters || !Array.isArray(chapters)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    await updateProgrammingChaptersOrder(languageId, chapters);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating chapter order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update chapter order' },
      { status: 500 }
    );
  }
}
