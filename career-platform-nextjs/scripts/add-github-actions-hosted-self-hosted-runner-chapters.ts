/**
 * GitHub Actions に「ホステッドランナー」「セルフホステッドランナー」サブチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-actions-hosted-self-hosted-runner-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CHAPTERS = [
  {
    id: 'github-actions-hosted-runner',
    parent_id: 'github-1767002543754-i64d4wz',
    title: 'ホステッドランナー',
    description: 'GitHub が管理するランナー環境の概要、環境、利用料金、適用ケースを学びます。',
    order: 2,
  },
  {
    id: 'github-actions-self-hosted-runner',
    parent_id: 'github-1767002543754-i64d4wz',
    title: 'セルフホステッドランナー',
    description: '独自インフラで構築するランナーの概要、利点、環境要件、セキュリティ、ワークフロー設定を学びます。',
    order: 3,
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
          parent_id: ch.parent_id,
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

  console.log('\nサブチャプターの追加が完了しました。');
}

main();
