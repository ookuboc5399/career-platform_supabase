/**
 * AI Controls › Copilot 配下に、Privacy & Features / Billing / Metrics / Copilot Clients 解説チャプターを追加する。
 * 初期セットアップ（VS Code編）は order 1 のまま。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-enterprise-copilot-org-settings-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const PARENT_ID = 'github-enterprise-ai-copilot';

const chapters = [
  {
    id: 'github-enterprise-copilot-privacy',
    title: 'Copilot — Privacy & Features',
    description:
      'Organization / Enterprise の Copilot における Privacy（コンテンツ除外・データの扱い）と Features（Chat・PR・CLI 等の機能有効化）をまとめて学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-copilot-billing-settings',
    title: 'Copilot — Billing',
    description:
      'Copilot 設定画面の Billing。シート割当・利用状況の見方（Enterprise 全体の請求とは役割が異なる点も整理）を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-copilot-metrics',
    title: 'Copilot — Metrics',
    description:
      '利用状況・採用メトリクスの見方。Enterprise Insights との関係と運用上の読み方を学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-copilot-clients',
    title: 'Copilot — Copilot Clients',
    description:
      '利用を許可するエディタ・IDE クライアントの制限。標準化とセキュリティの両立を学びます。',
    order: 5,
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
        parent_id: PARENT_ID,
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

  console.log('\nCopilot Org Settings チャプター（4件）の upsert が完了しました。');
}

main();
