import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});
const database = client.database('career-platform');
const container = database.container('certification-questions');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // 特定の資格の問題を取得
    const querySpec = {
      query: "SELECT * FROM c WHERE c.certificationId = @certificationId ORDER BY c.questionNumber",
      parameters: [
        {
          name: "@certificationId",
          value: id
        }
      ]
    };

    const { resources: questions } = await container.items.query(querySpec).fetchAll();
    return NextResponse.json(questions || []);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const questionData = await request.json();

    // 最新の問題番号を取得
    const querySpec = {
      query: "SELECT VALUE MAX(c.questionNumber) FROM c WHERE c.certificationId = @certificationId",
      parameters: [
        {
          name: "@certificationId",
          value: id
        }
      ]
    };
    const { resources: [maxQuestionNumber] } = await container.items.query(querySpec).fetchAll();

    const newQuestion = {
      id: crypto.randomUUID(),
      certificationId: id,
      questionNumber: (maxQuestionNumber || 0) + 1,
      ...questionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { resource: createdQuestion } = await container.items.create(newQuestion);
    return NextResponse.json(createdQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const questionData = await request.json();
    const questionId = questionData.id;

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const updatedQuestion = {
      ...questionData,
      updatedAt: new Date().toISOString()
    };

    const { resource: result } = await container.item(questionId, questionData.certificationId).replace(updatedQuestion);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // 問題を取得して削除
    const { resource: question } = await container.item(questionId, id).read();
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    await container.item(questionId, id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
