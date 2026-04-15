/**
 * GitHub Enterprise 配下に Overview / Insights / Announcements / Hooks を追加する。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-enterprise-account-area-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const chapters = [
  {
    id: 'github-enterprise-overview',
    parent_id: 'github-enterprise',
    title: 'Overview（概要）',
    description:
      'Enterprise アカウントの Overview 画面。組織一覧・サマリー・他タブへの入口として公式 UI の「最初の 1 画面」に対応します。',
    order: 8,
  },
  {
    id: 'github-enterprise-insights',
    parent_id: 'github-enterprise',
    title: 'Insights（利用状況）',
    description:
      'Enterprise の Insights タブ。アカウント横断の活動・利用状況の見方（リポジトリの Insights タブとは別）を学びます。',
    order: 9,
  },
  {
    id: 'github-enterprise-announcements',
    parent_id: 'github-enterprise',
    title: 'お知らせ（Announcements）',
    description:
      'Enterprise Settings の Announcements。メンバー向けバナー・告知の掲出と運用上の注意を学びます。',
    order: 10,
  },
  {
    id: 'github-enterprise-hooks',
    parent_id: 'github-enterprise',
    title: 'Hooks（Enterprise Webhooks）',
    description:
      'Enterprise Settings の Hooks。アカウントレベルの Webhook と Organization / Repository との違い、設定の流れを学びます。',
    order: 11,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  for (const ch of chapters) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: ch.parent_id,
        title: ch.title,
        description: ch.description,
        order: ch.order,
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
      console.error(`エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}`);
  }

  console.log('\nEnterprise Overview / Insights / Announcements / Hooks の追加が完了しました。');
}

main();
