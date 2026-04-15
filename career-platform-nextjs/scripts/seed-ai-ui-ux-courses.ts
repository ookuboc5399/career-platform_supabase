/**
 * AI / UI/UX コース（programming_languages + programming_chapters）を upsert。
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/seed-ai-ui-ux-courses.ts
 *
 * 事前: programming_languages.type の CHECK に ai / ui-ux が含まれること
 * （career-platform-express/src/config/add-ai-ui-ux-iaas-network-programming-language-types.sql）
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
  type: 'ai' | 'ui-ux';
}[] = [
  {
    id: 'claude',
    title: 'Claude',
    description:
      'Anthropic の Claude（大規模言語モデル）の概要、Messages API の考え方、安全とプロンプト設計の入門を学びます。',
    type: 'ai',
  },
  {
    id: 'openai',
    title: 'OpenAI',
    description:
      'ChatGPT と API の違い、モデル・トークン、運用とコストの考え方を整理して学びます。',
    type: 'ai',
  },
  {
    id: 'openclaw',
    title: 'OpenClaw',
    description:
      '自己ホスト型パーソナル AI アシスタントの概要、セットアップとセキュリティ、外部連携の注意点を学びます。',
    type: 'ai',
  },
  {
    id: 'manus',
    title: 'Manus',
    description:
      'エージェント型タスク実行の考え方、ワークフロー設計、社内ガバナンスのポイントを学びます。',
    type: 'ai',
  },
  {
    id: 'ui-ux-foundations',
    title: 'UI/UX 入門',
    description: 'UI と UX の違い、ユーザビリティリサーチ、アクセシビリティの基礎を学びます。',
    type: 'ui-ux',
  },
  {
    id: 'ui-design-systems',
    title: 'デザインシステムと UI パターン',
    description: 'デザインシステムの役割、トークンとコンポーネント、公開パターンガイドの活用法を学びます。',
    type: 'ui-ux',
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
    id: 'claude-overview',
    language_id: 'claude',
    title: 'Claude の概要',
    description: 'モデルファミリー、ユースケース、ドキュメントの探し方。',
    order: 1,
  },
  {
    id: 'claude-api-messages',
    language_id: 'claude',
    title: 'Messages API',
    description: '対話形式 API の基本と実装時のポイント。',
    order: 2,
  },
  {
    id: 'claude-safety-prompts',
    language_id: 'claude',
    title: '安全とプロンプト設計',
    description: '指示の書き方、機密取り扱い、フェイルセーフ。',
    order: 3,
  },
  {
    id: 'claude-academy-3',
    language_id: 'claude',
    title: 'Claude API 実践ワークショップ',
    description: 'Hello Claude、会話の文脈、ストリーミング、Vision、本番向けのエラー処理とトークン節約。',
    order: 4,
  },
  {
    id: 'claude-academy-4',
    language_id: 'claude',
    title: 'Model Context Protocol（MCP）',
    description: '外部データソース・ツールと AI をつなぐ共通規格。ホスト・サーバ・クライアントの役割と活用例。',
    order: 5,
  },
  {
    id: 'openai-overview',
    language_id: 'openai',
    title: 'ChatGPT と API',
    description: '利用形態の違いとエコシステムの全体像。',
    order: 1,
  },
  {
    id: 'openai-models-api',
    language_id: 'openai',
    title: 'モデルとトークン',
    description: 'モデル選択、コンテキスト、API 利用のチェックリスト。',
    order: 2,
  },
  {
    id: 'openai-operations',
    language_id: 'openai',
    title: '運用とコスト',
    description: '課金の見方、キー管理、監視の考え方。',
    order: 3,
  },
  {
    id: 'openclaw-overview',
    language_id: 'openclaw',
    title: 'OpenClaw の概要',
    description: '自己ホスト型アシスタントの位置づけと責任分界。',
    order: 1,
  },
  {
    id: 'openclaw-setup-security',
    language_id: 'openclaw',
    title: 'セットアップとセキュリティ',
    description: '環境要件、秘密情報、権限の最小化。',
    order: 2,
  },
  {
    id: 'openclaw-integrations',
    language_id: 'openclaw',
    title: '連携と運用',
    description: 'メッセージング連携時のリスクとホワイトリスト。',
    order: 3,
  },
  {
    id: 'manus-overview',
    language_id: 'manus',
    title: 'エージェント型タスク実行',
    description: '従来チャットとの違いと期待できること。',
    order: 1,
  },
  {
    id: 'manus-agent-workflows',
    language_id: 'manus',
    title: 'ワークフロー設計',
    description: '指示の具体化と人間承認の挟み方。',
    order: 2,
  },
  {
    id: 'manus-governance',
    language_id: 'manus',
    title: 'ガバナンス',
    description: '入力禁止データと許可する操作のポリシー化。',
    order: 3,
  },
  {
    id: 'ui-ux-what-is',
    language_id: 'ui-ux-foundations',
    title: 'UI と UX',
    description: '用語の整理とプロトタイプの役割。',
    order: 1,
  },
  {
    id: 'ui-ux-usability-research',
    language_id: 'ui-ux-foundations',
    title: 'ユーザビリティとリサーチ',
    description: 'ヒューリスティックとユーザビリティテストの入門。',
    order: 2,
  },
  {
    id: 'ui-ux-accessibility',
    language_id: 'ui-ux-foundations',
    title: 'アクセシビリティ',
    description: 'キーボード、コントラスト、セマンティック HTML。',
    order: 3,
  },
  {
    id: 'ui-design-system-intro',
    language_id: 'ui-design-systems',
    title: 'デザインシステムとは',
    description: '目的、ドキュメント、開発との同期。',
    order: 1,
  },
  {
    id: 'ui-design-tokens-components',
    language_id: 'ui-design-systems',
    title: 'トークンとコンポーネント',
    description: 'デザイントークンと再利用コンポーネント。',
    order: 2,
  },
  {
    id: 'ui-design-patterns',
    language_id: 'ui-design-systems',
    title: 'UI パターンと Material Design',
    description: '繰り返しパターンと公開ガイドラインの参照。',
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
      console.error(`言語 upsert エラー (${lang.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ language ${lang.id}`);
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
        video_url: null,
        thumbnail_url: null,
        duration: null,
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`チャプター upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ chapter ${ch.id}`);
  }

  console.log('\nAI / UI/UX コースの seed が完了しました。');
}

main();
