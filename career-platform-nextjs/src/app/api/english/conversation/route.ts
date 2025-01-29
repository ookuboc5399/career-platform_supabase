import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types/english';

interface ConversationRequest {
  message: string;
  systemPrompt: string;
  task: Task;
}

export async function POST(req: NextRequest) {
  try {
    const { message, systemPrompt, task }: ConversationRequest = await req.json();

    console.log('Received conversation request:', {
      message,
      systemPrompt,
      task: task.title,
    });

    // Azure OpenAI APIを使用して応答を生成
    const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY!,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({
      message: data.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error in conversation API:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    );
  }
}
