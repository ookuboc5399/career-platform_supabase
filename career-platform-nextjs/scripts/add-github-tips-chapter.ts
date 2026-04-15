/**
 * GitHub コース: Tips チャプターを追加（トップ階層）
 * 実行: cd career-platform-nextjs && npx ts-node scripts/add-github-tips-chapter.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CHAPTER = {
  id: 'github-tips',
  title: 'GitHub Tips',
  description:
    'Enterprise と Organization の役割分担など、現場で混同しやすい設定の「考え方」を短く整理するチップス集です。',
  order: 31,
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
