/**
 * Docker 言語とチャプターを追加するスクリプト
 * 実行: cd career-platform-nextjs && npx ts-node scripts/add-docker-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const DOCKER_CHAPTERS = [
  {
    id: 'docker-overview',
    title: 'Dockerとコンテナの概要',
    description: 'コンテナと VM の違い、イメージ・コンテナ・Dockerfile の関係を学びます。',
    order: 1,
  },
  {
    id: 'docker-images-registry',
    title: 'イメージとレジストリ',
    description: 'イメージの取得・管理、タグとダイジェスト、Docker Hub とレジストリの役割を学びます。',
    order: 2,
  },
  {
    id: 'docker-dockerfile-run',
    title: 'Dockerfile と build / run',
    description: 'Dockerfile の基本、docker build / run、レイヤキャッシュの考え方を学びます。',
    order: 3,
  },
  {
    id: 'docker-compose-networks-volumes',
    title: 'Compose・ネットワーク・ボリューム',
    description: 'Docker Compose、サービス間通信、ボリュームによるデータ永続化を学びます。',
    order: 4,
  },
  {
    id: 'docker-cicd-hardening',
    title: 'CI/CDとセキュリティ',
    description: 'パイプラインでのビルド、マルチステージビルド、コンテナのセキュリティ基礎を学びます。',
    order: 5,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { data: existingLang } = await supabase.from('programming_languages').select('id').eq('id', 'docker').single();

  if (!existingLang) {
    const { error: langError } = await supabase.from('programming_languages').upsert(
      {
        id: 'docker',
        title: 'Docker入門',
        description:
          'コンテナ技術の基礎、イメージ・Dockerfile・Compose、開発からCIまでの運用の考え方を学びます。',
        type: 'iaas',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (langError) {
      console.error('docker 言語の追加に失敗:', langError);
      process.exit(1);
    }
    console.log('✓ docker 言語を追加しました');
  } else {
    const { error: u } = await supabase.from('programming_languages').upsert(
      {
        id: 'docker',
        title: 'Docker入門',
        description:
          'コンテナ技術の基礎、イメージ・Dockerfile・Compose、開発からCIまでの運用の考え方を学びます。',
        type: 'iaas',
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (u) {
      console.error('docker 言語の更新に失敗:', u);
      process.exit(1);
    }
    console.log('✓ docker 言語を更新しました');
  }

  for (const ch of DOCKER_CHAPTERS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'docker',
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
    console.log(`✓ ${ch.id} を追加しました`);
  }

  console.log('\nDocker チャプターの追加が完了しました。');
}

main();
