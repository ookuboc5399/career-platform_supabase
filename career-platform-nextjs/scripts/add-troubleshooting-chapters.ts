/**
 * 各メインチャプターに「トラブルシューティング」サブチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-troubleshooting-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const TROUBLESHOOTING_CHAPTERS = [
  {
    id: 'github-enterprise-troubleshooting',
    parent_id: 'github-enterprise-sec-support',
    title: 'トラブルシューティング',
    description: '認証エラー、監査ログ、設定に関するよくある問題と対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-actions-troubleshooting',
    parent_id: 'github-1767002543754-i64d4wz',
    title: 'トラブルシューティング',
    description: 'ビルド失敗、ワークフローのトリガー、キャッシュ・Artifactのエラー対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-copilot-troubleshooting',
    parent_id: 'github-1767073756824-whxljzx',
    title: 'トラブルシューティング',
    description: 'Copilotの提案が表示されない、品質が低い場合の対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-admin-troubleshooting',
    parent_id: 'github-1770228766026-b8na1vc',
    title: 'トラブルシューティング',
    description: 'ポリシー適用エラー、ライセンス不足などの対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-ghas-troubleshooting',
    parent_id: 'github-1770333814514-4idy0to',
    title: 'トラブルシューティング',
    description: 'Code Scanning、Dependabot、Secret Scanning、GHAS有効化に関するエラー対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-pages-troubleshooting',
    parent_id: 'github-pages',
    title: 'トラブルシューティング',
    description: 'サイトが表示されない、ビルド失敗、カスタムドメインの設定に関する対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-projects-troubleshooting',
    parent_id: 'github-enterprise-org-projects',
    title: 'トラブルシューティング',
    description: 'プロジェクトが表示されない、Issue/PRが追加できない場合の対処法を学びます。',
    order: 99,
  },
  {
    id: 'github-cli-api-troubleshooting',
    parent_id: 'github-cli-api',
    title: 'トラブルシューティング',
    description: '認証エラー、API 401/403、レート制限の対処法を学びます。',
    order: 99,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  for (const ch of TROUBLESHOOTING_CHAPTERS) {
    const { data, error } = await supabase
      .from('programming_chapters')
      .upsert(
        {
          id: ch.id,
          language_id: 'github',
          parent_id: ch.parent_id,
          title: ch.title,
          description: ch.description,
          order: ch.order,
          status: 'published',
          exercises: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select();

    if (error) {
      console.error(`エラー (${ch.id}):`, error);
      continue;
    }
    console.log(`✓ ${ch.id} を追加しました`);
  }

  console.log('\nトラブルシューティングサブチャプターの追加が完了しました。');
}

main();
