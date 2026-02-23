import { NextResponse } from 'next/server';

const EXPRESS_API = process.env.NEXT_PUBLIC_EXPRESS_API_URL || process.env.EXPRESS_API_URL || 'http://localhost:3001';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${EXPRESS_API}/api/universities/${params.id}`);
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'University not found' }, { status: 404 });
      }
      throw new Error('Failed to fetch university');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const res = await fetch(`${EXPRESS_API}/api/universities/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'University not found' }, { status: 404 });
      }
      throw new Error('Failed to update university');
    }
    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update university' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${EXPRESS_API}/api/universities/${params.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: 'University not found' }, { status: 404 });
      }
      throw new Error('Failed to delete university');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete university' },
      { status: 500 }
    );
  }
}
