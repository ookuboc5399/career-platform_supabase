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

// 仮のデータストア（実際にはchapters/route.tsと共有する必要があります）
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

export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    // 仮の実装（開発用）
    for (const chapters of Object.values(mockChapters)) {
      const chapter = chapters.find(c => c.id === params.chapterId);
      if (chapter) {
        return NextResponse.json(chapter);
      }
    }

    return NextResponse.json(
      { error: 'Chapter not found' },
      { status: 404 }
    );

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
    const { title, description, videoUrl, duration, status, exercises } = body;

    // 仮の実装（開発用）
    for (const languageId of Object.keys(mockChapters)) {
      const chapterIndex = mockChapters[languageId].findIndex(c => c.id === params.chapterId);
      if (chapterIndex !== -1) {
        const updatedChapter = {
          ...mockChapters[languageId][chapterIndex],
          title: title || mockChapters[languageId][chapterIndex].title,
          description: description || mockChapters[languageId][chapterIndex].description,
          videoUrl: videoUrl || mockChapters[languageId][chapterIndex].videoUrl,
          duration: duration || mockChapters[languageId][chapterIndex].duration,
          status: status || mockChapters[languageId][chapterIndex].status,
          exercises: exercises || mockChapters[languageId][chapterIndex].exercises,
          updatedAt: new Date().toISOString(),
        };
        mockChapters[languageId][chapterIndex] = updatedChapter;
        return NextResponse.json(updatedChapter);
      }
    }

    return NextResponse.json(
      { error: 'Chapter not found' },
      { status: 404 }
    );

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const chapter = await updateChapter(params.chapterId, {
      title,
      description,
      videoUrl,
      duration,
      status,
      exercises,
    });
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(chapter);
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
    for (const languageId of Object.keys(mockChapters)) {
      const chapterIndex = mockChapters[languageId].findIndex(c => c.id === params.chapterId);
      if (chapterIndex !== -1) {
        mockChapters[languageId].splice(chapterIndex, 1);
        // 順序を更新
        mockChapters[languageId].forEach((chapter, index) => {
          chapter.order = index + 1;
        });
        return new NextResponse(null, { status: 204 });
      }
    }

    return NextResponse.json(
      { error: 'Chapter not found' },
      { status: 404 }
    );

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
