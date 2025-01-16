import { NextRequest, NextResponse } from 'next/server';
import { EnglishContent } from '@/types/api';

// 仮のデータストア
const mockContent: { [key: string]: EnglishContent } = {
  'movie-1': {
    id: 'movie-1',
    title: 'The Social Network',
    description: 'Facebookの創設者マーク・ザッカーバーグの物語から学ぶビジネス英語',
    type: 'movie',
    difficulty: 'intermediate',
    videoUrl: 'https://example.com/videos/social-network.mp4',
    imageUrl: 'https://example.com/images/social-network.jpg',
    exercises: [
      {
        id: '1',
        question: 'What is the main theme of this movie?',
        choices: [
          { id: '1', text: 'The creation of Facebook' },
          { id: '2', text: 'College life at Harvard' },
          { id: '3', text: 'Programming skills' },
          { id: '4', text: 'Business partnerships' }
        ],
        correctAnswer: 0,
        explanation: 'The movie primarily focuses on the creation and early days of Facebook, including the legal battles and personal conflicts that arose during this period.',
      },
      {
        id: '2',
        question: 'What business lesson can we learn from the movie?',
        choices: [
          { id: '1', text: 'Innovation is key to success' },
          { id: '2', text: 'Trust is important in partnerships' },
          { id: '3', text: 'Protect your intellectual property' },
          { id: '4', text: 'All of the above' }
        ],
        correctAnswer: 3,
        explanation: 'The movie teaches multiple business lessons including the importance of innovation, trust in business relationships, and protecting intellectual property rights.',
      }
    ],
    resources: [
      {
        title: 'The Real Story Behind Facebook',
        url: 'https://example.com/articles/facebook-history',
        type: 'article'
      },
      {
        title: 'Business English Vocabulary Guide',
        url: 'https://example.com/docs/business-english.pdf',
        type: 'document'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 仮の実装（開発用）
    const content = mockContent[params.id];
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const content = await getContent(params.id);
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(content);
    */
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, type, difficulty, videoUrl, imageUrl, content, exercises, resources } = body;

    // 仮の実装（開発用）
    const existingContent = mockContent[params.id];
    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const updatedContent: EnglishContent = {
      ...existingContent,
      title: title || existingContent.title,
      description: description || existingContent.description,
      type: type || existingContent.type,
      difficulty: difficulty || existingContent.difficulty,
      videoUrl: videoUrl || existingContent.videoUrl,
      imageUrl: imageUrl || existingContent.imageUrl,
      content: content || existingContent.content,
      exercises: exercises?.map((e: any, index: number) => ({
        ...e,
        id: `${params.id}-e${index + 1}`,
        choices: e.choices.map((c: any, cIndex: number) => ({
          ...c,
          id: `${params.id}-e${index + 1}-c${cIndex + 1}`,
        })),
      })) || existingContent.exercises,
      resources: resources || existingContent.resources,
      updatedAt: new Date().toISOString(),
    };

    mockContent[params.id] = updatedContent;
    return NextResponse.json(updatedContent);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const updatedContent = await updateContent(params.id, {
      title,
      description,
      type,
      difficulty,
      videoUrl,
      imageUrl,
      content,
      exercises,
      resources,
    });
    return NextResponse.json(updatedContent);
    */
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 仮の実装（開発用）
    if (!mockContent[params.id]) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    delete mockContent[params.id];
    return new NextResponse(null, { status: 204 });

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    await deleteContent(params.id);
    return new NextResponse(null, { status: 204 });
    */
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
