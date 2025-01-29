import { NextResponse } from 'next/server';
import { programmingContainer as container, initializeDatabase } from '@/lib/cosmos-db';

export async function GET() {
  try {
    if (!container) await initializeDatabase();
    const { resources: languages } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.type IN ("language", "framework")',
      })
      .fetchAll();

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const language = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!container) await initializeDatabase();
    const { resource: createdLanguage } = await container.items.create(language);
    return NextResponse.json(createdLanguage);
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create language' },
      { status: 500 }
    );
  }
}

// 初期データをインポートするためのユーティリティ関数
export async function importInitialLanguages() {
  const initialLanguages = [
    {
      id: 'python',
      title: 'Python入門',
      description: 'Pythonプログラミングの基礎から応用までを学ぶコース',
      type: 'language',
    },
    {
      id: 'javascript',
      title: 'JavaScript入門',
      description: 'Web開発に必要なJavaScriptの基礎を学ぶコース',
      type: 'language',
    },
    {
      id: 'react',
      title: 'React入門',
      description: 'モダンなWebフロントエンド開発のためのReactフレームワーク',
      type: 'framework',
    },
  ];

  for (const language of initialLanguages) {
    try {
      await container.items.create({
        ...language,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Error importing ${language.id}:`, error);
    }
  }
}
