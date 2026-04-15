/**
 * Copilot — Features チャプターを廃止し、Privacy を Privacy & Features に統合する。
 * order を 2,3,4,5 に詰める。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/merge-github-enterprise-copilot-privacy-features.ts
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

  const { error: u1 } = await supabase
    .from('programming_chapters')
    .update({
      title: 'Copilot — Privacy & Features',
      description:
        'Organization / Enterprise の Copilot における Privacy（コンテンツ除外・データの扱い）と Features（Chat・PR・CLI 等の機能有効化）をまとめて学びます。',
      order: 2,
      updated_at: now,
    })
    .eq('id', 'github-enterprise-copilot-privacy');

  if (u1) {
    console.error('Privacy 更新エラー:', u1);
    process.exit(1);
  }
  console.log('✓ github-enterprise-copilot-privacy を Privacy & Features に更新');

  const { error: d1 } = await supabase.from('programming_chapters').delete().eq('id', 'github-enterprise-copilot-features');
  if (d1) {
    console.warn('Features 削除:', d1.message);
  } else {
    console.log('✓ github-enterprise-copilot-features を削除');
  }

  const reorder = [
    { id: 'github-enterprise-copilot-billing-settings', order: 3 },
    { id: 'github-enterprise-copilot-metrics', order: 4 },
    { id: 'github-enterprise-copilot-clients', order: 5 },
  ];
  for (const r of reorder) {
    const { error } = await supabase.from('programming_chapters').update({ order: r.order, updated_at: now }).eq('id', r.id);
    if (error) console.warn(`order 更新 (${r.id}):`, error.message);
    else console.log(`✓ order ${r.order} ${r.id}`);
  }

  console.log('\n完了しました。');
}

main();
