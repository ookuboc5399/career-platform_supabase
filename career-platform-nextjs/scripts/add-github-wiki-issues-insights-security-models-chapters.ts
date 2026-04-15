/**
 * GitHub Wiki, Issues, Insights, Security, Models チャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-wiki-issues-insights-security-models-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CHAPTERS = [
  {
    id: 'github-wiki',
    title: 'GitHub Wiki',
    description: 'リポジトリに紐づいたドキュメントを Markdown で作成・編集する Wiki 機能の概要と活用方法を学びます。',
    order: 20,
  },
  {
    id: 'github-issues',
    title: 'GitHub Issues',
    description: 'バグ報告、機能要望、タスク管理を行う Issues の基本と、ラベル・マイルストーン・テンプレートの活用を学びます。',
    order: 21,
  },
  {
    id: 'github-insights',
    title: 'GitHub Insights',
    description: 'リポジトリや Organization の活動を可視化する Insights の概要と、Pulse、Contributors、Traffic などの分析機能を学びます。',
    order: 22,
  },
  {
    id: 'github-security',
    title: 'GitHub Security',
    description: 'Security タブの構成、Dependabot、Code scanning、Secret scanning、SECURITY.md の設定を学びます。',
    order: 23,
  },
  {
    id: 'github-models',
    title: 'GitHub Models',
    description: 'Copilot で利用される AI モデルと、API のデータモデルについて学びます。',
    order: 24,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  for (const ch of CHAPTERS) {
    const { data, error } = await supabase
      .from('programming_chapters')
      .upsert(
        {
          id: ch.id,
          language_id: 'github',
          parent_id: null,
          title: ch.title,
          description: ch.description,
          order: ch.order,
          status: 'published',
          exercises: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select();

    if (error) {
      console.error(`エラー (${ch.id}):`, error);
      continue;
    }
    console.log(`✓ ${ch.id} を追加しました`);
  }

  console.log('\nチャプターの追加が完了しました。');
}

main();
