import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import { auth } from '@/app/auth.config';
import { EnglishProgress } from '@/types/english';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || '',
});

const database = client.database('career-platform');
const container = database.container('english-progress');

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const progress: EnglishProgress = {
      id: `progress-${Date.now()}`,
      userId: session.user.id,
      type: body.type,
      category: body.category,
      questions: body.questions,
      score: body.score,
      totalQuestions: body.totalQuestions,
      createdAt: new Date().toISOString(),
    };

    const { resource: createdProgress } = await container.items.create({
      ...progress,
      partitionKey: session.user.id // パーティションキーとしてuserIdを使用
    });
    return NextResponse.json(createdProgress);
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    let querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId',
      parameters: [
        {
          name: '@userId',
          value: session.user.id
        }
      ]
    };

    if (type) {
      querySpec.query += ' AND c.type = @type';
      querySpec.parameters.push({
        name: '@type',
        value: type
      });
    }

    if (category) {
      querySpec.query += ' AND c.category = @category';
      querySpec.parameters.push({
        name: '@category',
        value: category
      });
    }

    querySpec.query += ' ORDER BY c.createdAt DESC';

    const { resources: progress } = await container.items
      .query(querySpec)
      .fetchAll();

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
