import { NextRequest, NextResponse } from 'next/server';
import { CertificationChapter, CertificationQuestion, Choice } from '@/types/api';

// 仮のデータストア
const mockChapters: { [key: string]: CertificationChapter } = {
  '1': {
    id: '1',
    certificationId: 'aws-saa',
    title: 'クラウドの基礎概念',
    description: 'AWSクラウドの基本的な概念と用語について学びます',
    videoUrl: 'https://example.com/videos/aws-basics.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/aws-basics.jpg',
    duration: '30分',
    order: 1,
    status: 'published',
    content: '# クラウドコンピューティングとは\n\nクラウドコンピューティングは...',
    questions: [
      {
        id: '1',
        question: 'クラウドコンピューティングの主な利点は何ですか？',
        choices: [
          { id: '1', text: '初期投資が少なく済む' },
          { id: '2', text: '柔軟なスケーリングが可能' },
          { id: '3', text: '地理的な冗長性が確保できる' },
          { id: '4', text: '従量課金制で費用対効果が高い' }
        ],
        correctAnswer: 1,
        explanation: '初期投資を抑えられることが最大の利点です。',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    // 仮の実装（開発用）
    const chapter = mockChapters[params.chapterId];
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const chapter = await getChapter(params.chapterId);
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(chapter);
    */
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const body = await request.json();
    const { title, description, videoUrl, thumbnailUrl, duration, content, questions, status } = body;

    // 仮の実装（開発用）
    const chapter = mockChapters[params.chapterId];
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    const updatedChapter: CertificationChapter = {
      ...chapter,
      title: title || chapter.title,
      description: description || chapter.description,
      videoUrl: videoUrl || chapter.videoUrl,
      thumbnailUrl: thumbnailUrl || chapter.thumbnailUrl,
      duration: duration || chapter.duration,
      content: content || chapter.content,
      questions: questions?.map((q: Omit<CertificationQuestion, 'id'>, index: number) => ({
        ...q,
        id: `${chapter.id}-q${index + 1}`,
        choices: q.choices.map((c: Omit<Choice, 'id'>, cIndex: number) => ({
          ...c,
          id: `${chapter.id}-q${index + 1}-c${cIndex + 1}`,
        })),
      })) || chapter.questions,
      status: status || chapter.status,
      updatedAt: new Date().toISOString(),
    };

    mockChapters[params.chapterId] = updatedChapter;
    return NextResponse.json(updatedChapter);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const updatedChapter = await updateChapter(params.chapterId, {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      content,
      questions,
      status,
    });
    return NextResponse.json(updatedChapter);
    */
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    // 仮の実装（開発用）
    if (!mockChapters[params.chapterId]) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    delete mockChapters[params.chapterId];
    return new NextResponse(null, { status: 204 });

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    await deleteChapter(params.chapterId);
    return new NextResponse(null, { status: 204 });
    */
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
