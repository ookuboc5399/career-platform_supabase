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
        id: 'github-enterprise-branch-merge',
        language_id: 'github',
        parent_id: 'github-enterprise',
        title: 'ブランチ運用とマージ手法',
        description:
          'GitHub Flowの採用、Squash and Mergeの強制、セキュアな開発ワークフロー、Repository Rulesetsによるルール強制を学びます。',
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
  console.log('✓ ブランチ運用とマージ手法サブチャプターを追加しました:', data);
}

main();
