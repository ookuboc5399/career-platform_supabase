import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
});

const database = client.database('career-platform');
const container = database.container('english-business');

export async function GET() {
  try {
    const { resources: contents } = await container.items
      .query('SELECT * FROM c ORDER BY c.title')
      .fetchAll();

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching business contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business contents' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const content = await req.json();

    // Generate unique ID if not provided
    if (!content.id) {
      content.id = `business-${Date.now()}`;
    }

    const { resource: createdContent } = await container.items.create(content);

    return NextResponse.json(createdContent);
  } catch (error) {
    console.error('Error creating business content:', error);
    return NextResponse.json(
      { error: 'Failed to create business content' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const content = await req.json();

    if (!content.id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const { resource: updatedContent } = await container
      .item(content.id, content.id)
      .replace(content);

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating business content:', error);
    return NextResponse.json(
      { error: 'Failed to update business content' },
      { status: 500 }
    );
  }
}
