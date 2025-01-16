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

// GET /api/universities
export async function GET() {
  try {
    console.log('Fetching universities from Cosmos DB...');
    const { resources } = await container.items
      .query('SELECT * FROM c')
      .fetchAll();
    console.log('Universities fetched successfully:', resources);
    return NextResponse.json({ universities: resources });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

// POST /api/universities
export async function POST(request: Request) {
  try {
    console.log('Creating new university...');
    const data = await request.json();
    const id = Math.random().toString(36).substring(2, 15);
    const newUniversity = { ...data, id };
    
    const { resource } = await container.items.create(newUniversity);
    console.log('University created successfully:', resource);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}
