/**
 * GitHub Copilot 配下に中間ノード「Copilot CLI × MATLAB MCP Server」を追加し、
 * その子として学習チャプター 6 本をぶら下げる。
 *
 * 階層: GitHub Copilot → Copilot CLI × MATLAB MCP Server → 各コンテンツ（6）
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-copilot-matlab-mcp-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

/** Enterprise › AI Controls › MCP 配下にぶら下げる（一覧の階層と一致） */
const GITHUB_COPILOT_SECTION_ID = 'github-enterprise-ai-mcp';

/** 中間ノード（サブチャプター）— 固定 id で upsert */
const MATLAB_MCP_HUB_ID = 'github-copilot-cli-matlab-mcp-server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const leafChapters = [
  {
    id: 'github-copilot-matlab-mcp-01-overview',
    title: 'Copilot×MATLAB MCP — 概要と要件',
    description:
      '利用シナリオ（設計仕様から Simulink 等）、想定環境、押さえるべき制約（Org ポリシー・情報区分・ライセンス）を学びます。',
    order: 1,
  },
  {
    id: 'github-copilot-matlab-mcp-02-architecture',
    title: 'Copilot×MATLAB MCP — システム構成',
    description:
      'Copilot CLI・MCP Server・MATLAB・GitHub API の役割と、通信経路（HTTPS / stdio / ローカル）のセキュリティ上の意味を学びます。',
    order: 2,
  },
  {
    id: 'github-copilot-matlab-mcp-03-mcp-tools',
    title: 'Copilot×MATLAB MCP — MCP ツールと接続',
    description:
      'MATLAB MCP Core Server の概要、提供ツールのリスク感、mcp-config.json、GitHub Organization の MCP ポリシーを学びます。',
    order: 3,
  },
  {
    id: 'github-copilot-matlab-mcp-04-risks',
    title: 'Copilot×MATLAB MCP — セキュリティリスク',
    description:
      '機密の外部送信、モデル改変・インジェクション、MATLAB の権限、テレメトリなど代表リスクを整理します。',
    order: 4,
  },
  {
    id: 'github-copilot-matlab-mcp-05-mitigations',
    title: 'Copilot×MATLAB MCP — 対策',
    description:
      'Content Exclusion、ツールのホワイトリスト、段階的許可、ファイアウォール・OS 制御、テレメトリ無効化を学びます。',
    order: 5,
  },
  {
    id: 'github-copilot-matlab-mcp-06-operations',
    title: 'Copilot×MATLAB MCP — 運用と展開',
    description:
      'ライセンス・EULA、GitHub Apps の限界、導入ロードマップ、全社展開・Gateway の視点、チェックリストの要点を学びます。',
    order: 6,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const hubRow = {
    id: MATLAB_MCP_HUB_ID,
    language_id: 'github',
    parent_id: GITHUB_COPILOT_SECTION_ID,
    title: 'Copilot CLI × MATLAB MCP Server',
    description:
      'GitHub Copilot CLI と MathWorks 公式 MATLAB MCP Core Server を組み合わせた利用の概要・構成・リスク・対策・運用を、セキュリティの観点から6章で学びます。',
    order: 1,
    status: 'published' as const,
    exercises: [] as unknown[],
    video_url: '',
    thumbnail_url: '',
    duration: '',
    created_at: now,
    updated_at: now,
  };

  const { error: hubError } = await supabase
    .from('programming_chapters')
    .upsert(hubRow, { onConflict: 'id' })
    .select();

  if (hubError) {
    console.error('中間ノード upsert エラー:', hubError);
    process.exit(1);
  }
  console.log('✓ サブチャプター「Copilot CLI × MATLAB MCP Server」を upsert しました');

  const leafRows = leafChapters.map((c) => ({
    id: c.id,
    language_id: 'github',
    parent_id: MATLAB_MCP_HUB_ID,
    title: c.title,
    description: c.description,
    order: c.order,
    status: 'published' as const,
    exercises: [] as unknown[],
    video_url: '',
    thumbnail_url: '',
    duration: '',
    created_at: now,
    updated_at: now,
  }));

  const { data, error } = await supabase.from('programming_chapters').upsert(leafRows, { onConflict: 'id' }).select();

  if (error) {
    console.error('孫チャプター upsert エラー:', error);
    process.exit(1);
  }

  console.log('✓ 孫チャプター（コンテンツ）6件を upsert しました（parent_id = ' + MATLAB_MCP_HUB_ID + '）');
  console.log(data);
}

main();
