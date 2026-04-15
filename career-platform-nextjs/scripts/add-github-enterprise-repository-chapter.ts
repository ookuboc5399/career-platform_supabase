/**
 * @deprecated チャプターは `github-enterprise-org-repositories` に統合。再編は
 * `restructure-github-enterprise-chapter-tree.ts` または migrate-github-enterprise-organizations-hub.sql を参照。
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
        id: 'github-enterprise-repository',
        language_id: 'github',
        parent_id: 'github-enterprise',
        title: 'リポジトリ運用',
        description:
          'リポジトリの作成ルール、基本設定、権限管理、ライフサイクル管理に関する運用ルールを学びます。',
        order: 3,
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
  console.log('✓ リポジトリ運用サブチャプターを追加しました:', data);
}

main();
