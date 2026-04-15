/**
 * Azure › Microsoft Entra ID 配下に「ユーザー一括登録」サブチャプターを追加する。
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-azure-entra-bulk-users-subchapter.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const PARENT_ID = 'azure-entra-id';

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { error } = await supabase.from('programming_chapters').upsert(
    {
      id: 'azure-entra-bulk-user-registration',
      language_id: 'azure',
      parent_id: PARENT_ID,
      title: 'ユーザー一括登録',
      description:
        '管理センターの CSV 一括作成、ゲストの一括招待、Microsoft Graph / PowerShell による自動化の考え方と運用上の注意を学びます。',
      order: 1,
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
  console.log('✓ azure-entra-bulk-user-registration（Entra ID 配下）');
}

main();
