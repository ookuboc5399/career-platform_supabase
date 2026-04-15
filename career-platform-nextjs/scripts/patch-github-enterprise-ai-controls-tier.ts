/**
 * AI Controls を GitHub Enterprise 直下に固定し、Overview の直後（order 2）に並べる。
 * Organizations(3) / Insights(4) / Settings(5) / Billing(6) の order を揃える。
 * Agents は AI Controls 直下の親チャプターとし、github-enterprise-ai-agents-intro はそのサブチャプターとして upsert する。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/patch-github-enterprise-ai-controls-tier.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SETTINGS_HUB_DESC =
  'Enterprise の Settings に対応するチャプターです。認証・課金・Hooks・お知らせ・コンプライアンス・ポリシー／Connect など。（AI Controls は Enterprise 直下の別ハブ）';

const AGENTS_DESC = 'Agents チャプターの入口です。概要とポリシーはサブチャプターで学びます。';

const AGENTS_INTRO_ROW = {
  id: 'github-enterprise-ai-agents-intro',
  language_id: 'github',
  parent_id: 'github-enterprise-ai-agents',
  title: 'エージェントの概要とポリシー',
  description:
    'コーディングエージェントの位置づけと、AI Controls・Enterprise / Organization ポリシーとの関係を整理します。',
  order: 1,
  status: 'published' as const,
  exercises: [] as unknown[],
  video_url: '',
  thumbnail_url: '',
  duration: '',
};

const AGENTS_CHAPTER = {
  id: 'github-enterprise-ai-agents',
  language_id: 'github',
  parent_id: 'github-enterprise-sec-ai-controls',
  title: 'Agents',
  description: AGENTS_DESC,
  order: 1,
  status: 'published' as const,
  exercises: [] as unknown[],
  video_url: '',
  thumbnail_url: '',
  duration: '',
};

const AI_CONTROLS_SECTION = {
  id: 'github-enterprise-sec-ai-controls',
  language_id: 'github',
  parent_id: 'github-enterprise',
  title: 'AI Controls',
  description: 'Agents・Copilot・MCP など、AI 機能の利用と統制です。',
  order: 2,
  status: 'draft' as const,
  exercises: [] as unknown[],
  video_url: '',
  thumbnail_url: '',
  duration: '',
};

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY（または ANON）を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { data: updatedAi, error: aiErr } = await supabase
    .from('programming_chapters')
    .update({ parent_id: 'github-enterprise', order: 2, updated_at: now })
    .eq('id', 'github-enterprise-sec-ai-controls')
    .select('id, parent_id, order');

  if (aiErr) {
    console.error('AI Controls 更新エラー:', aiErr);
    process.exit(1);
  }

  if (!updatedAi?.length) {
    const { error: upErr } = await supabase.from('programming_chapters').upsert(
      { ...AI_CONTROLS_SECTION, created_at: now, updated_at: now },
      { onConflict: 'id' }
    );
    if (upErr) {
      console.error('AI Controls upsert エラー:', upErr);
      process.exit(1);
    }
    console.log('✓ github-enterprise-sec-ai-controls upsert（parent github-enterprise, order 2）');
  } else {
    console.log('✓ github-enterprise-sec-ai-controls → order 2', updatedAi[0]);
  }

  await supabase
    .from('programming_chapters')
    .update({ order: 3, updated_at: now })
    .eq('id', 'github-enterprise-sec-orgs-and-repos');
  console.log('✓ github-enterprise-sec-orgs-and-repos order=3');

  await supabase
    .from('programming_chapters')
    .update({ order: 4, updated_at: now })
    .eq('id', 'github-enterprise-sec-insights');
  console.log('✓ github-enterprise-sec-insights order=4');

  await supabase
    .from('programming_chapters')
    .update({ order: 5, description: SETTINGS_HUB_DESC, updated_at: now })
    .eq('id', 'github-enterprise-settings-hub');
  console.log('✓ github-enterprise-settings-hub order=5');

  await supabase.from('programming_chapters').update({ order: 6, updated_at: now }).eq('id', 'github-enterprise-billing-hub');
  console.log('✓ github-enterprise-billing-hub order=6');

  const { error: agentsErr } = await supabase.from('programming_chapters').upsert(
    { ...AGENTS_CHAPTER, created_at: now, updated_at: now },
    { onConflict: 'id' }
  );
  if (agentsErr) {
    console.error('Agents upsert エラー:', agentsErr);
    process.exit(1);
  }
  console.log('✓ github-enterprise-ai-agents（説明更新・order 1）');

  const { error: introErr } = await supabase.from('programming_chapters').upsert(
    { ...AGENTS_INTRO_ROW, created_at: now, updated_at: now },
    { onConflict: 'id' }
  );
  if (introErr) {
    console.error('agents-intro upsert エラー:', introErr);
    process.exit(1);
  }
  console.log('✓ github-enterprise-ai-agents-intro（Agents 配下）');

  const { data: verify } = await supabase
    .from('programming_chapters')
    .select('id, parent_id, order, title')
    .in('id', [
      'github-enterprise-sec-overview',
      'github-enterprise-sec-ai-controls',
      'github-enterprise-sec-orgs-and-repos',
      'github-enterprise-sec-insights',
      'github-enterprise-settings-hub',
      'github-enterprise-billing-hub',
    ])
    .order('order', { ascending: true });

  console.log('\nEnterprise 直下セクション（確認）:');
  console.table(verify ?? []);
}

main();
