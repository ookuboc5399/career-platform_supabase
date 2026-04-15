import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const AI_LANGUAGES = [
  {
    id: 'claude',
    title: 'Claude (Anthropic)',
    description: 'AnthropicのAIアシスタント。高度な言語理解・生成能力を持ち、コーディング支援、文章作成、分析など幅広いタスクに活用できます。',
    type: 'ai-platform',
  },
  {
    id: 'codex',
    title: 'Codex (OpenAI)',
    description: 'OpenAIのコード生成AI。GitHubの膨大なコードで学習しており、コード補完・生成・変換・説明に特化した強力なモデルです。',
    type: 'ai-platform',
  },
];

export async function POST() {
  try {
    const now = new Date().toISOString();
    const results = [];

    for (const lang of AI_LANGUAGES) {
      // 既存チェック
      const { data: existing } = await supabaseAdmin
        .from('programming_languages')
        .select('id')
        .eq('id', lang.id)
        .single();

      if (existing) {
        results.push({ id: lang.id, status: 'skipped (already exists)' });
        continue;
      }

      const { data, error } = await supabaseAdmin
        .from('programming_languages')
        .insert({ ...lang, created_at: now, updated_at: now })
        .select()
        .single();

      if (error) {
        results.push({ id: lang.id, status: 'error', error: error.message });
      } else {
        results.push({ id: data.id, title: data.title, status: 'created' });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed AI languages' },
      { status: 500 }
    );
  }
}
