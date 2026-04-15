/**
 * GitHub Advanced Security に「Dependabot」サブチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-ghas-dependabot-chapter.ts
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
        id: 'github-ghas-dependabot',
        language_id: 'github',
        parent_id: 'github-1770333814514-4idy0to',
        title: 'Dependabot',
        description:
          '依存関係の脆弱性監視、Dependabot Alerts、自動セキュリティアップデート、定期的なバージョン更新について学びます。',
        order: 5,
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
  console.log('✓ Dependabot サブチャプターを追加しました:', data);
}

main();
