/**
 * GitHub コース向け: PR・Discussions・Codespaces・Releases・ブランチ保護/ルールセット のチャプターを追加
 * 実行: npx ts-node scripts/add-github-pr-discussions-codespaces-releases-branch-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CHAPTERS = [
  {
    id: 'github-pull-requests-review',
    title: 'プルリクエストとコードレビュー',
    description:
      'ブランチから main へ変更を取り込む Pull Request の流れ、レビュー依頼、承認、マージ戦略、Draft PR の使い方を日本語で整理します。',
    order: 25,
  },
  {
    id: 'github-discussions',
    title: 'GitHub Discussions',
    description:
      'Q&A、アイデア、告知などを Issues と分けて扱う Discussions の概要、カテゴリ設定、ベストアンサー、Issues への変換を学びます。',
    order: 26,
  },
  {
    id: 'github-codespaces',
    title: 'GitHub Codespaces',
    description:
      'ブラウザまたは VS Code からクラウド上の開発環境を起動する Codespaces の特徴、devcontainer、課金と Organization ポリシーの要点を学びます。',
    order: 27,
  },
  {
    id: 'github-releases',
    title: 'リリースとタグ',
    description:
      'タグ付け、リリースノート、成果物（Assets）の添付、自動生成リリースノート、GitHub Actions との連携の基礎を学びます。',
    order: 28,
  },
  {
    id: 'github-branch-protection-rulesets',
    title: 'ブランチ保護とルールセット',
    description:
      '必須レビュー、ステータスチェック、直 push 禁止などブランチ保護ルールと、Organization 全体に適用できるルールセットの違いと設定の考え方を学びます。',
    order: 29,
  },
  {
    id: 'github-support-inquiry',
    title: 'GitHubサポート問い合わせ',
    description:
      'GitHubサポートへの問い合わせ方法、サポートプラン（Community／Standard）、対象範囲、チケット作成・優先度、言語と営業時間、問い合わせ時の注意点を学びます。',
    order: 30,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  for (const ch of CHAPTERS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: null,
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`エラー (${ch.id}):`, error);
      continue;
    }
    console.log(`✓ ${ch.id}`);
  }

  console.log('\n完了しました。');
}

main();
