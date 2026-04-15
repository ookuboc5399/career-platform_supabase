/**
 * GitHub Copilot に「初期セットアップ（VS Code編）」サブチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-github-copilot-setup-vscode-chapter.ts
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
        id: 'github-copilot-setup-vscode',
        language_id: 'github',
        parent_id: 'github-enterprise-ai-copilot',
        title: '初期セットアップ（VS Code編）',
        description:
          'VS Code で GitHub Copilot を利用するための初期セットアップ（拡張機能・認証・稼働確認）。プレミアムリクエスト（Premium Requests）や Copilot Chat の利用枠の考え方へのリンクも含みます。',
        order: 1,
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
  console.log('✓ 初期セットアップ（VS Code編） サブチャプターを追加しました:', data);
}

main();
