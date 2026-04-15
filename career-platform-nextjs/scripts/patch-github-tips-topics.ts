/**
 * github-tips の子トピック（Enterprise/Organization、GitHub/GitLab）を programming_chapters に追加し、
 * 親チャプターの説明を更新する。
 *
 * 実行: cd career-platform-nextjs && npx tsx scripts/patch-github-tips-topics.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const PARENT_ID = 'github-tips';

const CHILDREN = [
  {
    id: 'github-tips-enterprise-organization',
    title: 'Enterprise と Organization',
    description:
      'Enterprise と Organization の役割分担、ポリシーの強制と委任、Copilot の例と比較表で整理します。',
    order: 1,
  },
  {
    id: 'github-tips-github-vs-gitlab',
    title: 'GitHub と GitLab の違い',
    description:
      'CI/CD、MR/PR、セキュリティ機能、セルフホスト製品の位置づけなど、移行・比較で使う観点を短くまとめます。',
    order: 2,
  },
  {
    id: 'github-tips-copilot-metrics-viewer',
    title: 'copilot-metrics-viewer のセットアップ',
    description:
      'Nuxt・PostgreSQL・同期ジョブの 3 構成、PAT / GitHub App 認証、Azure ワンクリック・azd・Docker、環境変数と Enterprise 向け注意点を整理します。',
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

  const { error: parentErr } = await supabase
    .from('programming_chapters')
    .update({
      description:
        '現場で混同しやすいトピックを短く整理します。左ナビで「概要」「Enterprise/Organization」「GitHub/GitLab」「Copilot metrics viewer」を切り替えられます。',
      updated_at: now,
    })
    .eq('id', PARENT_ID);

  if (parentErr) {
    console.error('親 github-tips 更新エラー:', parentErr);
    process.exit(1);
  }
  console.log('✓ github-tips の description を更新');

  for (const ch of CHILDREN) {
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
      console.error(`子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}`);
  }
}

main();
