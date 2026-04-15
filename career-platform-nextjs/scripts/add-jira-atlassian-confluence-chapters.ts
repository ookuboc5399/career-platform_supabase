/**
 * Jira / Atlassian / Confluence の言語行とチャプターを追加
 * 実行: npx ts-node scripts/add-jira-atlassian-confluence-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const LANGUAGES: {
  id: string;
  title: string;
  description: string;
  type: 'saas';
}[] = [
  {
    id: 'jira',
    title: 'Jira入門',
    description:
      'Atlassian の課題・プロジェクト管理ツール Jira の基本。課題、ボード、ワークフロー、スプリント、JQL の入門を学びます。',
    type: 'saas',
  },
  {
    id: 'atlassian',
    title: 'Atlassian 入門',
    description:
      'Atlassian クラウド製品群の位置づけ、サイト管理、ユーザー・グループ・権限、Rovo（AI）の基礎を学びます。',
    type: 'saas',
  },
  {
    id: 'confluence',
    title: 'Confluence 入門',
    description:
      'チーム向けドキュメントツール Confluence の概要。スペース、ページ、マクロ、テンプレートによるナレッジ共有を学びます。',
    type: 'saas',
  },
];

const CHAPTERS: {
  id: string;
  language_id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'jira-overview',
    language_id: 'jira',
    title: 'Jira の概要と製品ライン',
    description: 'Jira Software・Jira Work Management・Jira Service Management の違い、Cloud と Data Center の概要を学びます。',
    order: 1,
  },
  {
    id: 'jira-issues-and-boards',
    language_id: 'jira',
    title: '課題（Issue）とボード',
    description: '課題タイプ、リスト・スクラム・カンバンボードの役割、カスタムフィールドの考え方を学びます。',
    order: 2,
  },
  {
    id: 'jira-workflows',
    language_id: 'jira',
    title: 'ワークフローとステータス',
    description: 'ステータス遷移、トランジション、解決（Resolution）、プロジェクト管理者向けの基本設定を学びます。',
    order: 3,
  },
  {
    id: 'jira-sprints-backlog',
    language_id: 'jira',
    title: 'スプリントとバックログ',
    description: 'プロダクトバックログ、スプリント計画、ベロシティ、完了の定義（DoD）をスクラム文脈で整理します。',
    order: 4,
  },
  {
    id: 'jira-filters-jql',
    language_id: 'jira',
    title: 'フィルターと JQL 入門',
    description: '保存フィルター、ダッシュボードとの連携、JQL の基本句（project, status, assignee など）を学びます。',
    order: 5,
  },
  {
    id: 'jira-service-management-intro',
    language_id: 'jira',
    title: 'Jira Service Management 入門',
    description: 'サービスデスク、リクエストタイプ、SLA、ナレッジベース連携の概要を学びます。',
    order: 6,
  },
  {
    id: 'atlassian-overview',
    language_id: 'atlassian',
    title: 'Atlassian エコシステムの概要',
    description: 'Jira・Confluence・その他製品の役割分担、サイトと製品の関係、一般的な導入パターンを学びます。',
    order: 1,
  },
  {
    id: 'atlassian-cloud-admin-basics',
    language_id: 'atlassian',
    title: 'Cloud サイトとユーザー管理の基礎',
    description: 'Organization / サイト、ユーザー招待、グループ、製品アクセス、監査の考え方を学びます。',
    order: 2,
  },
  {
    id: 'atlassian-rovo',
    language_id: 'atlassian',
    title: 'Atlassian Rovo（AI）',
    description:
      'Rovo Search・Rovo Chat・エージェントの概要、Jira / Confluence での活用イメージと管理者・セキュリティ上の考え方を学びます。',
    order: 3,
  },
  {
    id: 'confluence-overview',
    language_id: 'confluence',
    title: 'Confluence の概要',
    description: 'Wiki 型ドキュメントの利点、Jira との連携、ホワイトボードやデータベースなど最近の機能の位置づけを学びます。',
    order: 1,
  },
  {
    id: 'confluence-spaces-and-pages',
    language_id: 'confluence',
    title: 'スペースとページ構成',
    description: 'スペースの種類、ページ階層、ラベル、権限（スペース権限とページ制限）の基礎を学びます。',
    order: 2,
  },
  {
    id: 'confluence-macros-templates',
    language_id: 'confluence',
    title: 'マクロとテンプレート',
    description: 'よく使うマクロ、ブループリント、テンプレートでドキュメント品質と再利用性を高める方法を学びます。',
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

  for (const lang of LANGUAGES) {
    const { error } = await supabase.from('programming_languages').upsert(
      {
        id: lang.id,
        title: lang.title,
        description: lang.description,
        type: lang.type,
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`言語 ${lang.id}:`, error);
      process.exit(1);
    }
    console.log(`✓ 言語 ${lang.id}`);
  }

  for (const ch of CHAPTERS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: ch.language_id,
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
      console.error(`チャプター ${ch.id}:`, error);
      continue;
    }
    console.log(`✓ ${ch.id}`);
  }

  console.log('\n完了しました。');
}

main();
