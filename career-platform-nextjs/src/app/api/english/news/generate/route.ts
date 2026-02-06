import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを準備
    const requestBody = {
      type: 'news',
      timestamp: new Date().toISOString(),
    };

    // Expressサーバーにリクエストを転送
    const response = await fetch(`${process.env.EXPRESS_API_URL}/api/english/news/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('Express server error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Express server responded with status ${response.status}: ${errorText}`);
    }

    // SSEレスポンスをそのまま返す
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error forwarding request to Express:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to forward request to Express server',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
