import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || '',
});

const database = client.database('career-platform');
const container = database.container('english-questions');

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // 既存の問題を取得
    const { resource: existingQuestion } = await container.item(id, id).read();
    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // 問題を更新
    const { resource: updatedQuestion } = await container.item(id, body.englishId || id).replace({
      ...existingQuestion,
      ...body,
      id, // IDは変更しない
      englishId: body.englishId || id, // 新しいenglishIdがあれば使用、なければidを使用
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 問題を削除
    const { resource: existingQuestion } = await container.item(id, id).read();
    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    await container.item(id, existingQuestion.englishId || id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
