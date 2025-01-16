import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Sending request to Express server:', {
      url: `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/images/generate`,
      prompt
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.error('Error response from Express server:', {
        status: response.status,
        statusText: response.statusText
      });
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('Success response from Express server:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in image generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
