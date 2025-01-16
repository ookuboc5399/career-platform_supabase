import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
  console.error('Cosmos DB credentials are not configured');
}

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || '',
});

const database = client.database('career-platform');
const container = database.container('universities');

// GET /api/universities/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching university by ID:', params.id);
    const { resource } = await container.item(params.id, params.id).read();
    if (!resource) {
      console.log('University not found:', params.id);
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }
    console.log('University fetched successfully:', resource);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

// PUT /api/universities/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Updating university:', params.id);
    const data = await request.json();
    const { resource: existingUniversity } = await container.item(params.id, params.id).read();
    
    if (!existingUniversity) {
      console.log('University not found:', params.id);
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    const updatedUniversity = { ...existingUniversity, ...data };
    const { resource } = await container.item(params.id, params.id).replace(updatedUniversity);
    console.log('University updated successfully:', resource);
    
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

// DELETE /api/universities/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting university:', params.id);
    await container.item(params.id, params.id).delete();
    console.log('University deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    );
  }
}
