import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createProgrammingChapter, getProgrammingChapters } from '@/lib/programming-data';
import { buildObsidianContextForTopic } from '@/lib/obsidian-vault-context';
import { getObsidianVaultRoot } from '@/lib/obsidian-paths';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedChapter {
  title: string;
  description: string;
  duration: string;
}

export async function POST(request: NextRequest) {
  try {
    const { languageId, languageName, topic } = await request.json();

    if (!languageId || !topic) {
      return NextResponse.json(
        { error: 'languageId and topic are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY が設定されていません。' },
        { status: 500 }
      );
    }

    // Obsidian Vault（GitHub-docs 同期含む）からキーワードに関連するノートを取得
    const vaultPath = getObsidianVaultRoot();
    const searchKeywords = [
      topic,
      languageName || languageId,
      ...topic.split(/[\s　、,]+/).filter((w: string) => w.length > 1),
    ];
    const obsidianContext =
      vaultPath && fs.existsSync(vaultPath)
        ? buildObsidianContextForTopic(vaultPath, searchKeywords)
        : '';

    const systemPrompt = `あなたはプログラミング学習コンテンツの専門家です。
学習カリキュラムを設計し、初学者から実践者まで段階的に学べるチャプター構成を作成します。
以下のJSON形式のみを返してください。説明文や前置きは不要です。

[
  {
    "title": "チャプタータイトル",
    "description": "このチャプターで学ぶ内容の説明（100〜150文字程度）",
    "duration": "30分"
  }
]`;

    const userPrompt = obsidianContext
      ? `「${languageName || languageId}」について「${topic}」というトピックで5〜8個の学習チャプターを作成してください。

以下は Obsidian Vault に同期した GitHub 公式ドキュメント（github/docs の content、主に英語）から抽出した抜粋です：
${obsidianContext}

要件：
- 上記ナレッジの内容も踏まえて、より実践的・具体的なチャプターにする（参照が英語でも、出力するチャプターは日本語）
- 初級から上級へ段階的に学べる構成
- durationは5分〜90分の範囲
- 日本語で記述`
      : `「${languageName || languageId}」について「${topic}」というトピックで5〜8個の学習チャプターを作成してください。

要件：
- 初級から上級へ段階的に学べる構成
- durationは5分〜90分の範囲
- 日本語で記述`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const rawText = completion.choices[0]?.message?.content || '';

    let generatedChapters: GeneratedChapter[];
    try {
      const parsed = JSON.parse(rawText);
      // response_format: json_object では配列がオブジェクトに包まれる場合がある
      generatedChapters = Array.isArray(parsed)
        ? parsed
        : parsed.chapters || parsed.data || Object.values(parsed)[0];
      if (!Array.isArray(generatedChapters)) throw new Error('chapters array not found');
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (!match) {
        throw new Error('レスポンスをJSONとして解析できませんでした');
      }
      generatedChapters = JSON.parse(match[0]);
    }

    // 既存チャプター数を取得して順序を決定
    const existingChapters = await getProgrammingChapters(languageId);
    const startOrder = existingChapters.length + 1;

    // 生成されたチャプターをDBに保存
    const savedChapters = await Promise.all(
      generatedChapters.map((ch, index) =>
        createProgrammingChapter({
          languageId,
          title: ch.title,
          description: ch.description,
          duration: ch.duration,
          order: startOrder + index,
          status: 'draft',
          exercises: [],
        })
      )
    );

    return NextResponse.json({
      chapters: savedChapters,
      usedObsidian: obsidianContext.length > 0,
    });
  } catch (error) {
    console.error('Error generating chapters:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'チャプターの生成に失敗しました' },
      { status: 500 }
    );
  }
}
