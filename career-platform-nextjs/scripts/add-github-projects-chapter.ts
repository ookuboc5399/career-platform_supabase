/**
 * @deprecated ルートの `github-projects` は廃止し、`github-enterprise-org-projects` に統合済み。
 * リダイレクトは next.config.js。再現は migrate-github-projects-to-org-projects.sql を参照。
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
        id: 'github-projects',
        language_id: 'github',
        parent_id: null,
        title: 'GitHub Projects',
        description:
          'GitHub Projectsの概要、サイドバーで設定できること、プロジェクト作成・タスク追加・ビュー切り替え・カスタムフィールドの手順を学びます。',
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
  console.log('✓ GitHub Projects メインチャプターを追加しました:', data);
}

main();
