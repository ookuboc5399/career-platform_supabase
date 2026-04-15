/**
 * 各「トラブルシューティング」チャプターの下に、テーマ別のサブチャプターを追加する。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-troubleshooting-subchapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** parent_id は add-troubleshooting-chapters.ts の各トラブルシューティング id */
const SUB_CHAPTERS = [
  {
    id: 'github-actions-ts-workflow-failure',
    parent_id: 'github-actions-troubleshooting',
    title: 'GitHub Actions ワークフロー失敗',
    description:
      'ジョブ失敗時のログ確認、再実行、ランナー・シークレット・コンテナ起因の切り分けとよくある対処を学びます。',
    order: 1,
  },
  {
    id: 'github-admin-ts-permission-denied',
    parent_id: 'github-admin-troubleshooting',
    title: '権限・アクセス拒否エラー時',
    description:
      'Organization / リポジトリのロール、ブランチ保護、SSO トークン承認、IP 許可など、拒否の典型原因と確認手順を学びます。',
    order: 1,
  },
  {
    id: 'github-cli-api-ts-git-clone-push',
    parent_id: 'github-cli-api-troubleshooting',
    title: 'Git操作（Clone / Push）エラー',
    description:
      '認証（HTTPS・SSH）、2FA、LFS、大容量、ブランチ保護による push 拒否など、clone/push 周りのトラブルを整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-ts-entra-sso-logs',
    parent_id: 'github-enterprise-troubleshooting',
    title: 'SSOログインエラー時のEntra IDログ確認・原因特定',
    description:
      'Microsoft Entra ID（Azure AD）のサインインログ・監査ログの見方と、GitHub Enterprise SAML/OIDC 連携でよくある不整合の特定手順を学びます。',
    order: 1,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  for (const ch of SUB_CHAPTERS) {
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

  console.log('\nトラブルシューティング配下サブチャプターの追加が完了しました。');
}

main();
