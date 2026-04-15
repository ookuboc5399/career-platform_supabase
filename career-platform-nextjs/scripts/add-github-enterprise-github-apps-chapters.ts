/**
 * GitHub Enterprise 配下に「GitHub Apps」ハブと、作成 / インストール / Webhook のサブチャプターを追加する。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-enterprise-github-apps-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const HUB_ID = 'github-enterprise-github-apps';

const chapters = [
  {
    id: HUB_ID,
    parent_id: 'github-enterprise',
    title: 'GitHub Apps',
    description:
      'GitHub App の作成（GHEC / EMU の違い）、Organization へのインストール、Webhook の設定・配信テストまでを学びます。',
    order: 6,
  },
  {
    id: 'github-enterprise-github-apps-create',
    parent_id: HUB_ID,
    title: 'GitHub Appsの作成手順',
    description:
      'Developer settings での新規 App、GHEC と EMU での運用差分、読み取り専用レポート連携（ghe-usage-report 想定）の権限と認証です。',
    order: 1,
  },
  {
    id: 'github-enterprise-github-apps-install',
    parent_id: HUB_ID,
    title: 'GitHub Appsのインストール手順',
    description:
      'Marketplace または社内アプリを Organization に導入し、リポジトリ範囲と権限を最小限に設定する手順です。',
    order: 2,
  },
  {
    id: 'github-enterprise-github-apps-webhook',
    parent_id: HUB_ID,
    title: 'GitHub AppsのWebhook設定手順',
    description:
      'Developer settings から Webhook URL・シークレット・購読イベントを設定し、Recent Deliveries で配信を確認する手順です。',
    order: 3,
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

  console.log('\nGitHub Apps チャプターの追加が完了しました。');
}

main();
