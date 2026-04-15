/**
 * GitHub コース: The GitHub Blog の最新記事を見るチャプターを追加
 * 実行: cd career-platform-nextjs && npx ts-node scripts/add-github-blog-latest-chapter.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CHAPTER = {
  id: 'github-blog-latest',
  title: 'GitHub の最新情報（公式ブログ）',
  description:
    'The GitHub Blog（github.blog）の RSS から最新記事を一覧表示します。公式の新着は約1時間単位でキャッシュ更新されます。',
  order: 40,
};

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { error } = await supabase.from('programming_chapters').upsert(
    {
      id: CHAPTER.id,
      language_id: 'github',
      parent_id: null,
      title: CHAPTER.title,
      description: CHAPTER.description,
      order: CHAPTER.order,
      status: 'published',
      exercises: [],
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.error('エラー:', error);
    process.exit(1);
  }

  console.log(`✓ ${CHAPTER.id} を追加・更新しました`);
}

main();
