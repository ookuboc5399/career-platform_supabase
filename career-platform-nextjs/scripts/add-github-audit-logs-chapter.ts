/**
 * GitHub 言語に「監査ログとログの種類」チャプターを追加（言語直下・ルート）。
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-audit-logs-chapter.ts
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
      id: 'github-audit-logs-overview',
      language_id: 'github',
      parent_id: null,
      title: '監査ログとログの種類',
      description:
        'Audit Log・Git イベント・Actions ログ・API ログなど、GitHub で利用できるログの整理と外部連携（SIEM ストリーミング）の考え方を学びます。',
      order: 12,
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
    console.error('upsert エラー:', error);
    process.exit(1);
  }
  console.log('✓ github-audit-logs-overview を upsert しました');
}

main();
