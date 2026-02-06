import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});

const database = client.database('career-platform');
const container = database.container('english-questions');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    console.log('Database connection:', client);
    console.log('Database:', database);
    console.log('Container:', container);

    let query = "SELECT * FROM c WHERE c.type = 'reading'";
    const parameters: { name: string; value: string }[] = [];

    if (category && category !== 'all') {
      query += " AND c.content.category = @category";
      parameters.push({ name: '@category', value: category });
    }

    if (level && level !== 'all') {
      query += " AND c.content.level = @level";
      parameters.push({ name: '@level', value: level });
    }

    console.log('Query:', query);
    console.log('Parameters:', parameters);

    const { resources: questions } = await container.items
      .query({
        query,
        parameters
      })
      .fetchAll();

    console.log('Questions:', JSON.stringify(questions, null, 2));

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    // ランダムに1問選択
    const randomIndex = Math.floor(Math.random() * questions.length);
    return NextResponse.json(questions[randomIndex]);
  } catch (error) {
    console.error('Error fetching reading questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
