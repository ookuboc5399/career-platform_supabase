import { NextRequest, NextResponse } from 'next/server';

interface Exercise {
  title: string;
  description: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

interface Chapter {
  id: string;
  languageId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

// 仮のデータストア
const mockChapters: { [key: string]: Chapter[] } = {
  'python': [
    {
      id: '1',
      languageId: 'python',
      title: '環境構築',
      description: '開発環境のセットアップと基本的なツールの使い方',
      videoUrl: 'https://example.com/videos/python-setup.mp4',
      duration: '30分',
      order: 1,
      status: 'published',
      exercises: [
        {
          title: 'Pythonのインストール確認',
          description: 'インストールされたPythonのバージョンを確認してください。',
          testCases: [
            {
              input: 'python --version',
              expectedOutput: 'Python 3',
            },
          ],
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-14T00:00:00Z',
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const chapters = mockChapters[languageId] || [];
    return NextResponse.json(chapters);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const chapters = await getChaptersByLanguage(languageId);
    return NextResponse.json(chapters);
    */
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { languageId, title, description, videoUrl, duration, exercises } = body;

    if (!languageId || !title || !description || !videoUrl || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 仮の実装（開発用）
    const newChapter: Chapter = {
      id: Date.now().toString(),
      languageId,
      title,
      description,
      videoUrl,
      duration,
      order: (mockChapters[languageId]?.length || 0) + 1,
      status: 'draft',
      exercises: exercises || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!mockChapters[languageId]) {
      mockChapters[languageId] = [];
    }
    mockChapters[languageId].push(newChapter);

    return NextResponse.json(newChapter);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const chapter = await createChapter({
      languageId,
      title,
      description,
      videoUrl,
      duration,
      exercises,
    });
    return NextResponse.json(chapter);
    */
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
}
