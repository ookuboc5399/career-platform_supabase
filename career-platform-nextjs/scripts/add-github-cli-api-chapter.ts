/**
 * GitHub に「GitHub CLI と API と SDKの使い分け」メインチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-cli-api-chapter.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('programming_chapters')
    .upsert(
      {
        id: 'github-cli-api',
        language_id: 'github',
        parent_id: null,
        title: 'GitHub CLI と API と SDKの使い分け',
        description:
          'GitHub CLI（gh）とGitHub API（REST）の使い分け、インストール・認証手順、よく使うコマンド例、PAT発行、curlでのAPI呼び出しを学びます。',
        order: 6,
        status: 'published',
        exercises: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select();

  if (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
  console.log('✓ GitHub CLI と API と SDKの使い分け メインチャプターを追加しました:', data);
}

main();
