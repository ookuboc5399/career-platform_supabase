/**
 * GitHub Enterprise Server（GHES）概要チャプターを GitHub 言語のルート直下に置く（GHEC の github-enterprise とは別トラック）。
 * 旧セクション github-enterprise-sec-ghes が残っていれば削除する（子の親を先にルートへ）。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/add-github-enterprise-ghes-chapter.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const OBSOLETE_SECTION_ID = 'github-enterprise-sec-ghes';
const CHAPTER_ID = 'github-enterprise-ghes-overview';

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY（または ANON）を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { error: chErr } = await supabase.from('programming_chapters').upsert(
    {
      id: CHAPTER_ID,
      language_id: 'github',
      parent_id: null,
      title: 'GitHub Enterprise Server（GHES）',
      description:
        'オンプレミス／セルフホストの GitHub Enterprise Server。GHEC（学習一覧の「GitHub Enterprise」）とは別製品・別トラックです。位置づけ・運用・公式ドキュメントへの入口を整理します。',
      order: 15,
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

  if (chErr) {
    console.error('チャプター upsert エラー:', chErr);
    process.exit(1);
  }
  console.log(`✓ ${CHAPTER_ID}（parent なし・GitHub ルート直下）`);

  const { error: delErr } = await supabase.from('programming_chapters').delete().eq('id', OBSOLETE_SECTION_ID);

  if (delErr) {
    console.warn(`旧セクション削除（無ければ無視）: ${OBSOLETE_SECTION_ID}`, delErr.message);
  } else {
    console.log(`✓ 旧 ${OBSOLETE_SECTION_ID} を削除（存在した場合）`);
  }
}

main();
