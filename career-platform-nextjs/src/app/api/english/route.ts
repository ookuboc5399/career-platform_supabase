import { NextRequest, NextResponse } from 'next/server';
import { EnglishContent } from '@/types/api';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// 仮のデータストア（フォールバック用）
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
      }
    ],
    resources: [
      {
        title: 'The Real Story Behind Facebook',
        url: 'https://example.com/articles/facebook-history',
        type: 'article'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  'news-1': {
    id: 'news-1',
    title: 'Tech Industry Trends',
    description: 'テクノロジー業界の最新トレンドを英語で学ぶ',
    type: 'news',
    difficulty: 'advanced',
    content: '# Latest Tech Trends\n\nArtificial Intelligence and Machine Learning continue to dominate...',
    exercises: [
      {
        id: '1',
        question: 'What is the main focus of current tech trends?',
        choices: [
          { id: '1', text: 'Artificial Intelligence' },
          { id: '2', text: 'Blockchain' },
          { id: '3', text: 'Cloud Computing' },
          { id: '4', text: 'Cybersecurity' }
        ],
        correctAnswer: 0,
        explanation: 'AI and Machine Learning are currently the most dominant trends in the tech industry.',
      }
    ],
    resources: [
      {
        title: 'Tech Industry Glossary',
        url: 'https://example.com/docs/tech-glossary.pdf',
        type: 'document'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');

    try {
      const [moviesRes, newsRes] = await Promise.all([
        supabaseAdmin!.from('english_movies').select('*'),
        supabaseAdmin!.from('english_news').select('*'),
      ]);

      let resources: EnglishContent[] = [];

      const toContent = (row: { id: string; title?: string; content?: unknown; type?: string; difficulty?: string; created_at?: string; updated_at?: string }) => {
        const c = typeof row.content === 'object' && row.content ? row.content as Record<string, unknown> : {};
        return {
          id: row.id,
          title: row.title ?? c.title ?? '',
          description: c.description ?? '',
          type: row.type ?? c.type ?? 'movie',
          difficulty: row.difficulty ?? c.difficulty ?? 'intermediate',
          videoUrl: c.videoUrl ?? '',
          imageUrl: c.imageUrl ?? '',
          content: c.content ?? '',
          exercises: c.exercises ?? [],
          resources: c.resources ?? [],
          createdAt: row.created_at ?? c.createdAt ?? '',
          updatedAt: row.updated_at ?? c.updatedAt ?? '',
          ...c,
        } as EnglishContent;
      };

      const movies = (moviesRes.data ?? []).map(toContent);
      const news = (newsRes.data ?? []).map(toContent);
      resources = [...movies, ...news];

      if (type) resources = resources.filter((item) => item.type === type);
      if (difficulty) resources = resources.filter((item) => item.difficulty === difficulty);

      return NextResponse.json(resources);
    } catch (dbError) {
      console.error('Database error:', dbError);
      let content = Object.values(mockContent);
      if (type) content = content.filter((item) => item.type === type);
      if (difficulty) content = content.filter((item) => item.difficulty === difficulty);
      return NextResponse.json(content);
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, difficulty, videoUrl, imageUrl, content, exercises, resources } = body;

    try {
      const now = new Date().toISOString();
      const id = `${type}-${Date.now()}`;

      const newContent: EnglishContent = {
        id,
        title,
        description,
        type,
        difficulty,
        videoUrl,
        imageUrl,
        content,
        exercises: (exercises ?? []).map((e: { id?: string; choices?: unknown[] }, index: number) => ({
          ...e,
          id: e.id ?? `${id}-e${index + 1}`,
          choices: ((e.choices ?? []) as { id?: string }[]).map((c, cIndex) => ({
            ...c,
            id: c.id ?? `${id}-e${index + 1}-c${cIndex + 1}`,
          })),
        })),
        resources: resources ?? [],
        createdAt: now,
        updatedAt: now,
      };

      const table = type === 'news' ? 'english_news' : 'english_movies';
      const { data, error } = await supabaseAdmin!.from(table).insert({
        id,
        title,
        content: newContent,
        type,
        difficulty,
        created_at: now,
        updated_at: now,
      }).select().single();

      if (error) throw error;
      const row = data as { id: string; title?: string; content?: unknown; type?: string; difficulty?: string; created_at?: string; updated_at?: string };
      const c = typeof row.content === 'object' && row.content ? row.content as Record<string, unknown> : {};
      return NextResponse.json({
        id: row.id,
        ...c,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      const id = `${type}-${Object.keys(mockContent).length + 1}`;
      const now = new Date().toISOString();
      const newContent = { id, title, description, type, difficulty, videoUrl, imageUrl, content, exercises, resources, createdAt: now, updatedAt: now };
      mockContent[id] = newContent as EnglishContent;
      return NextResponse.json(newContent);
    }
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
