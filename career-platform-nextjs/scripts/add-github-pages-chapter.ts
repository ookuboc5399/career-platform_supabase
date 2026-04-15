/**
 * GitHub に「GitHub Pages」メインチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-pages-chapter.ts
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
        id: 'github-pages',
        language_id: 'github',
        parent_id: null,
        title: 'GitHub Pages',
        description:
          'リポジトリの静的ファイルをWebサイトとして公開するGitHub Pagesの概要と、基本的な公開手順を学びます。',
        order: 4,
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
  console.log('✓ GitHub Pages メインチャプターを追加しました:', data);
}

main();
