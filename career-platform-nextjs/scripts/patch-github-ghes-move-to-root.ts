/**
 * GHES 概要を github-enterprise 配下から切り離し、GitHub 言語ルート直下へ移す。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/patch-github-ghes-move-to-root.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY（または ANON）を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { error: upErr } = await supabase
    .from('programming_chapters')
    .update({
      parent_id: null,
      order: 15,
      title: 'GitHub Enterprise Server（GHES）',
      description:
        'オンプレミス／セルフホストの GitHub Enterprise Server。GHEC（学習一覧の「GitHub Enterprise」）とは別製品・別トラックです。位置づけ・運用・公式ドキュメントへの入口を整理します。',
      updated_at: now,
    })
    .eq('id', 'github-enterprise-ghes-overview');

  if (upErr) {
    console.error('github-enterprise-ghes-overview 更新エラー:', upErr);
    process.exit(1);
  }
  console.log('✓ github-enterprise-ghes-overview → ルート（parent_id null）, order 15');

  const { error: delErr } = await supabase.from('programming_chapters').delete().eq('id', 'github-enterprise-sec-ghes');
  if (delErr) {
    console.warn('github-enterprise-sec-ghes 削除:', delErr.message);
  } else {
    console.log('✓ github-enterprise-sec-ghes 削除（存在時）');
  }
}

main();
