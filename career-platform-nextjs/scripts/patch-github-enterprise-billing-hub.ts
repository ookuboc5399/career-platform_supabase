/**
 * 「コスト管理（Billing and licensing）」ハブ（下書きセクション）を Enterprise 直下に追加し、
 * github-enterprise-cost-management をその子に紐づける（restructure スクリプトでは order 8。Overview 等 7 子の後）。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/patch-github-enterprise-billing-hub.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const HUB_ID = 'github-enterprise-billing-hub';

const HUB = {
  id: HUB_ID,
  language_id: 'github',
  parent_id: 'github-enterprise',
  title: 'コスト管理（Billing and licensing）',
  description:
    'Enterprise の Billing and licensing に対応するチャプターです。公式 UI では Settings と同階層の左ナビにあり、Overview / Usage / Licensing / Cost centers / Budgets and alerts / Payment / Billing contacts、Cost Center 按分・Usage / Billing API・FinOps など。',
  order: 5,
  status: 'draft' as const,
  exercises: [] as unknown[],
  video_url: '',
  thumbnail_url: '',
  duration: '',
};

const LEAF_DESC =
  'Enterprise 直下の Billing and licensing（Settings と同階層。Overview / Usage / Licensing / Cost centers / Budgets and alerts / Payment / Billing contacts）の見方と、Cost Center 按分・Usage / Billing API・FinOps を学びます。';

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY（または ANON）を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { error: hubErr } = await supabase.from('programming_chapters').upsert(
    {
      ...HUB,
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );

  if (hubErr) {
    console.error('Billing ハブ upsert エラー:', hubErr);
    process.exit(1);
  }
  console.log(`✓ ${HUB_ID} upsert（Enterprise 直下・order 5・下書き）`);

  const { error: leafErr } = await supabase
    .from('programming_chapters')
    .update({
      parent_id: HUB_ID,
      order: 8,
      description: LEAF_DESC,
      updated_at: now,
    })
    .eq('id', 'github-enterprise-cost-management');

  if (leafErr) {
    console.error('github-enterprise-cost-management 更新エラー:', leafErr);
    process.exit(1);
  }
  console.log('✓ github-enterprise-cost-management → Billing ハブの子 order 8');
}

main();
