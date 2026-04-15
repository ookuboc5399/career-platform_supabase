/**
 * GitHub REST API（Enterprise Cloud）シリーズ — 親ハブ + フェーズ1子チャプターを programming_chapters に投入
 *
 * 命名:
 * - github-rest-api … 親（ハブ）
 * - github-rest-api-overview … 概要・認証・バージョン・ページネーション（公式: about-the-rest-api 等）
 * - github-rest-api-repos … repos / pulls
 * - github-rest-api-orgs … orgs
 *
 * 実行: cd career-platform-nextjs && npx tsx scripts/add-github-rest-api-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CHAPTERS = [
  {
    id: 'github-rest-api',
    parent_id: null as string | null,
    title: 'GitHub REST API（Enterprise Cloud）',
    description:
      '公式 REST ドキュメントの構造に沿ったハブです。共通事項・リポジトリ / PR・Organization などカテゴリ別に要点と公式リンクをまとめます。',
    order: 41,
  },
  {
    id: 'github-rest-api-overview',
    parent_id: 'github-rest-api',
    title: 'REST API — 概要・認証・バージョン',
    description:
      'REST の前提、認証方式の俯瞰、API バージョニング、ページネーション、レート制限の読み方。公式 About the REST API への導線です。',
    order: 1,
  },
  {
    id: 'github-rest-api-repos',
    parent_id: 'github-rest-api',
    title: 'REST API — リポジトリとプルリクエスト',
    description: 'repos / pulls カテゴリの公式 REST への導線と、自動化でよく使う観点の整理です。',
    order: 2,
  },
  {
    id: 'github-rest-api-orgs',
    parent_id: 'github-rest-api',
    title: 'REST API — Organization',
    description: 'orgs カテゴリの公式 REST への導線と、組織レベル API を使うときの注意点です。',
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

  for (const ch of CHAPTERS) {
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
      console.error(`upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}`);
  }
}

main();
