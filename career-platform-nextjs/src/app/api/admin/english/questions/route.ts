import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || '',
});

const database = client.database('career-platform');
const container = database.container('english-questions');

export async function GET() {
  try {
    const { resources: questions } = await container.items
      .query('SELECT * FROM c')
      .fetchAll();

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const question = {
      id: `question-${Date.now()}`,
      englishId: `question-${Date.now()}`, // パーティションキーとして使用
      createdAt: new Date().toISOString(),
      ...body,
    };

    const { resource: createdQuestion } = await container.items.create(question);

    return NextResponse.json(createdQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
