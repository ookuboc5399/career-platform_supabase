import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT || '',
  key: process.env.COSMOS_KEY || '',
});

const database = client.database('career-platform');
const container = database.container('english-questions');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { resource: question } = await container
      .item(params.id, params.id)
      .read();

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { resource: existingQuestion } = await container
      .item(params.id, params.id)
      .read();

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const updatedQuestion = {
      ...existingQuestion,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const { resource: result } = await container
      .item(params.id, params.id)
      .replace(updatedQuestion);

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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await container.item(params.id, params.id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
