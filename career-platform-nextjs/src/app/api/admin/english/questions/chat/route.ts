import { NextResponse } from 'next/server';
import { QuestionContent } from '@/types/english';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, type } = body;

    const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_ID}/chat/completions?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_KEY || '',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `あなたは英語学習のための問題を作成する教師です。
            ユーザーの指示に基づいて、以下の形式で問題を生成してください：

            {
              "questions": [
                {
                  "question": "問題文",
                  "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
                  "correctAnswers": [正解の番号（1から4）],
                  "explanation": "解説（日本語で詳しく説明）"
                }
              ]
            }

            問題のタイプ: ${type === 'grammar' ? '文法' : type === 'vocabulary' ? '単語' : '英作文'}
            
            注意点：
            1. 問題は複数生成してください（5-10問程度）
            2. 選択肢は4つ用意してください
            3. 解説は日本語で、なぜその答えが正解なのかを詳しく説明してください
            4. 文法問題の場合は、関連する文法規則も説明してください
            5. 単語問題の場合は、類義語や用例も含めてください
            6. 英作文問題の場合は、模範解答とポイントを説明してください`
          },
          ...messages,
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const result = await response.json();
    const content = result.choices[0].message?.content;

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        message: '問題を生成しました。',
        questions: parsed.questions,
      });
    } catch (error) {
      console.error('Error parsing questions:', error);
      return NextResponse.json({
        message: content,
        questions: [],
      });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
