/**
 * GitHub Enterprise 配下に「コスト管理（Billing and licensing）」ハブと、その配下の学習チャプターを追加する。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-enterprise-cost-management-chapter.ts
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

  const hubId = 'github-enterprise-billing-hub';

  const { error: hubError } = await supabase.from('programming_chapters').upsert(
    {
      id: hubId,
      language_id: 'github',
      parent_id: 'github-enterprise',
      title: 'コスト管理（Billing and licensing）',
      description:
        'Enterprise の Billing and licensing に対応するチャプターです。公式 UI では Settings と同階層の左ナビにあり、Overview / Usage / Licensing / Cost centers / Budgets and alerts / Payment / Billing contacts、Cost Center 按分・Usage / Billing API・FinOps など。',
      order: 5,
      status: 'draft',
      exercises: [],
      video_url: '',
      thumbnail_url: '',
      duration: '',
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );

  if (hubError) {
    console.error('ハブ upsert エラー:', hubError);
    process.exit(1);
  }
  console.log(`✓ ${hubId}（下書きハブ）`);

  const { error } = await supabase.from('programming_chapters').upsert(
    {
      id: 'github-enterprise-cost-management',
      language_id: 'github',
      parent_id: hubId,
      title: 'コスト管理（Billing and licensing）',
      description:
        'Enterprise 直下の Billing and licensing（Settings と同階層。Overview / Usage / Licensing / Cost centers / Budgets and alerts / Payment / Billing contacts）の見方と、Cost Center 按分・Usage / Billing API・FinOps を学びます。',
      order: 8,
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
  console.log('✓ github-enterprise-cost-management を Billing ハブ配下に追加しました');
}

main();
