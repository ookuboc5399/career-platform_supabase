/**
 * GitHub Enterprise に「認証・SSO」サブチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-enterprise-auth-sso-chapter.ts
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
        id: 'github-enterprise-auth-sso',
        language_id: 'github',
        parent_id: 'github-enterprise',
        title: '認証とセキュリティ（Authentication and security）',
        description:
          'Enterprise / Organization の Settings にある Authentication and security に対応。SSO、2FA、IP 制限、EMU、Entra ID、Okta などの認証・アイデンティティ管理を学びます。',
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
  console.log('✓ 認証とセキュリティ（Authentication and security）チャプターを upsert しました:', data);
}

main();
