/**
 * クラウド×DX・CCoE 言語とチャプターを追加するスクリプト
 * 実行: npx ts-node scripts/add-cloud-dx-chapters.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CLOUD_DX_CHAPTERS = [
  {
    id: 'cloud-dx-overview',
    title: 'DXとクラウドの関係',
    description: 'DX におけるクラウドの役割と、よくある課題を学びます。',
    order: 1,
  },
  {
    id: 'cloud-dx-ccoe',
    title: 'CCoEの役割と組織',
    description: 'Cloud Center of Excellence の役割、標準化、組織モデルを学びます。',
    order: 2,
  },
  {
    id: 'cloud-dx-governance',
    title: 'ガバナンスとランディングゾーン',
    description: 'アカウント戦略、IdP、セーフデフォルトとランディングゾーンを学びます。',
    order: 3,
  },
  {
    id: 'cloud-dx-platform',
    title: 'プラットフォームとセルフサービス',
    description: '内部開発者プラットフォームと CCoE との役割分担を学びます。',
    order: 4,
  },
  {
    id: 'cloud-dx-adoption',
    title: '普及と成熟度',
    description: '変革管理、成熟度の段階、クラウド投資の説明責任を学びます。',
    order: 5,
  },
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: existingLang } = await supabase
    .from('programming_languages')
    .select('id')
    .eq('id', 'cloud-dx')
    .single();

  if (!existingLang) {
    const { error: langError } = await supabase.from('programming_languages').upsert(
      {
        id: 'cloud-dx',
        title: 'クラウド×DXとCCoE',
        description:
          'デジタルトランスフォーメーションにおけるクラウド活用と CCoE の役割、ガバナンス、プラットフォーム、普及を学びます。',
        type: 'cloud',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (langError) {
      console.error('cloud-dx 言語の追加に失敗:', langError);
      process.exit(1);
    }
    console.log('✓ cloud-dx 言語を追加しました');
  } else {
    const { error: langUpdateError } = await supabase.from('programming_languages').upsert(
      {
        id: 'cloud-dx',
        title: 'クラウド×DXとCCoE',
        description:
          'デジタルトランスフォーメーションにおけるクラウド活用と CCoE の役割、ガバナンス、プラットフォーム、普及を学びます。',
        type: 'cloud',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (langUpdateError) {
      console.error('cloud-dx 言語の更新に失敗:', langUpdateError);
      process.exit(1);
    }
    console.log('✓ cloud-dx 言語を更新しました');
  }

  for (const ch of CLOUD_DX_CHAPTERS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'cloud-dx',
        parent_id: null,
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`エラー (${ch.id}):`, error);
      continue;
    }
    console.log(`✓ ${ch.id} を追加しました`);
  }

  console.log('\nクラウド×DX・CCoE チャプターの追加が完了しました。');
}

main();
