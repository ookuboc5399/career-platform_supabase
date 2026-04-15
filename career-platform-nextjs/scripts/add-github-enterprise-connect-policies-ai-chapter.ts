/**
 * GitHub Enterprise 配下に「GitHub Connect・Policies・AI Controls」を追加する。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-enterprise-connect-policies-ai-chapter.ts
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
  const now = new Date().toISOString();

  const { error } = await supabase.from('programming_chapters').upsert(
    {
      id: 'github-enterprise-connect-policies-ai',
      language_id: 'github',
      parent_id: 'github-enterprise',
      title: 'GitHub Connect・Policies・AI Controls',
      description:
        'Enterprise Settings における GitHub Connect（GHES と GitHub.com の連携）、組織横断の Policies、Copilot 等の AI Controls の役割と運用のポイントを学びます。',
      order: 13,
      status: 'published',
      exercises: [],
      video_url: '',
      thumbnail_url: '',
      duration: '',
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
  console.log('✓ github-enterprise-connect-policies-ai を upsert しました');
}

main();
