import { NextRequest, NextResponse } from 'next/server';
import { mockCertifications } from '../../../route';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string; chapterId: string } }
) {
  try {
    const certification = mockCertifications.find(c => c.id === context.params.id);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    const chapterIndex = certification.chapters?.findIndex(
      c => c.id === context.params.chapterId
    );

    if (chapterIndex === undefined || chapterIndex === -1) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    certification.chapters?.splice(chapterIndex, 1);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
